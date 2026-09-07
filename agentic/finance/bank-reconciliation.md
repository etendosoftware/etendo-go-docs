# Bank reconciliation

## Overview

This guide walks an MCP-only agent through the full bank-reconciliation flow on a single financial account in Etendo Go:

1. **Import** a bank file (e.g. a Spanish C43 statement) — creates an `importedBankStatements` record and its `bankStatementLines`.
2. **Process** the imported statement — generates the underlying `transaction` rows and marks the statement as processed.
3. **Match** statement lines against existing payments / transactions.
4. **Reconcile** the financial account — creates a `reconciliations` record and links the matched items as `clearedItems`.

All spec, entity, column and action names below were verified through `neo_schema`. Process-specific input parameters (file contents, statement file format, force flags) are **to-be-discovered at runtime**: call `neo_action` with `parameters: {}` first and use the server's validation message to learn the required keys.

## Prerequisites

- The Etendo Go MCP server is reachable and authenticated.
- The current API user can access the `financial-account` spec and its entities `account`, `importedBankStatements`, `bankStatementLines`, `reconciliations`, `clearedItems`.
- There is at least one configured financial account with a matching algorithm assigned (`FIN_Matching_Algorithm_ID`) — otherwise `EM_APRM_MatchTransactions` cannot run.
- Optionally a bank-statement document type is configured (`C_Doctype_ID` on `FIN_BankStatement`).

## Entity map

| Entity | Table | Role |
|--------|-------|------|
| `financial-account/account` | `FIN_Financial_Account` | The bank / cash account being reconciled. Holds the `EM_APRM_ImportBankFile`, `EM_APRM_MatchTransactions` and `EM_APRM_Reconcile` action buttons |
| `financial-account/importedBankStatements` | `FIN_BankStatement` | One imported statement (one file) for an account. Carries `Statementdate`, `Importdate`, `EM_ETGO_*` counters and the `EM_APRM_Process_BS` button |
| `financial-account/bankStatementLines` | `FIN_BankStatementLine` | The individual lines of an imported statement: `Datetrx`, `Cramount`, `Dramount`, `Referenceno`, `Matchingtype`, `Matched_Document`, optional FK to `financialAccountTransaction` once matched |
| `financial-account/transaction` | `FIN_Finacc_Transaction` | The actual financial-account transactions (deposits, withdrawals, payments). After `Process Statement` runs, the bank statement lines are linked to transactions through `FIN_FinAcc_Transaction_ID` |
| `financial-account/reconciliations` | `FIN_Reconciliation` | One reconciliation document for the account. Holds `Statementdate`, `Endingbalance`, `Startingbalance`, `Docstatus`, the counters `EM_APRM_ReconciledItemNo` / `EM_APRM_UnReconciledItemNo` and the `EM_Aprm_Process_Rec` (Reconcile) button |
| `financial-account/clearedItems` | `FIN_ReconciliationLine_v` (view) | The cleared transactions / payments linked to a reconciliation (`FIN_Reconciliation_ID`) and optionally to a `bankStatementLine` |

Every step below is anchored to one of these entities.

## Step-by-step flow

### Step 1 — Locate the financial account

```json
{
  "tool": "neo_list",
  "arguments": {
    "spec": "financial-account",
    "entity": "account",
    "filters": { "iBAN": "ES0000000000000000000000" },
    "limit": 5
  }
}
```

Use any combination of `name`, `iBAN`, `accountNo` or `default: true` to find the target account. Keep its `id` for every subsequent step.

### Step 2 — Discover the action parameters

The `financial-account/account` entity exposes the import / match / reconcile buttons. Read the schema once to confirm the buttons exist in the current instance and capture their column names:

```json
{
  "tool": "neo_schema",
  "arguments": { "spec": "financial-account", "entity": "account" }
}
```

The relevant buttons (verified at the time of writing):

| Column | Process name | Process ID |
|--------|--------------|------------|
| `EM_APRM_ImportBankFile` | Import Statement | `7AC7BE9024E448A0BB863C159DA762F9` |
| `EM_APRM_MatchTransactions` | Match Statement | `86F0B1EBE2BC48E3ACF458768D14CC99` |
| `EM_APRM_MatchTrans_Force` | Match Statement (forced) | `86F0B1EBE2BC48E3ACF458768D14CC99` |
| `EM_APRM_Reconcile` | Reconcile | `EB3D56BDD37E4229B67DBAB9F9A9B167` |

### Step 3 — Import the bank file

Fire `EM_APRM_ImportBankFile` on the account. The input parameters of this Classic process (file content, file format / bank format, statement date) are not part of the entity schema and must be discovered at runtime — call once with `parameters: {}` and read the validation message:

```json
{
  "tool": "neo_action",
  "arguments": {
    "spec": "financial-account",
    "entity": "account",
    "id": "<financial-account-id>",
    "action": "EM_APRM_ImportBankFile",
    "parameters": {}
  }
}
```

When the call succeeds, the server creates one `FIN_BankStatement` record (entity `importedBankStatements`) plus its `FIN_BankStatementLine` records, both linked to the financial account.

Verify the import:

```json
{
  "tool": "neo_list",
  "arguments": {
    "spec": "financial-account",
    "entity": "importedBankStatements",
    "filters": { "account": "<financial-account-id>" },
    "orderBy": "-importdate",
    "limit": 5
  }
}
```

Inspect the produced lines:

```json
{
  "tool": "neo_list",
  "arguments": {
    "spec": "financial-account",
    "entity": "bankStatementLines",
    "filters": { "bankStatement": "<bank-statement-id>" },
    "orderBy": "lineNo"
  }
}
```

Each `bankStatementLines` record carries the verified columns: `Datetrx` (`transactionDate`), `Cramount`, `Dramount`, `Referenceno`, `Bpartnername`, optional `C_Bpartner_ID`, `Description`, `EM_C43_Description`, `Matchingtype`, `Matched_Document`, and once matched, a FK to `FIN_FinAcc_Transaction_ID` through the `financialAccountTransaction` field.

### Step 4 — Process the imported statement

Fire the `EM_APRM_Process_BS` button on the statement to turn the lines into financial-account transactions:

```json
{
  "tool": "neo_action",
  "arguments": {
    "spec": "financial-account",
    "entity": "importedBankStatements",
    "id": "<bank-statement-id>",
    "action": "EM_APRM_Process_BS",
    "parameters": {}
  }
}
```

After a successful run the statement's `Processed` flag becomes `Y`, its `EM_ETGO_*` counters (`EM_ETGO_Line_Count`, `EM_ETGO_Matched_Count`, `EM_ETGO_Total_In`, `EM_ETGO_Total_Out`) are refreshed, and a `FIN_Finacc_Transaction` row exists for every statement line. Use `EM_APRM_Process_BS_Force` (`aPRMProcessBankStatementForce`) only if the standard process is blocked and you have authorisation to force-post.

### Step 5 — Match statement lines to existing payments

Fire `EM_APRM_MatchTransactions` on the financial account. The process is driven by the matching algorithm assigned to the account (`FIN_Matching_Algorithm_ID`) and writes the resolved FK into `FIN_BankStatementLine.FIN_FinAcc_Transaction_ID` and updates `Matchingtype` / `Matched_Document`:

```json
{
  "tool": "neo_action",
  "arguments": {
    "spec": "financial-account",
    "entity": "account",
    "id": "<financial-account-id>",
    "action": "EM_APRM_MatchTransactions",
    "parameters": {}
  }
}
```

To force-match (override the algorithm's confidence threshold) use the column `EM_APRM_MatchTrans_Force` instead. The exact parameter shape (line scope, confidence threshold) is to be discovered through the validation message on an empty call.

Re-list `bankStatementLines` after the call to see which lines were matched:

```json
{
  "tool": "neo_list",
  "arguments": {
    "spec": "financial-account",
    "entity": "bankStatementLines",
    "filters": {
      "bankStatement": "<bank-statement-id>",
      "matchingtype": "<list-value-for-matched>"
    }
  }
}
```

Resolve `matchingtype` values from the field's list reference (`neo_schema("financial-account", "bankStatementLines")`) before filtering.

### Step 6 — Find / add missing matches manually (optional)

When the automatic match leaves lines unmatched, the `financial-account/account` entity exposes two complementary buttons:

| Column | Process |
|--------|---------|
| `EM_Aprm_Findtransactionspd` | Find Transactions to Match |
| `EM_Aprm_Addtransactionpd` | Add Transaction |

Fire either with `parameters: {}` first to discover their input shape. They typically take the bank-statement line id and the candidate transaction id.

### Step 7 — Reconcile

Fire `EM_APRM_Reconcile` on the financial account. Etendo creates a `FIN_Reconciliation` document (entity `reconciliations`) and binds every cleared item to it:

```json
{
  "tool": "neo_action",
  "arguments": {
    "spec": "financial-account",
    "entity": "account",
    "id": "<financial-account-id>",
    "action": "EM_APRM_Reconcile",
    "parameters": {}
  }
}
```

Locate the resulting reconciliation:

```json
{
  "tool": "neo_list",
  "arguments": {
    "spec": "financial-account",
    "entity": "reconciliations",
    "filters": { "account": "<financial-account-id>" },
    "orderBy": "-transactionDate",
    "limit": 1
  }
}
```

The reconciliation record carries `documentNo`, `Statementdate`, `Endingbalance`, `Startingbalance`, `Docstatus` plus the verified summary counters: `EM_APRM_ReconciledItemNo`, `EM_APRM_ReconciledItemAmount`, `EM_APRM_UnReconciledItemNo`, `EM_APRM_UnReconciledItemAmount`, `EM_APRM_OutstandingPaymentsItemNo`, `EM_APRM_OutstandingPaymentsItemsAmount`, `EM_APRM_OutstandingDepositsItemNo`, `EM_APRM_OutstandingDepositItemsAmount`.

### Step 8 — Inspect the cleared items

```json
{
  "tool": "neo_list",
  "arguments": {
    "spec": "financial-account",
    "entity": "clearedItems",
    "filters": { "reconciliation": "<reconciliation-id>" },
    "limit": 100
  }
}
```

Each row exposes the FKs needed to drill into the underlying record: `financialAccountTransaction` (`FIN_Finacc_Transaction_ID`), `payment` (`FIN_Payment_ID`), `bankStatementLine` (`FIN_Bankstatementline_ID`), plus the amounts `Paymentamt`, `Depositamt` and the dimensions (`project`, `salesCampaign`, `activity`, `costCenter`, `stDimension`, `ndDimension`).

### Step 9 — Post and print

`reconciliations` exposes three additional buttons. Use `neo_action` with `parameters: {}` first to discover their input keys.

| Column | Process |
|--------|---------|
| `Posted` | Post (book the reconciliation entries to the GL) |
| `EM_APRM_PrintDetailed` | Reconciliation Details |
| `EM_APRM_PrintSummary` | Reconciliation Summary |
| `EM_Aprm_Process_Rec` | Reconcile (re-run if `Docstatus` allows it) |
| `EM_APRM_Process_Rec_Force` | Reconciliation Process Force |

Example — post the reconciliation:

```json
{
  "tool": "neo_action",
  "arguments": {
    "spec": "financial-account",
    "entity": "reconciliations",
    "id": "<reconciliation-id>",
    "action": "Posted",
    "parameters": {}
  }
}
```

## End-to-end example (compact)

```json
[
  { "tool": "neo_list",   "arguments": { "spec": "financial-account", "entity": "account", "filters": { "default": true }, "limit": 1 } },
  { "tool": "neo_action", "arguments": { "spec": "financial-account", "entity": "account", "id": "<acc>", "action": "EM_APRM_ImportBankFile", "parameters": { "/* resolved from validation message */": "" } } },
  { "tool": "neo_list",   "arguments": { "spec": "financial-account", "entity": "importedBankStatements", "filters": { "account": "<acc>" }, "orderBy": "-importdate", "limit": 1 } },
  { "tool": "neo_action", "arguments": { "spec": "financial-account", "entity": "importedBankStatements", "id": "<bs>", "action": "EM_APRM_Process_BS", "parameters": {} } },
  { "tool": "neo_action", "arguments": { "spec": "financial-account", "entity": "account", "id": "<acc>", "action": "EM_APRM_MatchTransactions", "parameters": {} } },
  { "tool": "neo_action", "arguments": { "spec": "financial-account", "entity": "account", "id": "<acc>", "action": "EM_APRM_Reconcile", "parameters": {} } },
  { "tool": "neo_list",   "arguments": { "spec": "financial-account", "entity": "reconciliations", "filters": { "account": "<acc>" }, "orderBy": "-transactionDate", "limit": 1 } },
  { "tool": "neo_list",   "arguments": { "spec": "financial-account", "entity": "clearedItems", "filters": { "reconciliation": "<rec>" } } }
]
```

## Reports related to bank reconciliation

| Tool | Use case |
|------|----------|
| `generate_bank_statements` | Bank statement list, import (C43), and lines view for a financial account |
| `generate_financial_account_transactions` | Transactions list for a single financial account |

Call each with `parameters: {}` first to discover the required keys via the validation message.

## Error handling

| Symptom | Likely cause | Resolution |
|---------|--------------|------------|
| `EM_APRM_ImportBankFile` returns `processResult: "error"` | File content or format parameter missing / invalid for the configured bank format | Call once with `parameters: {}`, read the validation message, fill the required keys, retry |
| `importedBankStatements` is created but no `bankStatementLines` | The bank format parser produced no recognised lines | Inspect the imported file's encoding and format; reconfigure `BankFormat` on the account if needed |
| `EM_APRM_Process_BS` returns `processResult: "error"` | The statement was already processed, or transactions cannot be created due to missing `paymentMethod` / matching configuration | Read `processMessage`; if the statement is already processed, re-list to confirm `processed: true` |
| `EM_APRM_MatchTransactions` returns `processResult: "warning"` with low match counts | The matching algorithm assigned to the account did not match enough lines | Use `EM_APRM_MatchTrans_Force`, or call `EM_Aprm_Findtransactionspd` / `EM_Aprm_Addtransactionpd` to add manual matches |
| `EM_APRM_Reconcile` returns `processResult: "error"` | Reconciliation cannot be created — typically because there are no cleared items, or the ending balance does not balance | Inspect the unmatched lines via `bankStatementLines` and add manual matches; verify `endingBalance` on the underlying record |
| `Posted` on a reconciliation returns a warning | The reconciliation was posted but Etendo flagged an accounting note (rounding, period closed, dimension missing) | Treat as posted and surface `processMessage` to the user |

Enum values for `matchingtype`, `Matched_Document` and `Docstatus`, plus the input parameter shape of every Classic process, are intentionally not enumerated in this guide. They are **to-be-resolved at runtime**:

- For `list`-typed fields, read the value list from the response of `neo_schema` for the entity that owns the field, or sample existing records with `neo_list`.
- For process input parameters, fire `neo_action` with `parameters: {}` and let the server's validation message report the required keys.
