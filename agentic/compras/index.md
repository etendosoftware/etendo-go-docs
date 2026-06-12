# Compras — Purchase Order Automation for AI Agents

## Overview

This guide explains how an AI agent can automate procurement workflows inside Etendo Go: listing open purchase orders, creating new orders with vendors, confirming drafts, and reconciling received goods against purchase invoices.

This guide covers:

- Prerequisites for purchase automation.
- Available tools and their parameters.
- An end-to-end workflow example: detect a restock need, select a vendor, create a purchase order, and confirm it.
- Error handling patterns specific to the purchases module.

## Prerequisites

- An active Etendo Go instance with the MCP server configured (see [MCP setup](../mcp/index.md)).
- An API user with the `purchase_manager` role assigned.
- Vendor IDs available via the Contacts module, or retrieved at runtime using `list_vendors`.
- Product IDs available via the Inventory module, or retrieved at runtime using `list_products`.
- Unit prices agreed with each vendor (or a price list configured in the ERP).

## Available tools

| Tool | Description | Required parameters | Optional parameters |
|------|-------------|---------------------|---------------------|
| `list_purchase_orders` | Returns a paginated list of purchase orders | — | `status`, `from_date`, `to_date`, `vendor_id` |
| `get_purchase_order` | Retrieves full detail for a single purchase order | `order_id` | — |
| `create_purchase_order` | Creates a new purchase order in `draft` status | `vendor_id`, `lines[]` | `notes`, `expected_date` |
| `confirm_purchase_order` | Moves a draft order to `confirmed` status, sending it to the vendor queue | `order_id` | — |
| `list_invoices` | Returns purchase invoices | `type` (`purchase`) | `status`, `from_date`, `to_date`, `vendor_id` |
| `get_invoice` | Retrieves full detail for a single invoice | `invoice_id` | — |

### Parameter details

**`create_purchase_order` — `lines[]` object**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_id` | string | Yes | ERP product identifier |
| `qty` | number | Yes | Quantity to order |
| `unit_price` | number | Yes | Agreed price per unit |
| `discount_pct` | number | No | Line discount percentage (0–100) |

**`list_purchase_orders` — `status` allowed values**

`draft` · `confirmed` · `received` · `invoiced` · `cancelled`

**`list_invoices` — `status` allowed values**

`draft` · `posted` · `paid` · `cancelled`

## End-to-end usage example

**Goal**: A procurement agent detects that stock for a product is below the reorder threshold, identifies the preferred vendor, creates a purchase order, and confirms it.

### Step 1 — Check current stock levels

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
      "available_qty": 8
    }
  ]
}
```

Available quantity (8) is below the reorder threshold (20). The agent proceeds to identify a vendor.

### Step 2 — Find a vendor for the product

Tool call:

```json
{
  "tool": "list_vendors",
  "arguments": {
    "search": "Widget"
  }
}
```

Response:

```json
{
  "vendors": [
    {
      "id": "V-00078",
      "name": "WidgetCo Ltd",
      "default_product_ids": ["P-00045"],
      "payment_terms": "60_days",
      "currency": "EUR"
    }
  ]
}
```

### Step 3 — Check existing open purchase orders to avoid duplicates

Tool call:

```json
{
  "tool": "list_purchase_orders",
  "arguments": {
    "status": "confirmed",
    "vendor_id": "V-00078"
  }
}
```

Response:

```json
{
  "orders": []
}
```

No open orders for this vendor. The agent proceeds to create a new purchase order.

### Step 4 — Create the purchase order

Tool call:

```json
{
  "tool": "create_purchase_order",
  "arguments": {
    "vendor_id": "V-00078",
    "lines": [
      {
        "product_id": "P-00045",
        "qty": 50,
        "unit_price": 12.50
      }
    ],
    "notes": "Restock — stock fell below reorder point of 20 units",
    "expected_date": "2024-06-20"
  }
}
```

Response:

```json
{
  "id": "PO-20240610-012",
  "status": "draft",
  "vendor_id": "V-00078",
  "vendor_name": "WidgetCo Ltd",
  "expected_date": "2024-06-20",
  "lines": [
    {
      "line_id": "L-001",
      "product_id": "P-00045",
      "product_name": "Widget A",
      "qty": 50,
      "unit_price": 12.50,
      "line_total": 625.00
    }
  ],
  "total": 625.00,
  "currency": "EUR"
}
```

### Step 5 — Confirm the purchase order

Tool call:

```json
{
  "tool": "confirm_purchase_order",
  "arguments": {
    "order_id": "PO-20240610-012"
  }
}
```

Response:

```json
{
  "id": "PO-20240610-012",
  "status": "confirmed",
  "confirmed_at": "2024-06-10T15:10:00Z"
}
```

The purchase order is now confirmed and queued for vendor fulfilment. The receiving team will record goods receipt when the delivery arrives.

## Error handling

All tools return a structured error object when a call fails.

```json
{
  "error": {
    "code": "RECORD_NOT_FOUND",
    "message": "Vendor V-99999 does not exist.",
    "details": {
      "entity": "vendor",
      "id": "V-99999"
    }
  }
}
```

| Error code | Cause | Resolution |
|------------|-------|------------|
| `AUTH_FAILED` | Invalid API credentials | Verify `ETENDO_USERNAME` and `ETENDO_PASSWORD` |
| `INSUFFICIENT_PERMISSIONS` | API user lacks `purchase_manager` role | Assign the role in **Configuration → Users and permissions** |
| `RECORD_NOT_FOUND` | Vendor ID or product ID does not exist | Call `list_vendors` or `list_products` to obtain valid IDs |
| `DUPLICATE_ORDER` | An open order for the same vendor and product already exists | Call `list_purchase_orders` before creating to detect existing open orders |
| `INVALID_STATUS_TRANSITION` | The order is not in `draft` status and cannot be confirmed | Read current status via `get_purchase_order` before calling `confirm_purchase_order` |
| `VALIDATION_ERROR` | A required field is missing or has the wrong type | Read `error.details` for the specific field that failed validation |
| `RATE_LIMITED` | Too many requests in a short window | Wait and retry with exponential back-off |
