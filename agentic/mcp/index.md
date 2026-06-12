# MCP — Model Context Protocol for Etendo Go

## Overview

The Etendo Go MCP server exposes ERP data and operations through the [Model Context Protocol](https://modelcontextprotocol.io/), enabling AI agents to query business data, create records, and automate workflows directly inside an Etendo Go instance.

This guide covers:

- What the MCP server is and how it fits into Etendo Go.
- Prerequisites and step-by-step configuration.
- Available tools and resources.
- An end-to-end usage example.

## Prerequisites

- An active Etendo Go account with API access enabled.
- Your Etendo Go instance URL (e.g., `https://go.etendo.cloud`).
- A dedicated API user with the roles required for your agent's tasks.
- An MCP-compatible client: Claude Desktop, Claude Code, or any client implementing MCP spec `2024-11-05` or later.
- `Node.js >= 18` if running the MCP server locally via `npx`.

## What is MCP in the Etendo Go context

MCP (Model Context Protocol) is an open standard that lets AI models call structured tools and read resources from external systems. The Etendo Go MCP server is a connector that wraps the Etendo Go REST API and exposes it as a set of typed tools and resources.

```
AI Agent  ──MCP protocol──>  Etendo Go MCP Server  ──REST──>  Etendo Go API
```

The MCP server handles:

- **Authentication**: acquires a JWT token from the Etendo Go API and renews it before expiry.
- **Data serialisation**: maps ERP objects (orders, invoices, products) to MCP-readable JSON structures.
- **Error normalisation**: returns structured error objects the agent can inspect and act on.

## Configuration

### Step 1 — Obtain API credentials

1. Log in to your Etendo Go instance as an administrator.
2. Navigate to **Configuration → Users and permissions**.
3. Create a dedicated API user (do not reuse a human user account).
4. Assign the roles that match the operations your agent will perform (e.g., `sales_manager`, `purchase_manager`).
5. Note the username and password — the MCP server uses these to request tokens.

### Step 2 — Add the MCP server to your client configuration

Add the following entry to your MCP client configuration file.

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "etendo-go": {
      "command": "npx",
      "args": ["-y", "@etendosoftware/mcp-etendo-go"],
      "env": {
        "ETENDO_BASE_URL": "https://go.etendo.cloud",
        "ETENDO_USERNAME": "<your-api-username>",
        "ETENDO_PASSWORD": "<your-api-password>"
      }
    }
  }
}
```

**Claude Code** (`.claude/mcp.json` in your project root):

```json
{
  "mcpServers": {
    "etendo-go": {
      "command": "npx",
      "args": ["-y", "@etendosoftware/mcp-etendo-go"],
      "env": {
        "ETENDO_BASE_URL": "https://go.etendo.cloud",
        "ETENDO_USERNAME": "<your-api-username>",
        "ETENDO_PASSWORD": "<your-api-password>"
      }
    }
  }
}
```

**Environment variables reference**

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ETENDO_BASE_URL` | Yes | — | Base URL of your Etendo Go instance |
| `ETENDO_USERNAME` | Yes | — | API user login |
| `ETENDO_PASSWORD` | Yes | — | API user password |
| `ETENDO_TOKEN_TTL` | No | `28000` | Token refresh interval in seconds |

### Step 3 — Verify the connection

Restart your MCP client after saving the configuration. Read the health-check resource to confirm the connection:

```
resource: etendo://status
```

Expected response:

```json
{
  "status": "ok",
  "instance": "https://go.etendo.cloud",
  "version": "2.0"
}
```

If you receive an error, check the `error.code` field and consult the [Error handling](#error-handling) section.

## Available tools

### Sales

| Tool | Description | Required parameters | Optional parameters |
|------|-------------|---------------------|---------------------|
| `list_sales_orders` | Returns a list of sales orders | — | `status`, `from_date`, `to_date`, `customer_id` |
| `get_sales_order` | Retrieves a single sales order | `order_id` | — |
| `create_sales_order` | Creates a new sales order | `customer_id`, `lines[]` | `notes` |
| `confirm_sales_order` | Confirms a draft sales order | `order_id` | — |

### Purchases

| Tool | Description | Required parameters | Optional parameters |
|------|-------------|---------------------|---------------------|
| `list_purchase_orders` | Returns a list of purchase orders | — | `status`, `from_date`, `to_date`, `vendor_id` |
| `get_purchase_order` | Retrieves a single purchase order | `order_id` | — |
| `create_purchase_order` | Creates a new purchase order | `vendor_id`, `lines[]` | `notes` |
| `confirm_purchase_order` | Confirms a draft purchase order | `order_id` | — |

### Finance

| Tool | Description | Required parameters | Optional parameters |
|------|-------------|---------------------|---------------------|
| `list_invoices` | Returns invoices | `type` (`sales` or `purchase`) | `status`, `from_date`, `to_date` |
| `get_invoice` | Retrieves a single invoice | `invoice_id` | — |
| `list_bank_statements` | Returns bank reconciliation statements | `account_id` | `from_date`, `to_date` |

### Inventory

| Tool | Description | Required parameters | Optional parameters |
|------|-------------|---------------------|---------------------|
| `list_products` | Returns the product catalogue | — | `search`, `category_id` |
| `get_stock_levels` | Returns current stock per warehouse | `product_id` | `warehouse_id` |

### Contacts

| Tool | Description | Required parameters | Optional parameters |
|------|-------------|---------------------|---------------------|
| `list_customers` | Returns all customers | — | `search` |
| `list_vendors` | Returns all vendors | — | `search` |
| `get_contact` | Retrieves a contact by ID | `contact_id` | — |

## Available resources

Resources are read-only. Read them to inspect metadata or schemas without consuming a tool call.

| Resource URI | Description |
|--------------|-------------|
| `etendo://status` | Server health and instance metadata |
| `etendo://schema/sales-order` | JSON Schema for the sales order object |
| `etendo://schema/purchase-order` | JSON Schema for the purchase order object |
| `etendo://schema/invoice` | JSON Schema for the invoice object |
| `etendo://schema/product` | JSON Schema for the product object |
| `etendo://schema/contact` | JSON Schema for the contact object |

## End-to-end usage example

**Goal**: An agent checks open sales orders for a customer, detects a stock shortage, and creates a purchase order to cover the deficit.

### Step 1 — List open sales orders for a customer

Tool call:

```json
{
  "tool": "list_sales_orders",
  "arguments": {
    "status": "open",
    "customer_id": "C-00123"
  }
}
```

Response:

```json
{
  "orders": [
    {
      "id": "SO-20240601-001",
      "customer_id": "C-00123",
      "customer_name": "Acme Corp",
      "status": "open",
      "lines": [
        {
          "line_id": "L-001",
          "product_id": "P-00045",
          "product_name": "Widget A",
          "qty_ordered": 50
        }
      ]
    }
  ]
}
```

### Step 2 — Check stock for the required product

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
      "available_qty": 10
    }
  ]
}
```

Available stock (10) is less than the ordered quantity (50). The agent proceeds to create a purchase order for the deficit plus a safety buffer.

### Step 3 — Find the vendor that supplies this product

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
      "default_product_ids": ["P-00045"]
    }
  ]
}
```

### Step 4 — Create a purchase order

Tool call:

```json
{
  "tool": "create_purchase_order",
  "arguments": {
    "vendor_id": "V-00078",
    "lines": [
      {
        "product_id": "P-00045",
        "qty": 60,
        "unit_price": 12.50
      }
    ],
    "notes": "Restock triggered by SO-20240601-001"
  }
}
```

Response:

```json
{
  "id": "PO-20240601-005",
  "status": "draft",
  "vendor_id": "V-00078",
  "vendor_name": "WidgetCo Ltd",
  "lines": [
    {
      "product_id": "P-00045",
      "product_name": "Widget A",
      "qty": 60,
      "unit_price": 12.50,
      "line_total": 750.00
    }
  ],
  "total": 750.00
}
```

The purchase order is now in `draft` status and ready for human review or automated confirmation via `confirm_purchase_order`.

## Error handling

All tools return a structured error object when a call fails. Inspect `error.code` to determine the appropriate action.

```json
{
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "The API user does not have access to the Purchases module.",
    "details": {
      "required_role": "purchase_manager"
    }
  }
}
```

| Error code | Cause | Resolution |
|------------|-------|------------|
| `AUTH_FAILED` | Invalid credentials | Verify `ETENDO_USERNAME` and `ETENDO_PASSWORD` |
| `TOKEN_EXPIRED` | Token expired before the server could renew it | Decrease `ETENDO_TOKEN_TTL` |
| `INSUFFICIENT_PERMISSIONS` | API user lacks the required role | Assign the correct role in **Configuration → Users and permissions** |
| `RECORD_NOT_FOUND` | The requested ID does not exist | Verify the ID by listing records before fetching by ID |
| `VALIDATION_ERROR` | A required parameter is missing or has an invalid type | Read `error.details` for the specific field that failed validation |
| `RATE_LIMITED` | Too many requests in a short window | Wait and retry; reduce call frequency |
