# Etendo Go — Agent Operating Manual

## Overview

This manual instructs an AI agent on how to operate against an Etendo Go instance end-to-end. It is written as a normative operating guide: every directive applies to the agent at runtime, not to the developer reading the document. Treat each rule as binding unless the user explicitly overrides it for a single session.

The companion document [./mcp/index.md](./mcp/index.md) lists the protocol's surface (configuration, tools, the single resource, and the `spec + entity` model). This manual explains **how** to use that surface — how to discover what is available, how to read schemas before mutating data, how to chain tool calls, how to interpret each response, and how to react when a process action fails.

## Operating environment and constraints

The agent operates under these constraints at all times:

- The MCP server documented in [./mcp/index.md](./mcp/index.md) is the **only** channel to Etendo Go. The agent must not call the NEO Headless REST API directly, must not browse the Etendo Go web UI, and must not assume access to the filesystem of the Etendo instance or of the MCP server host.
- The agent's capabilities are bounded by the tools listed in `agentic/mcp/index.md`. If a task cannot be expressed as a sequence of those tool calls, abort and escalate to a human operator.
- The MCP server exposes **one** resource, `etendo://status`. There are no per-entity schema resources. To obtain entity field metadata, call `etendo_neo_schema(spec, entity)`.
- Every CRUD tool call is routed by two arguments — `spec` (the API namespace, e.g. `sales-order`) and `entity` (the tab inside that namespace, e.g. `header` or `lines`). Never invent a spec or entity name from memory; obtain them through `etendo_neo_discover` at the start of the session.
- The agent is stateless between sessions. Do not rely on record IDs, user roles, spec lists, or configuration values learned in a previous run — confirm them through the MCP server before acting.
- Credentials (`ETENDO_USERNAME`, `ETENDO_PASSWORD`) and tokens are owned by the MCP server. The agent must never request them, store them, or echo them back to the user.

## The agent operating loop

Execute the following loop for every task the user delegates. Do not skip steps — each one prevents a specific class of failure.

1. **Restate the goal in MCP terms.** Map the user's request to a target `(spec, entity)` pair and an operation: discover, list, get, create, update, delete, action, or batch. If no mapping exists, stop and ask the user.
2. **Verify connectivity.** Read `etendo://status` before the first call of a session and whenever a previous call has failed with a transport-level error.
3. **Discover specs and entities.** Call `etendo_neo_discover` once per session to obtain the authoritative set of `(spec, entity)` pairs the current user can access. Never hard-code these names.
4. **Read schemas before writing.** For every entity the agent will create, update, or delete, call `etendo_neo_schema(spec, entity)` first. Confirm planned `fields` keys against the schema's `name` values, and respect `required` and `readOnly` flags.
5. **Discover real values.** Before sending FK fields, resolve them through `etendo_neo_selectors`. For child entities and FK fields whose selector depends on other values, pass `parentContext` / `recordContext`. The agent must never invent IDs, names, prices, or quantities.
6. **Invoke the tool.** Build the `fields` (or `body`, in `etendo_neo_batch`) object using only the field names declared by the schema and the values resolved from selectors.
7. **Interpret the response.** A CRUD tool returns the created/updated record on success. `etendo_neo_action` returns `{ processResult, processMessage }`. `etendo_neo_batch` returns `{ committed, operations | failedAt, error }`. Branch on the result using the [Error handling](#error-handling) table.
8. **Stop or iterate.** Continue the loop until the goal is met or an error mandates abort or escalation. Report every created or modified record ID back to the user so the change is auditable inside Etendo Go.

## Reading metadata before acting

The MCP server exposes three read-only metadata tools that have no side effects. Use them as the source of truth for structural knowledge before mutating data.

| Tool | When to call | Purpose |
|------|--------------|---------|
| `etendo_neo_discover` | First call of every session, and again after the user's role changes | Obtain the authoritative `(spec, entity)` map |
| `etendo_neo_schema(spec, entity)` | Before every `etendo_neo_create`, `etendo_neo_update`, `etendo_neo_action`, or `etendo_neo_batch` op that targets that entity | Discover field names, types, required flags, read-only flags, default expressions, and the buttons available for `etendo_neo_action` |
| `etendo_neo_defaults(spec, entity, parentId?, assetId?)` | Optional — before `etendo_neo_create`, when the agent wants to preview server-side defaults without creating | Inspect computed default values |

If a schema call returns an unexpected structure (missing fields, unknown types, or an error payload), abort the mutation and report the discrepancy to the user. Do not attempt a write against an unverified schema.

## Selecting the right tool

Map the user goal to one of the tools from `agentic/mcp/index.md` using this decision table. If no row matches, stop and inform the user that the operation is outside the MCP server's surface.

| Goal | Tool |
|------|------|
| List specs and entities the current user can access | `etendo_neo_discover` |
| Inspect field metadata for an entity | `etendo_neo_schema` |
| Preview default values for a new record | `etendo_neo_defaults` |
| Resolve a foreign-key field to valid IDs | `etendo_neo_selectors` |
| Browse records of one entity (with filters / pagination / sort) | `etendo_neo_list` |
| Fetch one record by ID | `etendo_neo_get` |
| Create one record | `etendo_neo_create` |
| Update one record by ID | `etendo_neo_update` |
| Delete one record by ID | `etendo_neo_delete` |
| Fire a process / document action on a record (confirm, post, copy lines, generate template, etc.) | `etendo_neo_action` |
| Create a header and its children atomically across one or more specs | `etendo_neo_batch` |
| Render a pre-built report | `etendo_generate_aging_receivable`, `etendo_generate_bank_statements`, `etendo_generate_financial_account_transactions`, `etendo_generate_financial_accounts_page`, `etendo_generate_inventory_stock_report`, `etendo_generate_tax_report` |

## Resolving foreign-key fields

Most write operations include at least one foreign-key field. Always resolve FKs through `etendo_neo_selectors` rather than guessing.

- **Simple selectors.** Pass `spec`, `entity`, and `column`. Optional `query` narrows the result.
- **Selectors that depend on other fields of the same record.** Pass `recordContext` carrying the values the selector needs. For example, `partnerAddress` on `sales-order/header` requires `{ "businessPartner": "<id>" }` in `recordContext`.
- **Line-level selectors that depend on the header.** Pass `parentContext` with the relevant header values. For example, `tax` on `sales-order/lines` typically requires `{ "businessPartner": "<id>", "orderDate": "<YYYY-MM-DD>", "priceList": "<id>" }`.

Never pass IDs that did not come back from a selector, a previous `etendo_neo_list` / `etendo_neo_get`, or directly from the user.

## Constructing arguments

- Use the exact `name` values declared by `etendo_neo_schema` for the keys inside `fields` (or `body`, in `etendo_neo_batch`). Do not use the underlying database column names; do not invent JSON keys.
- Submit only fields whose schema entry has `readOnly: false`. Fields such as `id` and `documentNo` are auto-generated; sending them produces a validation error.
- Provide every field with `required: true` (unless the field has a `defaultExpression` that satisfies the requirement server-side; in that case it is safe to omit).
- Pass dates in ISO 8601 (`YYYY-MM-DD`). Reject any other format before sending the call.
- Pass identifiers exactly as returned by previous tool calls — do not normalise, lowercase, or truncate them.
- Buttons (`type: "button"` with `invokeVia: "neo_action"`) are **not** regular fields. Fire them through `etendo_neo_action` with `action` set to the button's `action` value (e.g. `"DocAction"`, `"Posted"`, `"CopyFrom"`). When the button accepts parameters (for example `DocAction` accepts `{ "docAction": "CO" }`), pass them via the `parameters` argument.
- Never include fields that do not appear in the schema, even if they seem natural. The server will reject the call.

## Interpreting responses

A successful CRUD response contains the affected record (or, for `etendo_neo_list`, a list of records) and no error payload. The agent must:

1. Extract only the fields needed for the next step.
2. Persist nothing locally — pass relevant values directly into the next tool call.
3. Detect business-level conditions (for example, a `documentStatus` that is still `DR` after a confirmation attempt) and branch accordingly.

A `etendo_neo_action` response is **always** a `{ processResult, processMessage }` envelope. Branch on `processResult`:

- `success` — continue.
- `warning` — treat the action as applied; surface `processMessage` to the user.
- `error` — abort and surface `processMessage` to the user. Do not blindly retry.

A `etendo_neo_batch` response carries `committed: true` (with `operations[]` listing the resolved `recordId` per op) on success, or `committed: false` with `failedAt: { id, index }` and `error: { status, message, detail? }` on failure. A failure rolls back every op in the batch; nothing is partially written.

## Complete pattern — create and confirm a sales order

This pattern shows the canonical sequence for the goal: "Create a sales order with one line for an existing customer, then confirm it."

### Step 1 — Verify the connection and discover specs

```
resource: etendo://status
```

```json
{ "tool": "etendo_neo_discover", "arguments": {} }
```

Abort if either call returns a transport error. Confirm that `sales-order` is present in the `specs` array.

### Step 2 — Read schemas for every write target

```json
{ "tool": "etendo_neo_schema", "arguments": { "spec": "sales-order", "entity": "header" } }
{ "tool": "etendo_neo_schema", "arguments": { "spec": "sales-order", "entity": "lines" } }
```

Identify the required, writable fields and the buttons available for `etendo_neo_action`. The `sales-order/header` schema declares `documentAction` as a button with `action: "DocAction"` — the agent will use it in step 6.

### Step 3 — Resolve header foreign keys

Resolve `businessPartner`, then the dependent `partnerAddress` and `invoiceAddress`:

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

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "sales-order",
    "entity": "header",
    "column": "partnerAddress",
    "recordContext": { "businessPartner": "<bp-id>" }
  }
}
```

Repeat for `invoiceAddress`, `priceList`, `paymentTerms`, `warehouse`, `currency`, and `transactionDocument`.

### Step 4 — Create the header

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

Capture the response `id` — this is the header's `C_Order_ID`.

### Step 5 — Resolve line selectors and create the line

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

### Step 6 — Confirm the order — only when authorised

Do not auto-confirm unless the user has explicitly authorised confirmation in the current session. When authorised:

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

Branch on `processResult`. On `success`, report the final `id` and the new `documentStatus` to the user.

### Step 7 — (Alternative) Atomic creation via `etendo_neo_batch`

When the agent needs the header and lines to commit or roll back together, replace steps 4 and 5 with a single `etendo_neo_batch` call. Use `parentRef: "<headerOpId>"` to set the line's parent FK, and `$ref:<opId>` substitution inside `body` if a value must be resolved from an earlier op. A confirmation `etendo_neo_action` still runs after the batch commits.

## Error handling

> The MCP server today surfaces failures in three shapes: transport-level client errors, NEO Headless API errors propagated through `etendo_neo_*` responses, and the `processResult: "error" | "warning"` envelope from `etendo_neo_action`. Specific symbolic error codes (such as `AUTH_FAILED` or `RATE_LIMITED`) **have not been verified** against the running server; treat the rows below as the verified surface and add more rows only when you confirm a new shape in practice.

When a call fails, branch using this decision table. The "Agent action" column is normative.

| Symptom | Agent action |
|---------|--------------|
| Transport error from the MCP client (server unreachable, invalid credentials, role missing) | **Abort and escalate.** Do not retry. Report the client error verbatim and ask the user to verify `ETENDO_BASE_URL`, `ETENDO_USERNAME`, `ETENDO_PASSWORD`, and the API user's role assignments. |
| `etendo_neo_discover` returns an empty `specs` array | **Abort and escalate.** The API user has no role granting access to NEO Headless windows. Ask the user to assign an appropriate role in **Configuration → Users and permissions**. |
| `etendo_neo_schema` returns a structure missing the expected fields | **Abort the mutation.** Report the discrepancy to the user. Do not attempt a write against an unverified schema. |
| `etendo_neo_create` or `etendo_neo_update` rejects a field as required or read-only | **Retry once with corrected arguments.** Re-read the schema, rebuild `fields` using only writable names, and retry. If the second attempt also fails, escalate with the server message. |
| `etendo_neo_selectors` returns no rows for a non-empty `query` | **Do not invent an ID.** Ask the user to confirm the search term, or broaden the query. |
| `etendo_neo_action` returns `processResult: "warning"` | **Treat the action as applied.** Surface `processMessage` verbatim to the user; continue if downstream steps remain. |
| `etendo_neo_action` returns `processResult: "error"` | **Abort and escalate.** Report `processMessage` verbatim. Do not retry blindly — the message usually points at a business rule, missing field, or state transition that the agent cannot fix without user input. |
| `etendo_neo_batch` returns `committed: false` | **Treat the whole batch as not applied.** Use `failedAt.index` to locate the offending op and `error.message` to diagnose. Rebuild and retry only once the underlying cause is fixed. |

For any failure shape not listed above, **abort and escalate**. Never proceed with a destructive operation on the basis of an unfamiliar error.

## Safety rules

The following rules apply to every task without exception:

- The agent must never auto-confirm (`etendo_neo_action` with `DocAction`) a sales or purchase order, post (`Posted`) a financial document, or trigger a payment process unless the user has explicitly authorised that action in the current session.
- The agent must never invent identifiers, prices, quantities, dates, document statuses, or vendor / customer names. Every value sent in `fields` must originate from `etendo_neo_selectors`, `etendo_neo_list`, `etendo_neo_get`, or the user.
- The agent must report every created or modified record ID back to the user so the change is auditable inside Etendo Go.
- When in doubt, prefer read tools (`etendo_neo_discover`, `etendo_neo_schema`, `etendo_neo_defaults`, `etendo_neo_selectors`, `etendo_neo_list`, `etendo_neo_get`) over write tools (`etendo_neo_create`, `etendo_neo_update`, `etendo_neo_delete`, `etendo_neo_action`, `etendo_neo_batch`). A redundant read is always safer than an unwanted write.
