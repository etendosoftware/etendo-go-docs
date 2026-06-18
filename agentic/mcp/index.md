# MCP — Model Context Protocol for Etendo Go

## Overview

The Etendo Go MCP server exposes the Etendo Go NEO Headless API through the [Model Context Protocol](https://modelcontextprotocol.io/), enabling AI agents to query and mutate ERP data, fire process actions, and generate reports directly from a conversation.

This guide covers:

- What the MCP server is and how it fits into Etendo Go.
- Prerequisites and step-by-step configuration.
- The `spec + entity` model used by every CRUD tool.
- The list of generic tools the server exposes.
- The list of report tools the server exposes.
- The list of specs available (verified through `etendo_neo_discover`).
- An end-to-end usage example built only with real tools.

## Prerequisites

- An active Etendo Go account with API access enabled.
- Your Etendo Go instance URL (e.g., `https://go.etendo.cloud`).
- A dedicated API user with the roles required for your agent's tasks.
- An MCP-compatible client: Claude Desktop, Claude Code, or any client implementing MCP spec `2024-11-05` or later.
- `Node.js >= 18` if running the MCP server locally via `npx`.

## What is MCP in the Etendo Go context

MCP (Model Context Protocol) is an open standard that lets AI models call structured tools and read resources from external systems. The Etendo Go MCP server is a connector that wraps the Etendo Go NEO Headless API and exposes it as a small set of **generic** tools that operate over any business entity, plus a set of **report** tools.

```
AI Agent  ──MCP protocol──>  Etendo Go MCP Server  ──REST──>  Etendo Go NEO Headless API
```

The MCP server handles:

- **Authentication**: acquires a JWT token from the Etendo Go API and renews it before expiry.
- **Spec/entity routing**: maps each tool call to the correct REST endpoint based on the `spec` and `entity` arguments.
- **Schema introspection**: returns field metadata so the agent can build valid payloads without guessing.
- **Process invocation**: fires `type:button` actions (document confirmation, posting, copy-from, etc.) through a single tool.

## Configuration

### Step 1 — Obtain API credentials

1. Log in to your Etendo Go instance as an administrator.
2. Navigate to **Configuration → Users and permissions**.
3. Create a dedicated API user (do not reuse a human user account).
4. Assign the roles that match the operations your agent will perform (for example, a role with access to the Sales Order, Purchase Order, or Product windows).
5. Note the username and password — the MCP server uses these to request tokens.

### Step 2 — Add the MCP server to your client configuration

Add the following entry to your MCP client configuration file.

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "etendo": {
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
    "etendo": {
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

### Step 3 — Verify the connection

Restart your MCP client after saving the configuration, then read the only resource exposed by the server:

```
resource: etendo://status
```

If the read succeeds the server is reachable and authenticated. If it fails, the client surfaces a transport error — re-check the credentials and base URL.

As a second sanity check, invoke `etendo_neo_discover` (it requires no arguments) and confirm you receive a `specs` array.

## The `spec + entity` model

Every CRUD tool exposed by the MCP server takes two routing arguments:

- **`spec`** — the API namespace, typically aligned with an Etendo Go window or business area (for example `sales-order`, `purchase-invoice`, `product`, `contacts`).
- **`entity`** — the tab or sub-resource inside that spec (for example `header`, `lines`, `lineTax`, `paymentPlan`).

A spec is composed of one or more entities. For example, the `sales-order` spec has the entities `header`, `lines`, `lineTax`, `intrastat`, `reservedStock`, `relatedProducts`, `relatedServices`, `basicDiscounts`, `tax`, `paymentPlan`, `paymentDetails`, and `replacementOrders`. To list sales-order headers you call `etendo_neo_list` with `spec="sales-order"` and `entity="header"`; to list the lines of one sales order you call `etendo_neo_list` with `spec="sales-order"`, `entity="lines"`, and a filter on the parent header ID.

The same pattern applies to every tool: `etendo_neo_get`, `etendo_neo_create`, `etendo_neo_update`, `etendo_neo_delete`, `etendo_neo_schema`, `etendo_neo_defaults`, `etendo_neo_selectors`, and `etendo_neo_action` all accept `spec` and `entity` as their routing arguments.

Discover the full list of `(spec, entity)` pairs available to the current user at runtime with `etendo_neo_discover`. Never hard-code spec or entity names from memory — the discoverable list depends on the user's role and the modules installed in the instance.

## Available tools

The MCP server exposes a small set of generic tools that operate on any `(spec, entity)` pair, plus a set of report tools.

### Generic CRUD and metadata tools

| Tool | Purpose | Required arguments | Optional arguments |
|------|---------|--------------------|--------------------|
| `etendo_neo_discover` | List every spec and entity the current user can access | — | — |
| `etendo_neo_schema` | Return the field metadata for one entity: names, types, required flags, read-only flags, default expressions, and the buttons available for `etendo_neo_action` | `spec`, `entity` | — |
| `etendo_neo_defaults` | Return computed default values for a new record (useful before `etendo_neo_create`) | `spec`, `entity` | `parentId`, `assetId` |
| `etendo_neo_selectors` | Resolve valid values for a foreign-key field (returns IDs the agent can pass into `etendo_neo_create` / `etendo_neo_update`) | `spec`, `entity`, `column` | `query`, `recordContext`, `parentContext`, `field` |
| `etendo_neo_list` | List records of one entity with filters, pagination, and sort | `spec`, `entity` | `filters`, `limit`, `offset`, `orderBy` |
| `etendo_neo_get` | Retrieve a single record by ID | `spec`, `entity`, `id` | — |
| `etendo_neo_create` | Create a record | `spec`, `entity`, `fields` | — |
| `etendo_neo_update` | Update a record by ID | `spec`, `entity`, `id`, `fields` | — |
| `etendo_neo_delete` | Delete a record by ID | `spec`, `entity`, `id` | — |
| `etendo_neo_action` | Fire a `type:button` action on a record (document confirmation, posting, copy-lines, generate-template, etc.). The button column name and the available actions are listed in the entity schema. | `spec`, `entity`, `id`, `action` | `parameters` |
| `etendo_neo_batch` | Run a sequence of cross-spec create operations atomically. All ops share one transaction (commit on success, rollback on any failure). Use `parentRef` to set the parent FK on a child-tab op, and `$ref:<opId>` substitution inside `body` to chain IDs across ops. | `operations[]` | — |

### Report tools

Report tools render a pre-built Etendo Go report and return it in the requested format. Each report owns the parameter shape it expects under the `parameters` argument; call the report with an empty `parameters` object first to discover the required keys via the server's validation message.

| Tool | Report |
|------|--------|
| `etendo_generate_aging_receivable` | Aging of Receivables |
| `etendo_generate_bank_statements` | Bank statement list, import (C43), and lines view for a financial account |
| `etendo_generate_financial_account_transactions` | Transactions list for a single financial account |
| `etendo_generate_financial_accounts_page` | Financial Accounts Page |
| `etendo_generate_inventory_stock_report` | Inventory Stock Report |
| `etendo_generate_tax_report` | Tax Report |

All report tools accept an optional `format` argument (`pdf`, `xlsx`, `csv`; default `pdf`).

## Available resources

Resources in the Etendo Go MCP server are intentionally minimal. The server exposes a single resource:

| Resource URI | Description |
|--------------|-------------|
| `etendo://status` | Server health and instance metadata. Read it to verify the server is reachable. |

There are **no** `etendo://schema/<entity>` resources. To obtain the JSON-Schema-like field metadata for an entity, call the tool `etendo_neo_schema(spec, entity)` instead of reading a resource. Schema metadata is exposed through a tool rather than a resource because it depends on the spec/entity pair the agent is about to operate on.

## Specs available

The list below was obtained from `etendo_neo_discover` against a current Etendo Go instance. The set of specs the **current user** can see depends on the user's role and the modules installed; rerun `etendo_neo_discover` in your own environment to obtain the authoritative list.

Specs of type `W` (write/CRUD windows) expose one or more entities through `etendo_neo_*`. Specs of type `R` (reports) are rendered through their corresponding `etendo_generate_*` tool.

| Spec | Type | Main entities |
|------|------|---------------|
| `aging-receivable` | R | (report) |
| `amortization` | W | `header`, `lines`, `accounting` |
| `assets` | W | `assets`, `amortizationLine`, `assetAcct` |
| `bank-statements` | R | (report) |
| `contacts` | W | `businessPartner`, `customer`, `vendorCreditor`, `employee`, `contact`, `bankAccount`, `locationAddress`, `documentType`, `basicDiscount`, `customerAccounting`, `vendorAccounting`, `employeeAccounting`, `costSalaryCategory`, `intrastatShipments`, `intrastatAdquisitions`, `bp-stats`, `bp-trend` |
| `conversion-rates` | W | `conversionRate` |
| `dashboard` | W | `kpis`, `trends`, `pending-tasks`, `activity`, `recent-invoices`, `best-products`, `best-sellers`, `pending-amounts`, `top-clients` |
| `financial-account` | W | `account`, `transaction`, `accounting`, `accountingHistory`, `accountingConfiguration`, `paymentMethod`, `importedBankStatements`, `bankStatementLines`, `reconciliations`, `clearedItems`, `bankConnections`, `exchangeRates` |
| `financial-account-transactions` | R | (report) |
| `financial-accounts-page` | R | (report) |
| `goods-movements` | W | `movement`, `movementLine`, `accounting` |
| `goods-receipt` | W | `goodsReceipt`, `goodsReceiptLine`, `intrastat`, `accounting`, `landedCost` |
| `goods-shipment` | W | `goodsShipment`, `goodsShipmentLine`, `intrastat`, `accounting` |
| `internal-consumption` | W | `internalConsumption`, `internalConsumptionLine`, `accounting` |
| `inventory-stock-report` | R | (report) |
| `match-rule` | W | `etgoMatchRuleHeader` |
| `monitor-verifactu` | W | `cabeceraDeEmisor`, `facturasAceptadas`, `facturasParcialmenteAceptadas`, `facturasRechazadas`, `facturasInválidas` |
| `payment-in` | W | `finPayment`, `finPaymentScheduleDetail`, `executionHistory`, `exchangeRates`, `usedCreditSource`, `accounting` |
| `payment-out` | W | `header`, `lines`, `executionHistory`, `exchangeRates`, `usedCreditSource`, `accounting`, `bankPayments` |
| `payment-term` | W | `header`, `lines`, `translation` |
| `physical-inventory` | W | `inventory`, `inventoryLine`, `accounting` |
| `price-list` | W | `priceList`, `priceListVersion`, `productPrice` |
| `product` | W | `product`, `price`, `priceRuleVersion`, `accounting`, `billOfMaterials`, `costingRule`, `costing`, `averageCostTransactions`, `transactionAdjustments`, `transactions`, `transactionCosts`, `purchasing`, `manufacturing`, `translation`, `productCharacteristic`, `characteristicConfiguration`, `stock`, `unitCost`, `productCategories`, `categoryPriceRuleVersion`, `products`, `productPriceRuleVersion`, `alternateUom`, `modifyTaxesCategories`, `intrastat` |
| `product-category` | W | `productCategory`, `accounting`, `assignedProducts`, `translation` |
| `purchase-invoice` | W | `header`, `lines`, `lineTax`, `intrastat`, `tax`, `basicDiscounts`, `cashVat`, `paymentPlan`, `paymentDetails`, `reversedInvoices`, `exchangeRates`, `accounting`, `siiData`, `batuz` |
| `purchase-order` | W | `header`, `lines`, `lineTax`, `intrastat`, `reservedStock`, `basicDiscounts`, `tax`, `paymentPlan`, `paymentDetails` |
| `return-from-customer` | W | `customerReturn`, `customerReturnLine`, `lineTax`, `relatedProducts`, `relatedServices`, `basicDiscounts`, `tax`, `paymentInPlan`, `paymentInDetails` |
| `return-material-receipt` | W | `returnMaterialReceipt`, `returnMaterialReceiptLine`, `accounting` |
| `return-to-vendor` | W | `header`, `lines`, `lineTax`, `basicDiscounts`, `tax`, `paymentOutPlan`, `paymentOutDetails` |
| `return-to-vendor-shipment` | W | `returnToVendorShipment`, `returnToVendorShipmentLine` |
| `sales-invoice` | W | `header`, `lines`, `lineTax`, `intrastat`, `tax`, `cashVat`, `basicDiscounts`, `paymentPlan`, `paymentDetails`, `reversedInvoices`, `exchangeRates`, `accounting`, `siiData`, `verifactu`, `ticketbai`, `resultadoValidación` |
| `sales-order` | W | `header`, `lines`, `lineTax`, `intrastat`, `reservedStock`, `relatedProducts`, `relatedServices`, `basicDiscounts`, `tax`, `paymentPlan`, `paymentDetails`, `replacementOrders` |
| `sales-quotation` | W | `quotation`, `quotationLine`, `lineTax`, `basicDiscounts`, `tax` |
| `sii-config` | W | `siiConfiguration`, `logHash` |
| `sii-monitor` | W | `organizations`, `issuedInvoices`, `issuedInvoicesSiiData`, `receivedInvoices`, `receivedInvoicesSiiData`, `cashCriterionPayments`, `paymentsSiiData`, and the `previousPeriod` variants |
| `tax` | W | `tax`, `taxZone`, `translation`, `accounting`, `taxParameter` |
| `tax-report` | R | (report) |
| `tbai-config` | W | `header` |
| `tbai-facturas-enviadas` | W | `sincronización`, `resultadoValidación` |
| `transaction-type` | W | `transactionType` |
| `user` | W | `user`, `rxServicesAccess`, `userRoles`, `token`, `emailConfiguration` |
| `verifactu-config` | W | `cabeceraDeConfiguraciónVerifactu` |
| `warehouse` | W | `warehouse`, `storageBin`, `productTransactions`, `binContents`, `accounting` |

## End-to-end usage example

**Goal**: An agent locates an existing customer and product, inspects the sales-order schema, resolves the foreign keys it needs, creates a draft sales order with one line, and then confirms (processes) the order.

### Step 1 — Discover what is available

Tool call:

```json
{
  "tool": "etendo_neo_discover",
  "arguments": {}
}
```

The response is the `specs` array shown above. Confirm that `sales-order`, `product`, and `contacts` are present.

### Step 2 — Inspect the sales-order header schema

Before creating any record, read the schema for the target entity so the agent knows which fields exist, which are required, and which are read-only:

```json
{
  "tool": "etendo_neo_schema",
  "arguments": {
    "spec": "sales-order",
    "entity": "header"
  }
}
```

The response lists every field with its `name`, `column`, `type`, `required`, `readOnly`, `hasSelector`, and `defaultExpression`. For `sales-order/header` the required, writable fields the agent typically must supply include `transactionDocument`, `businessPartner`, `orderDate`, `scheduledDeliveryDate`, `accountingDate`, `partnerAddress`, `invoiceAddress`, `priceList`, `paymentTerms`, `warehouse`, `currency`, `invoiceTerms`, `deliveryTerms`, `deliveryMethod`, `freightCostRule`, `formOfPayment`, and `priority`. Fields marked `readOnly:true` (such as `documentNo` and `id`) are auto-generated and must be omitted from `etendo_neo_create`. Buttons (`type:"button"`, with `invokeVia:"neo_action"`) are not regular fields — they are fired through `etendo_neo_action` once the record exists.

### Step 3 — Resolve the business partner foreign key

The `businessPartner` field uses a selector. Find a valid customer ID by querying the selector:

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "sales-order",
    "entity": "header",
    "column": "businessPartner",
    "query": "Acme"
  }
}
```

The response contains rows of `(id, identifier, …)` pairs. Pick the row that matches the user's intent.

### Step 4 — Resolve dependent selectors

Selectors that depend on other field values (for example, `partnerAddress` depends on `businessPartner`, and line-level selectors such as `tax` depend on `orderDate` and `priceList`) require a `recordContext` so the server can evaluate the selector with the correct scope:

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "sales-order",
    "entity": "header",
    "column": "partnerAddress",
    "recordContext": {
      "businessPartner": "<bp-id-from-step-3>"
    }
  }
}
```

Repeat for `invoiceAddress`, `priceList`, `paymentTerms`, `warehouse`, `currency`, and `transactionDocument` as needed.

### Step 5 — (Optional) Inspect defaults

`etendo_neo_create` auto-fills server-side defaults, so this step is optional. If the agent wants to preview which fields will be auto-filled, call:

```json
{
  "tool": "etendo_neo_defaults",
  "arguments": {
    "spec": "sales-order",
    "entity": "header"
  }
}
```

### Step 6 — Create the order header

Send only the fields confirmed in step 2 and resolved in steps 3–4:

```json
{
  "tool": "etendo_neo_create",
  "arguments": {
    "spec": "sales-order",
    "entity": "header",
    "fields": {
      "businessPartner": "<bp-id>",
      "partnerAddress": "<partner-address-id>",
      "invoiceAddress": "<invoice-address-id>",
      "priceList": "<price-list-id>",
      "paymentTerms": "<payment-term-id>",
      "warehouse": "<warehouse-id>",
      "currency": "<currency-id>",
      "transactionDocument": "<doctype-target-id>",
      "orderDate": "2026-06-18",
      "scheduledDeliveryDate": "2026-06-20",
      "accountingDate": "2026-06-18"
    }
  }
}
```

The response returns the created header, including its server-assigned `id` and `documentNo`. Keep the `id` for the next step.

### Step 7 — Create one order line

Inspect the line schema, then resolve the line-level selectors that depend on the header context:

```json
{
  "tool": "etendo_neo_schema",
  "arguments": { "spec": "sales-order", "entity": "lines" }
}
```

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "sales-order",
    "entity": "lines",
    "column": "product",
    "query": "Widget"
  }
}
```

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "sales-order",
    "entity": "lines",
    "column": "tax",
    "parentContext": {
      "businessPartner": "<bp-id>",
      "orderDate": "2026-06-18",
      "priceList": "<price-list-id>"
    }
  }
}
```

Create the line:

```json
{
  "tool": "etendo_neo_create",
  "arguments": {
    "spec": "sales-order",
    "entity": "lines",
    "fields": {
      "salesOrder": "<order-header-id>",
      "product": "<product-id>",
      "orderedQuantity": 5,
      "unitPrice": 12.50,
      "tax": "<tax-id>"
    }
  }
}
```

### Step 8 — Process (confirm) the order

`sales-order/header` exposes a `documentAction` button (column `DocAction`, `invokeVia:"neo_action"`). Confirm the order by firing it with the document action `CO` (Complete/Process):

```json
{
  "tool": "etendo_neo_action",
  "arguments": {
    "spec": "sales-order",
    "entity": "header",
    "id": "<order-header-id>",
    "action": "DocAction",
    "parameters": { "docAction": "CO" }
  }
}
```

The response carries `processResult` (`success` | `error` | `warning`) and `processMessage`. Read both: a `warning` result means the document was processed but the agent should surface the message to the user.

### Step 9 — (Alternative) Create the whole order atomically

When the agent needs to create the header and its lines in a single transaction (so that a failure in the line rolls back the header), use `etendo_neo_batch` and chain ops with `parentRef` / `$ref:`:

```json
{
  "tool": "etendo_neo_batch",
  "arguments": {
    "operations": [
      {
        "id": "h1",
        "spec": "sales-order",
        "entity": "header",
        "body": {
          "businessPartner": "<bp-id>",
          "partnerAddress": "<partner-address-id>",
          "invoiceAddress": "<invoice-address-id>",
          "priceList": "<price-list-id>",
          "paymentTerms": "<payment-term-id>",
          "warehouse": "<warehouse-id>",
          "currency": "<currency-id>",
          "transactionDocument": "<doctype-target-id>",
          "orderDate": "2026-06-18",
          "scheduledDeliveryDate": "2026-06-20",
          "accountingDate": "2026-06-18"
        }
      },
      {
        "id": "l1",
        "spec": "sales-order",
        "entity": "lines",
        "parentRef": "h1",
        "body": {
          "product": "<product-id>",
          "orderedQuantity": 5,
          "unitPrice": 12.50,
          "tax": "<tax-id>"
        }
      }
    ]
  }
}
```

A successful response has `committed: true` and an `operations` array with the resolved `recordId` for every op. A failure returns `committed: false` and a `failedAt` pointer with the underlying error.

## Error handling

> The error payload shapes below describe how the server signals failure today. Codes other than the ones explicitly verified (`processResult: "error"` and `processResult: "warning"` from `etendo_neo_action`, plus the underlying NEO Headless API HTTP errors propagated by the server) **need to be confirmed against the running MCP server** before being treated as load-bearing in agent logic.

Tool calls fail in one of two ways:

1. **Transport / protocol error.** The MCP client surfaces an error before the call returns. Inspect the client error message; the most common causes are an unreachable `ETENDO_BASE_URL`, invalid credentials, or a missing role on the API user.
2. **API-level error.** The call returns a structured payload describing the failure from the NEO Headless API. The shape depends on the underlying endpoint — typically an HTTP status, a `message`, and an optional `detail` field. For batch calls (`etendo_neo_batch`), the wrapper is normalised to `{ committed: false, failedAt: { id, index }, error: { status, message, detail? } }`.

For `etendo_neo_action`, success is signalled inside the response body, not by an exception: read `processResult` and `processMessage`.

| Symptom | Likely cause | Resolution |
|---------|--------------|------------|
| Transport error on first call of a session | `ETENDO_BASE_URL` unreachable or credentials wrong | Re-read `etendo://status`; verify `ETENDO_BASE_URL`, `ETENDO_USERNAME`, `ETENDO_PASSWORD` |
| `etendo_neo_discover` returns an empty `specs` array | API user has no role granting access to NEO Headless windows | Assign the appropriate role in **Configuration → Users and permissions** |
| `etendo_neo_create` rejects a field as required | A field with `required: true` was omitted, or a field with `readOnly: true` was sent | Re-run `etendo_neo_schema`; submit only writable fields; resolve FK fields via `etendo_neo_selectors` |
| `etendo_neo_action` returns `processResult: "error"` | The button's underlying Etendo process raised an error (validation, state machine, or business rule) | Read `processMessage` and report it verbatim; do not retry blindly |
| `etendo_neo_action` returns `processResult: "warning"` | The process completed with a warning Etendo wants surfaced | Treat the document as processed but surface `processMessage` to the user |
| `etendo_neo_batch` returns `committed: false` | One op failed; the whole transaction was rolled back | Use `failedAt.index` to locate the offending op and `error.message` to diagnose; rebuild and retry |
