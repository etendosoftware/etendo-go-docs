# Inventario — Stock and Product Management for AI Agents

## Overview

This guide explains how an AI agent can query and manage inventory data inside Etendo Go: browsing the product catalogue, checking stock levels across warehouses, and identifying items that need restocking.

This guide covers:

- Prerequisites for inventory access.
- Available tools and their parameters.
- An end-to-end workflow example: scan the product catalogue, identify low-stock items, and surface a reorder report.
- Error handling patterns specific to the inventory module.

## Prerequisites

- An active Etendo Go instance with the MCP server configured (see [MCP setup](../mcp/index.md)).
- An API user with the `inventory_manager` role assigned (read-only queries require `inventory_viewer`).
- Warehouse IDs if you need per-warehouse stock breakdowns; otherwise the tool returns all warehouses by default.

## Available tools

| Tool | Description | Required parameters | Optional parameters |
|------|-------------|---------------------|---------------------|
| `list_products` | Returns the product catalogue | — | `search`, `category_id` |
| `get_stock_levels` | Returns current stock per warehouse for a product | `product_id` | `warehouse_id` |

### Parameter details

**`list_products` — query parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Free-text filter applied to product name and reference |
| `category_id` | string | Restricts results to a single product category |

**`get_stock_levels` — response fields**

| Field | Type | Description |
|-------|------|-------------|
| `product_id` | string | ERP product identifier |
| `product_name` | string | Human-readable product name |
| `stock[].warehouse_id` | string | Warehouse identifier |
| `stock[].warehouse_name` | string | Human-readable warehouse name |
| `stock[].available_qty` | number | Quantity available (on-hand minus reserved) |
| `stock[].reserved_qty` | number | Quantity reserved by confirmed sales orders |
| `stock[].on_hand_qty` | number | Total physical quantity in warehouse |

## End-to-end usage example

**Goal**: An inventory agent scans the product catalogue, checks stock for each item in a specific category, and produces a list of products that have fallen below a defined reorder threshold.

### Step 1 — List products in the target category

Tool call:

```json
{
  "tool": "list_products",
  "arguments": {
    "category_id": "CAT-001"
  }
}
```

Response:

```json
{
  "products": [
    {
      "id": "P-00045",
      "name": "Widget A",
      "reference": "WGT-A",
      "category_id": "CAT-001",
      "category_name": "Widgets",
      "unit_of_measure": "EA",
      "reorder_point": 20
    },
    {
      "id": "P-00046",
      "name": "Widget B",
      "reference": "WGT-B",
      "category_id": "CAT-001",
      "category_name": "Widgets",
      "unit_of_measure": "EA",
      "reorder_point": 15
    }
  ]
}
```

### Step 2 — Check stock for the first product

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
      "available_qty": 8,
      "reserved_qty": 12,
      "on_hand_qty": 20
    },
    {
      "warehouse_id": "WH-02",
      "warehouse_name": "Secondary Warehouse",
      "available_qty": 5,
      "reserved_qty": 0,
      "on_hand_qty": 5
    }
  ]
}
```

Total available across all warehouses: 8 + 5 = 13. Reorder point is 20. The agent marks this product as requiring replenishment.

### Step 3 — Check stock for the second product

Tool call:

```json
{
  "tool": "get_stock_levels",
  "arguments": {
    "product_id": "P-00046"
  }
}
```

Response:

```json
{
  "product_id": "P-00046",
  "product_name": "Widget B",
  "stock": [
    {
      "warehouse_id": "WH-01",
      "warehouse_name": "Main Warehouse",
      "available_qty": 40,
      "reserved_qty": 5,
      "on_hand_qty": 45
    }
  ]
}
```

Total available: 40. Reorder point is 15. Stock is adequate — no action needed.

### Step 4 — Agent produces a reorder report

After iterating over all products in the category, the agent compiles:

```json
{
  "reorder_report": {
    "generated_at": "2024-06-10T16:00:00Z",
    "category_id": "CAT-001",
    "items_below_reorder_point": [
      {
        "product_id": "P-00045",
        "product_name": "Widget A",
        "total_available_qty": 13,
        "reorder_point": 20,
        "deficit": 7
      }
    ]
  }
}
```

The agent can then pass this report to the [Purchases automation](../compras/index.md) flow to trigger purchase orders for each item in `items_below_reorder_point`.

## Error handling

All tools return a structured error object when a call fails.

```json
{
  "error": {
    "code": "RECORD_NOT_FOUND",
    "message": "Product P-99999 does not exist.",
    "details": {
      "entity": "product",
      "id": "P-99999"
    }
  }
}
```

| Error code | Cause | Resolution |
|------------|-------|------------|
| `AUTH_FAILED` | Invalid API credentials | Verify `ETENDO_USERNAME` and `ETENDO_PASSWORD` |
| `INSUFFICIENT_PERMISSIONS` | API user lacks `inventory_viewer` role | Assign the role in **Configuration → Users and permissions** |
| `RECORD_NOT_FOUND` | Product ID or category ID does not exist | Call `list_products` without filters first to retrieve valid IDs |
| `VALIDATION_ERROR` | A required field is missing or has the wrong type | Read `error.details` for the specific field that failed validation |
| `RATE_LIMITED` | Too many requests in a short window | Batch product lookups and apply exponential back-off between retries |
