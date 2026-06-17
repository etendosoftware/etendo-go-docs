# Etendo Go — Agent Operating Manual

## Overview

This manual instructs an AI agent on how to operate against an Etendo Go instance end-to-end. It is written as a normative operating guide: every directive applies to the agent at runtime, not to the developer reading the document. Treat each rule as binding unless the user explicitly overrides it for a single session.

The companion document [./mcp/index.md](./mcp/index.md) lists the protocol's surface (configuration, tools, resources, error codes). This manual explains **how** to use that surface — when to read which resource, how to chain tool calls, how to interpret each response, and how to react to every error code.

## Operating environment and constraints

The agent operates under these constraints at all times:

- The MCP server documented in [./mcp/index.md](./mcp/index.md) is the **only** channel to Etendo Go. The agent must not call the REST API directly, must not browse the Etendo Go web UI, and must not assume access to the filesystem of the Etendo instance or of the MCP server host.
- The agent's capabilities are bounded by the tools and resources listed in `agentic/mcp/index.md`. If a task cannot be completed with those primitives, abort and escalate to a human operator.
- Every tool invocation must follow MCP semantics: a `tool` name and an `arguments` object. Every resource read must use a fully-qualified URI such as `etendo://schema/sales-order`.
- The agent is stateless between sessions. Do not rely on record IDs, user roles, or configuration values learned in a previous run — confirm them through MCP before acting.
- Credentials (`ETENDO_USERNAME`, `ETENDO_PASSWORD`) and tokens are owned by the MCP server. The agent must never request them, store them, or echo them back to the user.

## The agent operating loop

Execute the following loop for every task the user delegates. Do not skip steps — each one prevents a specific class of failure.

1. **Restate the goal in MCP terms.** Map the user's request to Etendo Go entities (sales order, purchase order, invoice, product, contact) and operations (list, get, create, confirm). If no mapping exists, stop and ask the user.
2. **Verify connectivity.** Read `etendo://status` before the first mutating call of a session and whenever a previous call has failed with a transport-level error.
3. **Read schemas before writing.** For every tool that creates or modifies data, read the corresponding `etendo://schema/<entity>` resource first and confirm the planned arguments match the schema's field names, types, and required fields.
4. **Discover real values.** Before invoking a tool that requires identifiers, run the relevant `list_*` tool to obtain valid IDs. The agent must never invent IDs, names, prices, or quantities.
5. **Invoke the tool.** Build the `arguments` object using only verified IDs and values that conform to the schema.
6. **Interpret the response.** If the response carries an `error` object, branch on `error.code` using the [Error handling](#error-handling) table. If it carries business data, decide the next step from the data.
7. **Stop or iterate.** Continue the loop until the goal is met or an `error.code` mandates abort or escalation. Report every created or modified record ID back to the user so the change is auditable.

## Reading resources before acting

Resources are read-only and free of side effects. Use them as the source of truth for structural knowledge before mutating data.

| When to read | Resource | Purpose |
|--------------|----------|---------|
| First call of a session, or after a transport failure | `etendo://status` | Confirm the server is reachable and capture the instance version |
| Before `create_sales_order` or `confirm_sales_order` | `etendo://schema/sales-order` | Validate field names, required fields, and value types |
| Before `create_purchase_order` or `confirm_purchase_order` | `etendo://schema/purchase-order` | Validate field names, required fields, and value types |
| Before reading or filtering invoices | `etendo://schema/invoice` | Confirm available statuses and line structure |
| Before referencing a product in any tool | `etendo://schema/product` | Confirm identifier format and required attributes |
| Before referencing a customer or vendor | `etendo://schema/contact` | Confirm identifier format and required attributes |

If a schema read returns an unexpected structure (missing fields, unknown types, or an `error` object), abort the mutation and report the discrepancy to the user. Do not attempt a write against an unverified schema.

## Selecting the right tool

Match the user goal to one of the tools from `agentic/mcp/index.md` using this decision table. If no row matches, stop and inform the user that the operation is outside the MCP server's surface.

| Goal | Tool |
|------|------|
| Browse sales orders | `list_sales_orders` |
| Inspect one sales order | `get_sales_order` |
| Place a new sales order | `create_sales_order`, then optionally `confirm_sales_order` |
| Browse purchase orders | `list_purchase_orders` |
| Inspect one purchase order | `get_purchase_order` |
| Place a new purchase order | `create_purchase_order`, then optionally `confirm_purchase_order` |
| List invoices | `list_invoices` |
| Inspect one invoice | `get_invoice` |
| Reconcile bank movements | `list_bank_statements` |
| Find products in the catalogue | `list_products` |
| Check stock per warehouse | `get_stock_levels` |
| Find customers or vendors | `list_customers`, `list_vendors` |
| Resolve a contact by ID | `get_contact` |

## Constructing arguments

- Use the exact parameter names declared in the "Available tools" tables of `agentic/mcp/index.md`.
- Pass dates in ISO 8601 (`YYYY-MM-DD`). Reject any other format before sending the call.
- Pass identifiers exactly as returned by previous tool calls or resource reads — do not normalise, lowercase, or truncate them.
- Omit optional parameters unless they are required to disambiguate the request. Sending unused filters narrows results unintentionally.
- For tools that accept a `lines[]` array, build each line as an object whose keys are declared in the entity schema (for example `product_id`, `qty`, `unit_price`).
- Never include fields that do not appear in the schema, even if they seem natural. The MCP server will reject the call with `VALIDATION_ERROR`.

## Interpreting responses

A successful response contains business data and no `error` key. The agent must:

1. Extract only the fields needed for the next step.
2. Persist nothing locally — pass relevant values directly into the next tool call.
3. Detect business-level conditions (for example, `available_qty < qty_ordered`) and branch accordingly. Stock, status, and balance comparisons drive the next call.

A failed response contains an `error` object with `code`, `message`, and optional `details`. Branch on `error.code` using the [Error handling](#error-handling) table.

## Complete pattern — restock from open sales orders

This pattern shows the canonical sequence for the goal: "Ensure stock is sufficient to fulfil all open orders of a customer; create a purchase order to cover any shortfall."

### Step 1 — Verify the connection

Read the status resource:

```
resource: etendo://status
```

Expected response shape:

```json
{
  "status": "ok",
  "instance": "https://go.etendo.cloud",
  "version": "2.0"
}
```

Abort if the response carries an `error` object. Otherwise continue.

### Step 2 — Read schemas for every write target

Read each schema the loop will touch with a write later:

```
resource: etendo://schema/sales-order
resource: etendo://schema/purchase-order
resource: etendo://schema/product
```

Confirm that the planned arguments use the field names declared in each schema. If the schemas declare unfamiliar required fields, re-plan before continuing.

### Step 3 — List open sales orders for the customer

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

From the response, collect every `(product_id, qty_ordered)` pair across all lines of all returned orders.

### Step 4 — Check stock for each product

For every distinct `product_id` collected in step 3, invoke:

```json
{
  "tool": "get_stock_levels",
  "arguments": {
    "product_id": "P-00045"
  }
}
```

Sum `available_qty` across warehouses and compare against the total `qty_ordered` for that product. Record any deficit `= total_qty_ordered − total_available_qty`.

### Step 5 — Find the vendor for each deficit product

Tool call:

```json
{
  "tool": "list_vendors",
  "arguments": {
    "search": "Widget"
  }
}
```

Select the vendor whose `default_product_ids` contains the deficit product. If no vendor matches, escalate to a human and stop — the agent must not invent a vendor or guess a price.

### Step 6 — Create the purchase order

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

The response returns a draft purchase order:

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

Hand the draft `id` to the user for review. Do **not** auto-confirm unless the user has explicitly authorised confirmation in this session.

### Step 7 — Confirm only when authorised

If the user has authorised confirmation, invoke:

```json
{
  "tool": "confirm_purchase_order",
  "arguments": {
    "order_id": "PO-20240601-005"
  }
}
```

Stop when the response `status` transitions from `draft` to `confirmed`. Report the final ID and status to the user.

## Error handling

When a tool call or resource read returns an `error` object, branch on `error.code` using this decision table. The "Agent action" column is normative.

| `error.code` | Agent action |
|--------------|--------------|
| `AUTH_FAILED` | **Abort and escalate.** Credentials are invalid and the agent cannot recover. Do not retry. Report the error message verbatim and ask the user to verify `ETENDO_USERNAME` and `ETENDO_PASSWORD` in the MCP client configuration. |
| `TOKEN_EXPIRED` | **Retry once.** A token refresh race is the likely cause; reissue the same call. If the second attempt also returns `TOKEN_EXPIRED`, escalate and report that `ETENDO_TOKEN_TTL` likely needs to be reduced. |
| `INSUFFICIENT_PERMISSIONS` | **Abort and escalate.** Do not retry the same call and do not substitute a different tool to bypass the restriction. Report `error.details.required_role` so a human can assign the missing role. |
| `RECORD_NOT_FOUND` | **Do not retry with the same ID.** Run the corresponding `list_*` tool to resolve a valid ID, then retry with the verified ID. If the entity legitimately does not exist, report the absence to the user and stop. |
| `VALIDATION_ERROR` | **Retry once with corrected arguments.** Read `error.details` to identify the offending field, re-read the relevant `etendo://schema/<entity>` resource, rebuild the arguments, and retry. If validation fails again, escalate and report the schema mismatch. |
| `RATE_LIMITED` | **Retry with backoff.** Wait and retry with exponential backoff starting at 2 seconds, doubling up to a maximum of 30 seconds, for at most three attempts. If the limit persists, escalate and report the call frequency that triggered the limit. |

For any error code not listed above, **abort and escalate**. Never proceed with a destructive operation on the basis of an unfamiliar error.

## Safety rules

The following rules apply to every task without exception:

- The agent must never auto-confirm a sales or purchase order, post an invoice, or trigger a payment unless the user has explicitly authorised that action in the current session.
- The agent must never invent identifiers, prices, quantities, dates, or vendor or customer names. Every value sent in `arguments` must originate from a prior tool response, a resource read, or the user.
- The agent must report every created or modified record ID back to the user so the change is auditable inside Etendo Go.
- When in doubt, prefer read tools (`list_*`, `get_*`) and resource reads (`etendo://schema/*`) over write tools (`create_*`, `confirm_*`). A redundant read is always safer than an unwanted write.
