# Ventas — Sales Order Automation for AI Agents

## Overview

This guide explains how an AI agent can automate end-to-end sales workflows inside Etendo Go: listing open orders, creating new orders on behalf of customers, generating invoices, and confirming drafts for fulfilment.

This guide covers:

- Prerequisites for sales automation.
- Available tools and their parameters.
- An end-to-end workflow example: receive a customer request, create a sales order, and confirm it.
- Error handling patterns specific to the sales module.

## Prerequisites

- An active Etendo Go instance with the MCP server configured (see [MCP setup](../mcp/index.md)).
- An API user with the `sales_manager` role assigned.
- Customer IDs and product IDs available via the Contacts and Inventory modules, or retrieved at runtime using the tools listed below.
- Prices and tax categories configured for the products being ordered.

## Available tools

| Tool | Description | Required parameters | Optional parameters |
|------|-------------|---------------------|---------------------|
| `list_sales_orders` | Returns a paginated list of sales orders | — | `status`, `from_date`, `to_date`, `customer_id` |
| `get_sales_order` | Retrieves full detail for a single sales order | `order_id` | — |
| `create_sales_order` | Creates a new sales order in `draft` status | `customer_id`, `lines[]` | `notes`, `delivery_date` |
| `confirm_sales_order` | Moves a draft order to `confirmed` status, triggering stock reservation | `order_id` | — |
| `list_invoices` | Returns sales or purchase invoices | `type` (`sales` or `purchase`) | `status`, `from_date`, `to_date`, `customer_id` |
| `get_invoice` | Retrieves full detail for a single invoice | `invoice_id` | — |

### Parameter details

**`create_sales_order` — `lines[]` object**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_id` | string | Yes | ERP product identifier |
| `qty` | number | Yes | Ordered quantity |
| `unit_price` | number | No | Overrides the catalogue price when provided |
| `discount_pct` | number | No | Line discount percentage (0–100) |

**`list_sales_orders` — `status` allowed values**

`draft` · `confirmed` · `delivered` · `invoiced` · `cancelled`

**`list_invoices` — `status` allowed values**

`draft` · `posted` · `paid` · `cancelled`

## End-to-end usage example

**Goal**: A customer service agent receives an order request from a customer, checks that the requested products exist, creates the order, and confirms it.

### Step 1 — Retrieve the customer record

Tool call:

```json
{
  "tool": "get_contact",
  "arguments": {
    "contact_id": "C-00123"
  }
}
```

Response:

```json
{
  "id": "C-00123",
  "name": "Acme Corp",
  "type": "customer",
  "tax_id": "A12345678",
  "payment_terms": "30_days",
  "currency": "EUR"
}
```

### Step 2 — Verify product availability

Tool call:

```json
{
  "tool": "get_stock_levels",
  "arguments": {
    "product_id": "P-00045"
  }
}
```

Response:

```json
{
  "product_id": "P-00045",
  "product_name": "Widget A",
  "stock": [
    {
      "warehouse_id": "WH-01",
      "warehouse_name": "Main Warehouse",
      "available_qty": 120
    }
  ]
}
```

Stock is sufficient (120 ≥ 30 requested). The agent proceeds to create the order.

### Step 3 — Create the sales order

Tool call:

```json
{
  "tool": "create_sales_order",
  "arguments": {
    "customer_id": "C-00123",
    "lines": [
      {
        "product_id": "P-00045",
        "qty": 30,
        "unit_price": 25.00
      }
    ],
    "notes": "Urgent — expedite shipping",
    "delivery_date": "2024-06-15"
  }
}
```

Response:

```json
{
  "id": "SO-20240610-007",
  "status": "draft",
  "customer_id": "C-00123",
  "customer_name": "Acme Corp",
  "delivery_date": "2024-06-15",
  "lines": [
    {
      "line_id": "L-001",
      "product_id": "P-00045",
      "product_name": "Widget A",
      "qty": 30,
      "unit_price": 25.00,
      "line_total": 750.00
    }
  ],
  "total": 750.00,
  "currency": "EUR"
}
```

### Step 4 — Confirm the sales order

Tool call:

```json
{
  "tool": "confirm_sales_order",
  "arguments": {
    "order_id": "SO-20240610-007"
  }
}
```

Response:

```json
{
  "id": "SO-20240610-007",
  "status": "confirmed",
  "confirmed_at": "2024-06-10T14:32:00Z",
  "stock_reserved": true
}
```

The order is now confirmed and stock has been reserved. The fulfilment team can proceed with picking and shipping.

### Step 5 — List pending invoices for the customer (optional follow-up)

Tool call:

```json
{
  "tool": "list_invoices",
  "arguments": {
    "type": "sales",
    "status": "draft",
    "customer_id": "C-00123"
  }
}
```

Response:

```json
{
  "invoices": [
    {
      "id": "INV-20240610-003",
      "status": "draft",
      "customer_id": "C-00123",
      "customer_name": "Acme Corp",
      "total": 750.00,
      "currency": "EUR",
      "due_date": "2024-07-10"
    }
  ]
}
```

## Error handling

All tools return a structured error object when a call fails.

```json
{
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Product P-00045 has only 10 units available; 30 were requested.",
    "details": {
      "product_id": "P-00045",
      "available_qty": 10,
      "requested_qty": 30
    }
  }
}
```

| Error code | Cause | Resolution |
|------------|-------|------------|
| `AUTH_FAILED` | Invalid API credentials | Verify `ETENDO_USERNAME` and `ETENDO_PASSWORD` |
| `INSUFFICIENT_PERMISSIONS` | API user lacks `sales_manager` role | Assign the role in **Configuration → Users and permissions** |
| `RECORD_NOT_FOUND` | Customer ID or product ID does not exist | Call `list_customers` or `list_products` to obtain valid IDs |
| `INSUFFICIENT_STOCK` | Requested quantity exceeds available stock | Call `get_stock_levels` before creating the order and adjust quantity |
| `INVALID_STATUS_TRANSITION` | The order is not in `draft` status and cannot be confirmed | Read current status via `get_sales_order` before calling `confirm_sales_order` |
| `VALIDATION_ERROR` | A required field is missing or has the wrong type | Read `error.details` for the specific field that failed validation |
| `RATE_LIMITED` | Too many requests in a short window | Wait and retry with exponential back-off |
