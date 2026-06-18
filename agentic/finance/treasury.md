# Treasury

## Overview

This guide documents the MCP operations that cover the day-to-day treasury work in Etendo Go:

- Maintain **financial accounts** (`financial-account/account`) — bank and cash accounts.
- Record **incoming customer payments** (`payment-in/finPayment`).
- Record **outgoing vendor payments** (`payment-out/header` + `payment-out/lines`).
- Record **manual financial transactions** on an account (`financial-account/transaction`).
- Maintain **payment terms** (`payment-term/header` + `payment-term/lines`).
- Maintain **currency conversion rates** (`conversion-rates/conversionRate`).

All field names, column names and action button names below were verified through `etendo_neo_schema`. Enum codes for `list`-typed fields and concrete FK IDs are **not** invented — they must be resolved at runtime via `etendo_neo_schema`, `etendo_neo_selectors` or `etendo_neo_list`.

## Prerequisites

- The Etendo Go MCP server is reachable and authenticated.
- The current API user can access the `financial-account`, `payment-in`, `payment-out`, `payment-term` and `conversion-rates` specs (verify with `etendo_neo_discover`).
- A target organisation exists with at least one configured currency and one document type for payments (`DocBaseType` in `APP` / `ARR`).

## Discover first, write later

Every write operation in this guide must be preceded by:

1. `etendo_neo_schema(spec, entity)` — to know the real field set, which fields are `required`, which are `readOnly` and which fields have FK selectors.
2. `etendo_neo_selectors(spec, entity, column, …)` — to resolve every FK value (currency, business partner, document type, payment method, account, etc.).
3. Optionally `etendo_neo_defaults(spec, entity, parentId?)` — to preview server-computed defaults.

Do not skip discovery. Field labels and the set of `EM_*` extension columns vary across instances (modules installed, customisation).

## Financial accounts

Spec: `financial-account` · Entity: `account` · Table: `FIN_Financial_Account`.

### Required writable fields (from schema)

| Field | Column | Type | Notes |
|-------|--------|------|-------|
| `name` | `Name` | string | Display name |
| `currency` | `C_Currency_ID` | foreignKey | Resolve via selector |
| `type` | `Type` | list | Default `B` (Bank). Resolve allowed list values from schema |
| `currentBalance` | `Currentbalance` | number | Default `0` |
| `creditLimit` | `Creditlimit` | number | Default `0` |
| `default` | `Isdefault` | boolean | Default `N` |
| `initialBalance` | `InitialBalance` | number | Default `0` |
| `aprmIsfundstransEnabled` | `EM_Aprm_Isfundstrans_Enabled` | boolean | Default `Y` |

Optional but commonly set: `description`, `businessPartner`, `locationAddress`, `iBAN`, `swiftCode`, `accountNo`, `bankCode`, `branchCode`, `country`, `matchingAlgorithm`, `bankFormat`.

### List and read

```json
{
  "tool": "etendo_neo_list",
  "arguments": {
    "spec": "financial-account",
    "entity": "account",
    "filters": { "default": true },
    "limit": 10,
    "orderBy": "name"
  }
}
```

```json
{
  "tool": "etendo_neo_get",
  "arguments": {
    "spec": "financial-account",
    "entity": "account",
    "id": "<financial-account-id>"
  }
}
```

### Create a bank account

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "financial-account",
    "entity": "account",
    "column": "currency",
    "query": "EUR"
  }
}
```

```json
{
  "tool": "etendo_neo_create",
  "arguments": {
    "spec": "financial-account",
    "entity": "account",
    "fields": {
      "name": "Main EUR Bank",
      "currency": "<currency-id>",
      "type": "<list-value-for-Bank>",
      "iBAN": "ES0000000000000000000000",
      "default": false
    }
  }
}
```

Resolve `type` from the `list` reference returned by `etendo_neo_schema` — do not hard-code `"B"` without confirming it is the active code in your instance.

### Available process buttons

Trigger via `etendo_neo_action(spec="financial-account", entity="account", id=<account-id>, action=<column>)`:

| Column | Process |
|--------|---------|
| `EM_Aprm_Addtransactionpd` | Add Transaction |
| `EM_Aprm_Findtransactionspd` | Find Transactions to Match |
| `EM_Aprm_AddMultiplePayments` | Add Multiple Payments |
| `EM_Aprm_Funds_Trans` | Funds Transfer |
| `EM_APRM_ImportBankFile` | Import Statement (see [Bank reconciliation](./bank-reconciliation.md)) |
| `EM_APRM_MatchTransactions` | Match Statement (see [Bank reconciliation](./bank-reconciliation.md)) |
| `EM_APRM_Reconcile` | Reconcile (see [Bank reconciliation](./bank-reconciliation.md)) |

For each button, the input shape of `parameters` is process-specific. If you do not know it, call `etendo_neo_action` with `parameters: {}` first and let the server report the required keys.

## Manual transactions

Spec: `financial-account` · Entity: `transaction` · Table: `FIN_Finacc_Transaction`.

### Required writable fields

| Field | Column | Type | Notes |
|-------|--------|------|-------|
| `account` | `Fin_Financial_Account_ID` | foreignKey | Parent FK |
| `currency` | `C_Currency_ID` | foreignKey | Defaults to `@C_Currency_ID@` |
| `paymentAmount` | `Paymentamt` | number | Default `0` |
| `depositAmount` | `Depositamt` | number | Default `0` |
| `dateAcct` | `DateAcct` | date | Default today |
| `transactionDate` | `Statementdate` | date | Default today |
| `transactionType` | `Trxtype` | list | Default `BPD`; resolve from schema |
| `status` | `Status` | list | Default `'RPAP'`; resolve from schema |
| `lineNo` | `Line` | number | Auto-calculated as `MAX(LINE)+10` |
| `createdByAlgorithm` | `CreatedByAlgorithm` | boolean | Default `N` |

Optional FKs commonly used: `finPayment`, `gLItem`, `project`, `salesCampaign`, `activity`, `stDimension`, `ndDimension`, `businessPartner`, `product`, `salesRegion`, `costCenter`.

### Create and process

```json
{
  "tool": "etendo_neo_create",
  "arguments": {
    "spec": "financial-account",
    "entity": "transaction",
    "fields": {
      "account": "<financial-account-id>",
      "currency": "<currency-id>",
      "depositAmount": 150.00,
      "paymentAmount": 0,
      "transactionDate": "2026-06-18",
      "dateAcct": "2026-06-18",
      "description": "Manual deposit"
    }
  }
}
```

Process the transaction (`EM_Aprm_Processed` button → process `Transaction Process`):

```json
{
  "tool": "etendo_neo_action",
  "arguments": {
    "spec": "financial-account",
    "entity": "transaction",
    "id": "<transaction-id>",
    "action": "EM_Aprm_Processed",
    "parameters": {}
  }
}
```

Post to the general ledger (`Posted` button → process `Post`):

```json
{
  "tool": "etendo_neo_action",
  "arguments": {
    "spec": "financial-account",
    "entity": "transaction",
    "id": "<transaction-id>",
    "action": "Posted"
  }
}
```

`processResult: "success" | "warning" | "error"` is returned in the body — read `processMessage` on `warning` and `error`.

## Payments in (customer receipts)

Spec: `payment-in` · Entity: `finPayment` · Table: `FIN_Payment`.

### Required writable fields

| Field | Column | Type | Notes |
|-------|--------|------|-------|
| `currency` | `C_Currency_ID` | foreignKey | |
| `amount` | `Amount` | number | Default `0` |
| `writeoffAmount` | `Writeoffamt` | number | Default `0` |
| `processed` | `Processed` | boolean | Default `N` (read-only after process) |
| `processNow` | `Processing` | boolean | Default `N` |
| `account` | `Fin_Financial_Account_ID` | foreignKey | Destination account |
| `paymentMethod` | `Fin_Paymentmethod_ID` | foreignKey | |
| `status` | `Status` | list | Default `RPAP`; resolve from schema |
| `documentType` | `C_DocType_ID` | foreignKey | Restricted to `DocBaseType IN ('APP','ARR')` and `IsSOTrx='@Isreceipt@'` |
| `financialTransactionConvertRate` | `Finacc_Txn_Convert_Rate` | number | Default `1.0` |
| `financialTransactionAmount` | `Finacc_Txn_Amount` | number | |
| `createdByAlgorithm` | `CreatedByAlgorithm` | boolean | Default `N` |
| `aPRMReversePayment` | `EM_APRM_ReversePayment` | button | Required + default `N` |
| `aeatsiiSend` | `EM_Aeatsii_Send` | button | Required + default `N` (SII only) |
| `aeatsiiIssent` | `EM_Aeatsii_Issent` | boolean | Required + default `N` (SII only) |

`documentNo` and `id` are `readOnly` — omit on create. `receipt` (`Isreceipt`) defaults to `@FIN_ISRECEIPT@` and is auto-set by the spec for incoming payments.

### Create a customer receipt

Resolve FKs first:

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "payment-in",
    "entity": "finPayment",
    "column": "businessPartner",
    "query": "Acme"
  }
}
```

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "payment-in",
    "entity": "finPayment",
    "column": "account",
    "query": ""
  }
}
```

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "payment-in",
    "entity": "finPayment",
    "column": "paymentMethod",
    "recordContext": { "account": "<account-id>" }
  }
}
```

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "payment-in",
    "entity": "finPayment",
    "column": "documentType",
    "recordContext": { "receipt": true }
  }
}
```

Then create:

```json
{
  "tool": "etendo_neo_create",
  "arguments": {
    "spec": "payment-in",
    "entity": "finPayment",
    "fields": {
      "businessPartner": "<bp-id>",
      "currency": "<currency-id>",
      "account": "<account-id>",
      "paymentMethod": "<payment-method-id>",
      "documentType": "<doctype-id>",
      "amount": 500.00,
      "paymentDate": "2026-06-18",
      "description": "Receipt for invoice INV-001"
    }
  }
}
```

### Link the receipt to an invoice or order

The schedule details — that is, the lines that link this payment to one or more invoice / order payment schedules — are written into the entity `payment-in/finPaymentScheduleDetail`. Inspect its schema with `etendo_neo_schema("payment-in", "finPaymentScheduleDetail")` and resolve the FKs to the payment-in header and the target schedule before creating each line.

Alternatively, fire the `EM_Aprm_Add_Scheduledpayments` button (process `Add Payment`) on the header to let Etendo auto-create the schedule details:

```json
{
  "tool": "etendo_neo_action",
  "arguments": {
    "spec": "payment-in",
    "entity": "finPayment",
    "id": "<payment-id>",
    "action": "EM_Aprm_Add_Scheduledpayments",
    "parameters": {}
  }
}
```

The required parameter keys for this process must be discovered from the empty-call validation message.

### Process and post

| Step | Action column | Process |
|------|---------------|---------|
| Process the payment (move to `RPR` — Received) | `EM_APRM_Process_Payment` | Payment Process |
| Execute payment through configured method | `EM_Aprm_Executepayment` | Execute Payment |
| Reconcile against transaction | `EM_APRM_Reconcile_Payment` | (process not exposed in schema metadata) |
| Reverse the payment | `EM_APRM_ReversePayment` | Reverse Payment |
| Post to the GL | `Posted` | Post |

Example — process:

```json
{
  "tool": "etendo_neo_action",
  "arguments": {
    "spec": "payment-in",
    "entity": "finPayment",
    "id": "<payment-id>",
    "action": "EM_APRM_Process_Payment",
    "parameters": {}
  }
}
```

## Payments out (vendor payments)

Spec: `payment-out` · Header entity: `header` · Lines entity: `lines`.

### Header (`payment-out/header`)

`payment-out/header` and `payment-in/finPayment` share the same underlying table `FIN_Payment`. The required writable field set is identical to the one documented above for `payment-in/finPayment` (same columns: `currency`, `amount`, `account`, `paymentMethod`, `documentType` filtered by `IsSOTrx='@Isreceipt@'`, `status`, etc.) — only the spec name and the default value for `receipt` differ.

### Lines (`payment-out/lines`)

Table: `FIN_Payment_ScheduleDetail`. Required writable fields:

| Field | Column | Type | Notes |
|-------|--------|------|-------|
| `paymentDetails` | `FIN_Payment_Detail_ID` | foreignKey | Parent payment detail |
| `amount` | `Amount` | number | Default `0` |
| `canceled` | `Iscanceled` | boolean | Default `N` |
| `invoicePaid` | `Isinvoicepaid` | boolean | Default `N` |
| `doubtfulDebtAmount` | `DoubtfulDebt_Amount` | number | Default `0` |
| `etvfacPaymentZero` | `EM_Etvfac_Payment_Zero` | boolean | Default `N` |

Optional FKs: `orderPaymentSchedule` (`FIN_Payment_Schedule_Order`), `invoicePaymentSchedule` (`FIN_Payment_Schedule_Invoice`), `businessPartner`, `product`, `project`, `salesCampaign`, `salesRegion`, `activity`, `costCenter`, `stDimension`, `ndDimension`, `aPRMFinancialAccount`, `aPRMPaymentMethod`.

### Atomic header + lines creation

Use `etendo_neo_batch` to create a payment-out header and its lines in a single transaction. Use `parentRef` on the line ops to point to the header op:

```json
{
  "tool": "etendo_neo_batch",
  "arguments": {
    "operations": [
      {
        "id": "h1",
        "spec": "payment-out",
        "entity": "header",
        "body": {
          "businessPartner": "<vendor-id>",
          "currency": "<currency-id>",
          "account": "<account-id>",
          "paymentMethod": "<payment-method-id>",
          "documentType": "<doctype-id>",
          "amount": 1000.00,
          "paymentDate": "2026-06-18"
        }
      }
    ]
  }
}
```

Inspect `payment-out/lines` schema and resolve the `paymentDetails` FK before adding line ops. The exact relationship between a payment header and its `FIN_Payment_Detail_ID` records is discoverable via `etendo_neo_schema("payment-out", "lines")`.

### Process and post

Identical button set to `payment-in/finPayment`: `EM_APRM_Process_Payment`, `EM_Aprm_Executepayment`, `EM_APRM_ReversePayment`, `Posted`.

## Payment terms

Spec: `payment-term` · Entities: `header`, `lines`, `translation`.

### Header (`payment-term/header`, table `C_PaymentTerm`)

Required writable fields:

| Field | Column | Type | Notes |
|-------|--------|------|-------|
| `valid` | `IsValid` | boolean | Server-validated flag — Etendo recomputes it when lines change |
| `searchKey` | `Value` | string | Business key |
| `name` | `Name` | string | Display name |
| `overduePaymentDaysRule` | `NetDays` | number | Net days |
| `offsetMonthDue` | `FixMonthOffset` | number | |
| `fixedDueDate` | `IsDueFixed` | boolean | |

Optional: `description`, `comments`, `overduePaymentDayRule`, `nextBusinessDay`, `default`, `maturityDate1` (`FixMonthDay`), `maturityDate2` (`FixMonthDay2`), `maturityDate3` (`Fixmonthday3`).

### Lines (`payment-term/lines`, table `C_Paymenttermline`)

Required writable fields:

| Field | Column | Type | Notes |
|-------|--------|------|-------|
| `paymentTerms` | `C_PaymentTerm_ID` | foreignKey | Parent FK |
| `lineNo` | `Line` | number | Auto `MAX(LINE)+10` |
| `percentageDue` | `Percentage` | number | Default `100` |
| `rest` | `Onremainder` | boolean | Default `Y` (line collects the remainder) |
| `excludeTax` | `Excludetax` | boolean | Default `N` |
| `fixedDueDate` | `IsDueFixed` | boolean | Default `N` |
| `overduePaymentDaysRule` | `NetDays` | number | |

Optional: `formOfPayment` (`PaymentRule`), `lastDayCutoff`, `maturityDate1` / `2` / `3`, `offsetMonthDue`, `nextBusinessDay`, `paymentMethod`.

### Create payment term atomically

```json
{
  "tool": "etendo_neo_batch",
  "arguments": {
    "operations": [
      {
        "id": "pt1",
        "spec": "payment-term",
        "entity": "header",
        "body": {
          "searchKey": "NET30",
          "name": "Net 30",
          "overduePaymentDaysRule": 30,
          "offsetMonthDue": 0,
          "fixedDueDate": false,
          "valid": true
        }
      },
      {
        "id": "pt1l1",
        "spec": "payment-term",
        "entity": "lines",
        "parentRef": "pt1",
        "body": {
          "percentageDue": 100,
          "rest": true,
          "excludeTax": false,
          "fixedDueDate": false,
          "overduePaymentDaysRule": 30
        }
      }
    ]
  }
}
```

## Currency conversion rates

Spec: `conversion-rates` · Entity: `conversionRate` · Table: `C_Conversion_Rate`.

### Required writable fields

| Field | Column | Type | Notes |
|-------|--------|------|-------|
| `validFromDate` | `ValidFrom` | date | |
| `multipleRateBy` | `MultiplyRate` | number | |
| `divideRateBy` | `DivideRate` | number | |
| `currency` | `C_Currency_ID` | foreignKey | From-currency. Default = client's currency |
| `toCurrency` | `C_Currency_ID_To` | foreignKey | To-currency |
| `conversionRateType` | `ConversionRateType` | list | Default `S` (Spot); resolve from schema |

Optional: `validToDate` (`ValidTo`).

### Create a EUR → USD spot rate

```json
{
  "tool": "etendo_neo_create",
  "arguments": {
    "spec": "conversion-rates",
    "entity": "conversionRate",
    "fields": {
      "validFromDate": "2026-06-18",
      "validToDate": "2026-12-31",
      "currency": "<eur-currency-id>",
      "toCurrency": "<usd-currency-id>",
      "multipleRateBy": 1.0850,
      "divideRateBy": 0.9217,
      "conversionRateType": "<list-value-for-Spot>"
    }
  }
}
```

`conversionRateType` is a list reference — resolve its concrete code from the schema response rather than hard-coding `"S"`.

## Reports

Treasury workflows surface three pre-built reports through MCP. Call each with `parameters: {}` first to discover the required keys via the validation message.

| Tool | Use case |
|------|----------|
| `etendo_generate_financial_accounts_page` | Overview of every financial account (balances, currency, type) |
| `etendo_generate_financial_account_transactions` | Transactions of a single account for a period |
| `etendo_generate_aging_receivable` | Aging buckets of customer receivables |

Example:

```json
{
  "tool": "etendo_generate_financial_account_transactions",
  "arguments": {
    "format": "pdf",
    "parameters": {}
  }
}
```

The first call returns a validation message listing the required keys (typically the account, the date range and any filtering options). Fill them and retry.

## Error handling

| Symptom | Likely cause | Resolution |
|---------|--------------|------------|
| `etendo_neo_create` rejects `type`, `transactionType`, `status`, `conversionRateType` | A list code that does not exist in the instance was passed | Re-read the field metadata from `etendo_neo_schema`; never hard-code list codes |
| `etendo_neo_create` on payment rejects `documentType` | The submitted document type does not match `DocBaseType IN ('APP','ARR')` and `IsSOTrx='@Isreceipt@'` | Resolve via `etendo_neo_selectors` with the correct `receipt` context |
| `etendo_neo_action("EM_APRM_Process_Payment")` returns `processResult: "error"` | Payment is missing amount allocation, has an inconsistent currency / conversion rate, or the document type does not allow auto-processing | Read `processMessage`; surface it verbatim; do not retry the same payload |
| `etendo_neo_action("EM_Aprm_Executepayment")` returns an error about the payment method | The `paymentMethod` configured on the account does not have an execution process | Switch to a payment method that supports execution, or run `EM_Aprm_Add_Scheduledpayments` first |
| `etendo_neo_action("Posted")` returns a warning | The transaction or payment was posted but Etendo flagged an accounting note | Treat as posted and surface the message to the user |
| `etendo_generate_aging_receivable` returns a validation error with empty parameters | Expected — required parameter keys are listed in the message | Fill the keys and retry |

For any list-typed field encountered above (`type`, `transactionType`, `status`, `documentStatus`, `conversionRateType`, `formOfPayment`, `overduePaymentDayRule`, `matchingtype`), the concrete code values are **to-be-resolved at runtime** via `etendo_neo_schema` — they are intentionally not enumerated here because they are role / module dependent.
