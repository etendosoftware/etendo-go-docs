# Finanzas — Bank Reconciliation and Treasury for AI Agents

## Overview

This guide explains how an AI agent can access financial data in Etendo Go: listing invoices, retrieving bank reconciliation statements, and supporting treasury workflows such as identifying unpaid invoices and overdue balances.

This guide covers:

- Prerequisites for financial data access.
- Available tools and their parameters.
- An end-to-end workflow example: load bank statement lines, match them to posted invoices, and flag unmatched items.
- Error handling patterns specific to the finance module.

## Prerequisites

- An active Etendo Go instance with the MCP server configured (see [MCP setup](../mcp/index.md)).
- An API user with the `finance_manager` role assigned.
- At least one bank account configured in Etendo Go with a statement available for the target period.
- Invoices posted (not in `draft` status) for the reconciliation period.

## Available tools

| Tool | Description | Required parameters | Optional parameters |
|------|-------------|---------------------|---------------------|
| `list_invoices` | Returns invoices of a given type | `type` (`sales` or `purchase`) | `status`, `from_date`, `to_date`, `customer_id` |
| `get_invoice` | Retrieves full detail for a single invoice | `invoice_id` | — |
| `list_bank_statements` | Returns bank reconciliation statements for an account | `account_id` | `from_date`, `to_date` |

### Parameter details

**`list_invoices` — `type` allowed values**

`sales` · `purchase`

**`list_invoices` — `status` allowed values**

`draft` · `posted` · `paid` · `cancelled`

**`list_bank_statements` — response fields**

| Field | Type | Description |
|-------|------|-------------|
| `statement_id` | string | Unique statement identifier |
| `account_id` | string | Bank account identifier |
| `period_start` | string | Statement start date (ISO 8601) |
| `period_end` | string | Statement end date (ISO 8601) |
| `opening_balance` | number | Opening balance in account currency |
| `closing_balance` | number | Closing balance in account currency |
| `lines[].line_id` | string | Statement line identifier |
| `lines[].date` | string | Transaction date |
| `lines[].description` | string | Bank-provided transaction description |
| `lines[].amount` | number | Transaction amount (positive = credit, negative = debit) |
| `lines[].matched_invoice_id` | string or null | Invoice matched to this line, if any |

## End-to-end usage example

**Goal**: A treasury agent loads all bank statement lines for June 2024, retrieves posted sales invoices for the same period, and identifies invoice payments that have not yet been matched to a bank line.

### Step 1 — Retrieve the bank statement for the period

Tool call:

```json
{
  "tool": "list_bank_statements",
  "arguments": {
    "account_id": "BANK-001",
    "from_date": "2024-06-01",
    "to_date": "2024-06-30"
  }
}
```

Response:

```json
{
  "statements": [
    {
      "statement_id": "STMT-2024-06-001",
      "account_id": "BANK-001",
      "period_start": "2024-06-01",
      "period_end": "2024-06-30",
      "opening_balance": 15000.00,
      "closing_balance": 18450.00,
      "currency": "EUR",
      "lines": [
        {
          "line_id": "BL-001",
          "date": "2024-06-05",
          "description": "TRANSFER FROM ACME CORP REF SO-001",
          "amount": 750.00,
          "matched_invoice_id": null
        },
        {
          "line_id": "BL-002",
          "date": "2024-06-12",
          "description": "TRANSFER FROM GLOBEX INC REF SO-002",
          "amount": 1200.00,
          "matched_invoice_id": "INV-2024-06-002"
        },
        {
          "line_id": "BL-003",
          "date": "2024-06-20",
          "description": "SUPPLIER PAYMENT TO WIDGETCO",
          "amount": -625.00,
          "matched_invoice_id": null
        }
      ]
    }
  ]
}
```

Lines `BL-001` and `BL-003` are unmatched. The agent investigates `BL-001` by searching for the matching invoice.

### Step 2 — List posted sales invoices for the same period

Tool call:

```json
{
  "tool": "list_invoices",
  "arguments": {
    "type": "sales",
    "status": "posted",
    "from_date": "2024-06-01",
    "to_date": "2024-06-30"
  }
}
```

Response:

```json
{
  "invoices": [
    {
      "id": "INV-2024-06-001",
      "status": "posted",
      "customer_id": "C-00123",
      "customer_name": "Acme Corp",
      "total": 750.00,
      "currency": "EUR",
      "due_date": "2024-07-05",
      "paid": false
    },
    {
      "id": "INV-2024-06-002",
      "status": "posted",
      "customer_id": "C-00456",
      "customer_name": "Globex Inc",
      "total": 1200.00,
      "currency": "EUR",
      "due_date": "2024-07-12",
      "paid": true
    }
  ]
}
```

### Step 3 — Match bank line BL-001 to INV-2024-06-001

The agent matches `BL-001` (amount: 750.00, description mentions "ACME CORP") to `INV-2024-06-001` (customer: Acme Corp, total: 750.00). Amounts match exactly.

Tool call:

```json
{
  "tool": "get_invoice",
  "arguments": {
    "invoice_id": "INV-2024-06-001"
  }
}
```

Response:

```json
{
  "id": "INV-2024-06-001",
  "status": "posted",
  "customer_id": "C-00123",
  "customer_name": "Acme Corp",
  "issue_date": "2024-06-01",
  "due_date": "2024-07-05",
  "lines": [
    {
      "line_id": "IL-001",
      "product_id": "P-00045",
      "product_name": "Widget A",
      "qty": 30,
      "unit_price": 25.00,
      "line_total": 750.00
    }
  ],
  "total": 750.00,
  "currency": "EUR",
  "paid": false
}
```

### Step 4 — Agent produces a reconciliation summary

After processing all lines the agent compiles:

```json
{
  "reconciliation_summary": {
    "statement_id": "STMT-2024-06-001",
    "period": "2024-06-01 / 2024-06-30",
    "matched_lines": 1,
    "unmatched_lines": [
      {
        "line_id": "BL-001",
        "amount": 750.00,
        "suggested_invoice_id": "INV-2024-06-001",
        "confidence": "high",
        "reason": "Amount and customer name match exactly"
      },
      {
        "line_id": "BL-003",
        "amount": -625.00,
        "suggested_invoice_id": null,
        "confidence": "none",
        "reason": "No matching purchase invoice found for WidgetCo payment"
      }
    ]
  }
}
```

A human reviewer can act on the suggestions or the agent can escalate unmatched lines for manual investigation.

## Error handling

All tools return a structured error object when a call fails.

```json
{
  "error": {
    "code": "RECORD_NOT_FOUND",
    "message": "Bank account BANK-999 does not exist.",
    "details": {
      "entity": "bank_account",
      "id": "BANK-999"
    }
  }
}
```

| Error code | Cause | Resolution |
|------------|-------|------------|
| `AUTH_FAILED` | Invalid API credentials | Verify `ETENDO_USERNAME` and `ETENDO_PASSWORD` |
| `INSUFFICIENT_PERMISSIONS` | API user lacks `finance_manager` role | Assign the role in **Configuration → Users and permissions** |
| `RECORD_NOT_FOUND` | Bank account ID or invoice ID does not exist | Verify the ID by listing records before fetching by ID |
| `NO_STATEMENTS_FOUND` | No bank statement exists for the requested period | Check that the statement has been imported for that period in Etendo Go |
| `VALIDATION_ERROR` | A required field is missing or has the wrong type | Read `error.details` for the specific field that failed validation |
| `RATE_LIMITED` | Too many requests in a short window | Apply exponential back-off; reduce date range to smaller windows if processing large volumes |
