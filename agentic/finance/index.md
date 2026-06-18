# Finance — Agentic Documentation

## Overview

This topic covers the Etendo Go finance domain as exposed through the MCP server. It maps the finance specs and report tools available to an MCP-only agent, and links to focused sub-guides for the two operational scenarios:

- **[Treasury](./treasury.md)** — financial accounts, payments in / payments out, manual transactions, payment terms and currency conversion rates.
- **[Bank reconciliation](./bank-reconciliation.md)** — import bank statements, process them, match transactions and reconcile a financial account.

All tool, spec, entity and column names below were verified at the time of writing through `etendo_neo_discover` and `etendo_neo_schema`. The set of specs the **current user** can see is role-dependent — always re-run `etendo_neo_discover` in your own environment before hard-coding anything.

## Prerequisites

- The Etendo Go MCP server is configured in your client. See [MCP setup](../mcp/index.md).
- The API user has a role that grants access to the finance windows (Financial Account, Payment In, Payment Out, Payment Term, Conversion Rates, Reconciliations).
- `etendo://status` is readable and `etendo_neo_discover` returns a non-empty `specs` array.

## Configuration

No additional configuration is needed beyond the base MCP server. The finance specs are exposed through the same generic `etendo_neo_*` tools and the same `etendo_generate_*` report tools described in the [MCP guide](../mcp/index.md).

## Available capabilities

### Write specs (CRUD windows)

Specs of type `W` expose one or more entities through the generic CRUD and metadata tools (`etendo_neo_list`, `etendo_neo_get`, `etendo_neo_create`, `etendo_neo_update`, `etendo_neo_delete`, `etendo_neo_schema`, `etendo_neo_defaults`, `etendo_neo_selectors`, `etendo_neo_action`, `etendo_neo_batch`).

| Spec | Main entities | Purpose | Sub-guide |
|------|---------------|---------|-----------|
| `financial-account` | `account`, `transaction`, `importedBankStatements`, `bankStatementLines`, `reconciliations`, `clearedItems`, `paymentMethod`, `bankConnections`, `accountingConfiguration`, `accountingHistory`, `accounting`, `exchangeRates` | Bank and cash accounts, their transactions, imported statements, reconciliations and matched items | [Treasury](./treasury.md) · [Bank reconciliation](./bank-reconciliation.md) |
| `payment-in` | `finPayment`, `finPaymentScheduleDetail`, `executionHistory`, `exchangeRates`, `usedCreditSource`, `accounting` | Incoming customer payments and their payment-plan details | [Treasury](./treasury.md) |
| `payment-out` | `header`, `lines`, `executionHistory`, `exchangeRates`, `usedCreditSource`, `accounting`, `bankPayments` | Outgoing vendor payments and their payment-plan details | [Treasury](./treasury.md) |
| `payment-term` | `header`, `lines`, `translation` | Payment terms (net days, maturity dates, split percentages) | [Treasury](./treasury.md) |
| `conversion-rates` | `conversionRate` | Currency conversion rates between two currencies for a date range | [Treasury](./treasury.md) |

### Report specs (rendered via `etendo_generate_*`)

Specs of type `R` are rendered through their dedicated report tool. They do not expose CRUD entities. Call the report tool with `parameters: {}` first to discover its required keys via the server's validation message.

| Spec | Report tool | Purpose |
|------|-------------|---------|
| `aging-receivable` | `etendo_generate_aging_receivable` | Aging of Receivables |
| `bank-statements` | `etendo_generate_bank_statements` | Bank statement list, import (C43), and lines view for a financial account |
| `financial-account-transactions` | `etendo_generate_financial_account_transactions` | Transactions list for a single financial account |
| `financial-accounts-page` | `etendo_generate_financial_accounts_page` | Financial Accounts page |
| `tax-report` | `etendo_generate_tax_report` | Tax Report |

All report tools accept an optional `format` argument (`pdf`, `xlsx`, `csv`; default `pdf`).

### Process buttons on finance entities

The finance entities expose Etendo process buttons that are fired through `etendo_neo_action`. The full list per entity is in the entity schema (`etendo_neo_schema(spec, entity)`); the buttons most relevant to finance workflows are:

| Entity | Button column | Process name | Used in |
|--------|---------------|--------------|---------|
| `financial-account/account` | `EM_APRM_ImportBankFile` | Import Statement | [Bank reconciliation](./bank-reconciliation.md) |
| `financial-account/account` | `EM_APRM_MatchTransactions` | Match Statement | [Bank reconciliation](./bank-reconciliation.md) |
| `financial-account/account` | `EM_APRM_Reconcile` | Reconcile | [Bank reconciliation](./bank-reconciliation.md) |
| `financial-account/account` | `EM_Aprm_Addtransactionpd` | Add Transaction | [Treasury](./treasury.md) |
| `financial-account/account` | `EM_Aprm_Funds_Trans` | Funds Transfer | [Treasury](./treasury.md) |
| `financial-account/importedBankStatements` | `EM_APRM_Process_BS` | Bank Statement Process | [Bank reconciliation](./bank-reconciliation.md) |
| `financial-account/reconciliations` | `EM_Aprm_Process_Rec` | Reconcile | [Bank reconciliation](./bank-reconciliation.md) |
| `financial-account/transaction` | `EM_Aprm_Processed` | Transaction Process | [Treasury](./treasury.md) |
| `financial-account/transaction` | `Posted` | Post | [Treasury](./treasury.md) |
| `payment-in/finPayment` | `EM_APRM_Process_Payment` | Payment Process | [Treasury](./treasury.md) |
| `payment-in/finPayment` | `EM_Aprm_Executepayment` | Execute Payment | [Treasury](./treasury.md) |
| `payment-in/finPayment` | `EM_APRM_ReversePayment` | Reverse Payment | [Treasury](./treasury.md) |
| `payment-out/header` | `EM_APRM_Process_Payment` | Payment Process | [Treasury](./treasury.md) |
| `payment-out/header` | `EM_Aprm_Executepayment` | Execute Payment | [Treasury](./treasury.md) |

The exact set of buttons on each entity (including their input parameters) is authoritative only in the live schema — call `etendo_neo_schema(spec, entity)` and inspect every field with `type: "button"` and `invokeVia: "neo_action"` before firing.

## End-to-end usage example

This minimal walkthrough lists active financial accounts and renders the Financial Accounts page report.

### Step 1 — List financial accounts

```json
{
  "tool": "etendo_neo_list",
  "arguments": {
    "spec": "financial-account",
    "entity": "account",
    "limit": 20,
    "orderBy": "name"
  }
}
```

The response is a paginated list of `FIN_Financial_Account` records with their `id`, `name`, `currency`, `type` (`B` = Bank, `C` = Cash), `currentBalance`, `creditLimit`, `iBAN` and `default` flag.

### Step 2 — Inspect one account schema before any write

```json
{
  "tool": "etendo_neo_schema",
  "arguments": { "spec": "financial-account", "entity": "account" }
}
```

The schema response is the only authoritative source of field names, required flags, default expressions and the list of buttons available for `etendo_neo_action`.

### Step 3 — Render the Financial Accounts page

```json
{
  "tool": "etendo_generate_financial_accounts_page",
  "arguments": { "parameters": {} }
}
```

If the call fails with a validation message, read the message to discover the required keys, fill them in, and retry. The optional `format` argument selects `pdf` (default), `xlsx` or `csv`.

## Error handling

Errors from the finance specs follow the generic MCP error model described in [MCP — Error handling](../mcp/index.md#error-handling). The points specific to finance workflows are:

| Symptom | Likely cause | Resolution |
|---------|--------------|------------|
| `etendo_neo_discover` returns no finance specs | API user role lacks access to the Financial Account, Payment, Payment Term or Conversion Rate windows | Assign the relevant finance role; re-run `etendo_neo_discover` |
| `etendo_neo_action` on a button returns `processResult: "error"` | The underlying Etendo process raised a validation, state-machine or business-rule error | Read `processMessage` verbatim; consult the corresponding sub-guide for the prerequisites the process expects |
| Selector for `paymentMethod`, `account`, `documentType` returns no rows | The current account / business partner / organisation does not have that FK configured | Open the parent window in the Etendo UI to verify the FK is set up before retrying |
| `etendo_generate_*` returns a validation error on the first call with empty `parameters` | Expected — use the message to discover the required keys | Fill the keys reported by the server and retry |

Enum codes for `list`-typed fields (for example `type` on a financial account, `status` on a payment, `documentStatus` on a reconciliation) are not enumerated in this guide. Resolve them at runtime by reading the field's value list from `etendo_neo_schema` (the field metadata includes the allowed values when the underlying reference is a list reference) or by inspecting existing records via `etendo_neo_list`.
