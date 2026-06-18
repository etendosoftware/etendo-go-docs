# Contacts — Business Partners, contacts, locations and bank accounts

## Overview

The `contacts` spec is the Etendo Go window that an agent uses to manage the **Business Partner** master data: companies and individuals that the organisation sells to, buys from, or employs, together with their addresses, contacts, bank accounts and accounting / fiscal configuration.

This guide covers:

- The full set of 17 entities exposed by the `contacts` spec and the underlying database tables they read from.
- The architectural distinction between the four semantic views (`businessPartner`, `customer`, `vendorCreditor`, `employee`) that share the same `C_BPartner` table but expose different default values.
- How to resolve foreign-key fields through `etendo_neo_selectors` before creating a record.
- End-to-end examples for the most frequent agentic operations: creating a customer, creating a vendor, creating an individual person, adding a location, and adding a contact.
- The two read-only entities (`bp-stats`, `bp-trend`) and the limitation that prevents them from being queried through the standard `etendo_neo_*` tools today.

This document assumes the reader has already followed [../mcp/index.md](../mcp/index.md) and has a working MCP connection to an Etendo Go instance.

## Prerequisites

- A configured Etendo Go MCP server — see [../mcp/index.md](../mcp/index.md) for credentials, environment variables, and connectivity checks.
- An API user with a role that grants access to the **Business Partner** window (`contacts` spec). Verify with `etendo_neo_discover` that `contacts` is listed in the returned `specs` array.
- An MCP-compatible client (Claude Desktop, Claude Code, or any client implementing MCP spec `2024-11-05` or later).

## Architectural notes

### The four semantic views over `C_BPartner`

Inside Etendo Go, customers, vendors, employees and the generic business partner record all live in the same physical table — `C_BPartner`. The `contacts` spec exposes four entities that target this table from different angles:

| Entity | Underlying table | Purpose | Defaults set on create |
|--------|------------------|---------|------------------------|
| `businessPartner` | `C_BPartner` | Generic master record — no role flag is forced | None forced |
| `customer` | `C_BPartner` | Same table viewed as a customer | `iscustomer = Y` |
| `vendorCreditor` | `C_BPartner` | Same table viewed as a vendor/creditor | `isvendor = Y` |
| `employee` | `C_BPartner` | Same table viewed as an employee | `isemployee = Y` |

Consequences for an agent:

- A record created via `customer` is **the same row** as the equivalent record created via `businessPartner`; only the flags differ.
- A single Business Partner can be a customer **and** a vendor at the same time. Updating the same `C_BPartner_ID` through the `customer` and `vendorCreditor` entities sets both flags on the same row.
- When the user asks the agent to "create a customer", prefer the `customer` entity — it sets `iscustomer = Y` automatically. The agent should not invent or send role flags it has not read from the schema.

### Individuals vs companies (`etgoIsperson`)

`C_BPartner` carries an `etgoIsperson` flag (Etendo extension). Set `etgoIsperson = Y` when the record represents an **individual person** rather than a company. The flag affects validation rules (for example, fiscal identifier formatting) and the labels rendered in dependent UIs.

Always read the schema via `etendo_neo_schema(spec="contacts", entity=<view>)` before writing — the exact field `name` for the flag is exposed by the schema.

### Read-only entities without an `AD_Tab`

Two of the 17 entities are not regular tabs of the Business Partner window — they are aggregated views (`bp-stats`, `bp-trend`) used by dashboards. They have **no `AD_Tab`** wired to them in the current build. Consequence:

- Calls to `etendo_neo_list`, `etendo_neo_schema`, `etendo_neo_get`, `etendo_neo_create`, `etendo_neo_update`, `etendo_neo_delete` and `etendo_neo_action` against `spec="contacts", entity="bp-stats"` or `entity="bp-trend"` **return an error**.
- An agent must not invent statistics for a Business Partner. Treat these entities as documented-but-unavailable and surface the limitation to the user when asked.

## Available capabilities

### Entities exposed by the `contacts` spec

The list below was obtained from `etendo_neo_discover` against the same instance referenced in [../mcp/index.md](../mcp/index.md). Confirm the list at runtime against your own instance — the visible subset depends on the API user's role.

| # | Entity | Underlying table | Kind | CRUD via `etendo_neo_*` |
|---|--------|------------------|------|-------------------------|
| 1 | `businessPartner` | `C_BPartner` | Header (generic view) | Yes |
| 2 | `customer` | `C_BPartner` | Header (customer view) | Yes |
| 3 | `vendorCreditor` | `C_BPartner` | Header (vendor view) | Yes |
| 4 | `employee` | `C_BPartner` | Header (employee view) | Yes |
| 5 | `contact` | `AD_User` | Child tab — contact persons of a BP | Yes |
| 6 | `locationAddress` | `C_BPartner_Location` | Child tab — addresses of a BP | Yes |
| 7 | `bankAccount` | `C_BP_BankAccount` | Child tab — bank accounts of a BP | Yes |
| 8 | `documentType` | Document-type template tab on `C_BPartner` | Child tab — preferred document types per BP | Yes |
| 9 | `basicDiscount` | Basic-discount tab on `C_BPartner` | Child tab — basic discount rules per BP | Yes |
| 10 | `customerAccounting` | Customer accounting tab on `C_BPartner` | Child tab — accounting configuration of the customer view | Yes |
| 11 | `vendorAccounting` | Vendor accounting tab on `C_BPartner` | Child tab — accounting configuration of the vendor view | Yes |
| 12 | `employeeAccounting` | Employee accounting tab on `C_BPartner` | Child tab — accounting configuration of the employee view | Yes |
| 13 | `costSalaryCategory` | Cost / salary category tab on `C_BPartner` | Child tab — cost category for employees | Yes |
| 14 | `intrastatShipments` | Intrastat configuration tab (shipments side) on `C_BPartner` | Child tab — Intrastat parameters used on shipments | Yes |
| 15 | `intrastatAdquisitions` | Intrastat configuration tab (acquisitions side) on `C_BPartner` | Child tab — Intrastat parameters used on goods receipts | Yes |
| 16 | `bp-stats` | Aggregated view (no `AD_Tab`) | Read-only aggregate — **not callable** | **No — returns an error** |
| 17 | `bp-trend` | Aggregated view (no `AD_Tab`) | Read-only aggregate — **not callable** | **No — returns an error** |

For the authoritative field metadata of any callable entity — names, types, required flags, read-only flags, default expressions, selector flags, and buttons — call:

```json
{ "tool": "etendo_neo_schema", "arguments": { "spec": "contacts", "entity": "<entity>" } }
```

Never assume column names from this table; always validate the schema before sending `fields` to `etendo_neo_create` or `etendo_neo_update`.

### Tools used on the `contacts` spec

Every operation on `contacts` is performed with the generic tools listed in [../mcp/index.md](../mcp/index.md). The table below highlights the subset most relevant to this spec.

| Tool | Use on `contacts` |
|------|-------------------|
| `etendo_neo_discover` | Confirm that `contacts` is reachable and list its entities |
| `etendo_neo_schema` | Inspect required and writable fields before writing a Business Partner, location, contact, etc. |
| `etendo_neo_defaults` | Preview server-side defaults for a new record (e.g. business partner category, currency) |
| `etendo_neo_selectors` | Resolve foreign-key values: `businessPartnerCategory`, `priceList`, `paymentTerms`, `paymentMethod`, parent `businessPartner`, country, region, language, etc. |
| `etendo_neo_list` | Browse existing Business Partners, contacts, locations, or bank accounts with filters and pagination |
| `etendo_neo_get` | Retrieve a single Business Partner / contact / location by ID |
| `etendo_neo_create` | Create a Business Partner, contact, location, or bank account |
| `etendo_neo_update` | Update an existing Business Partner, contact, location, or bank account |
| `etendo_neo_delete` | Delete a record by ID (when allowed by the underlying business rules) |
| `etendo_neo_batch` | Create a Business Partner together with its first location and contact in a single atomic transaction |

`etendo_neo_action` is available on `contacts` only when the schema reports `type: "button"` fields (for example process buttons exposed by Etendo customisations). For the standard `contacts` window there is no document confirmation button equivalent to `DocAction` on sales orders.

## Resolving foreign keys with `etendo_neo_selectors`

A Business Partner record links to several other masters: business partner category, price list, payment terms, payment method, language, etc. A location links to country and region. A contact links to a parent Business Partner. Every one of these is exposed as a foreign-key field, and the agent must resolve it through `etendo_neo_selectors` before sending an `etendo_neo_create` or `etendo_neo_update` call.

The general pattern is:

1. Read the schema and identify the FK columns (fields with `hasSelector: true`).
2. For each FK column, call `etendo_neo_selectors` with `spec`, `entity`, `column` and an optional `query` to narrow results.
3. If the selector depends on other values of the same record (for example, a contact's selectable Business Partner role depends on the parent Business Partner), pass `recordContext` with those values.
4. If the selector depends on header values (for example, a child tab on a Business Partner inherits the parent's organisation or category), pass `parentContext` with the relevant parent record values.
5. Pick the row that matches the user's intent and pass its `id` into the next tool call.

Example — resolve `businessPartnerCategory` on the `customer` entity:

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "contacts",
    "entity": "customer",
    "column": "businessPartnerCategory",
    "query": "Standard"
  }
}
```

Example — resolve a country on `locationAddress` while creating an address for an existing parent Business Partner:

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "contacts",
    "entity": "locationAddress",
    "column": "country",
    "query": "Spain",
    "parentContext": { "businessPartner": "<bp-id>" }
  }
}
```

The exact `column` name comes from the schema; do not invent it.

## End-to-end usage examples

Every example below assumes the agent has already verified connectivity (`etendo://status`), called `etendo_neo_discover`, and confirmed that `contacts` is in the returned `specs` array.

### Example 1 — Create a customer (company)

**Goal**: Register a new company customer called "Acme Industries" under the standard business partner category.

#### Step 1 — Read the schema for the `customer` view

```json
{
  "tool": "etendo_neo_schema",
  "arguments": { "spec": "contacts", "entity": "customer" }
}
```

The response lists every writable field. Typical required fields for a customer record include the search key, the commercial name, and the business partner category; many other fields are auto-filled by defaults.

#### Step 2 — (Optional) Preview defaults

```json
{
  "tool": "etendo_neo_defaults",
  "arguments": { "spec": "contacts", "entity": "customer" }
}
```

#### Step 3 — Resolve the business partner category

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "contacts",
    "entity": "customer",
    "column": "businessPartnerCategory",
    "query": "Standard"
  }
}
```

Capture the returned `id` for use in the create call.

#### Step 4 — Create the customer

Send only the fields confirmed in step 1 and resolved in step 3. The example below uses placeholder field names that must be replaced by the exact `name` values reported by the schema in your instance:

```json
{
  "tool": "etendo_neo_create",
  "arguments": {
    "spec": "contacts",
    "entity": "customer",
    "fields": {
      "searchKey": "ACME",
      "name": "Acme Industries",
      "businessPartnerCategory": "<category-id-from-step-3>"
    }
  }
}
```

The response contains the new `C_BPartner_ID` (returned as `id`). Persist it for the follow-up steps that add a location and a contact.

### Example 2 — Create a vendor (company)

Identical to Example 1, but target the `vendorCreditor` entity. The server forces `isvendor = Y` on the resulting `C_BPartner` row.

```json
{
  "tool": "etendo_neo_create",
  "arguments": {
    "spec": "contacts",
    "entity": "vendorCreditor",
    "fields": {
      "searchKey": "GLOBEX",
      "name": "Globex Supplies",
      "businessPartnerCategory": "<category-id>"
    }
  }
}
```

If the same record must be **both** a customer and a vendor, create it once through one entity and then update the other view on the same `id`:

```json
{
  "tool": "etendo_neo_update",
  "arguments": {
    "spec": "contacts",
    "entity": "customer",
    "id": "<bp-id-created-as-vendor>",
    "fields": {}
  }
}
```

Updating the same record through a second view causes the server to set the corresponding role flag on the shared `C_BPartner` row.

### Example 3 — Create an individual person

**Goal**: Register an individual person (not a company), for example a freelance contractor or a private customer.

The `etgoIsperson` flag on `C_BPartner` marks the record as a person. Read the schema first to confirm the exact field name reported for the flag, then create the record through the most appropriate view (typically `customer` or `vendorCreditor`):

```json
{ "tool": "etendo_neo_schema", "arguments": { "spec": "contacts", "entity": "customer" } }
```

```json
{
  "tool": "etendo_neo_create",
  "arguments": {
    "spec": "contacts",
    "entity": "customer",
    "fields": {
      "searchKey": "JANEDOE",
      "name": "Jane Doe",
      "businessPartnerCategory": "<category-id>",
      "etgoIsperson": "Y"
    }
  }
}
```

When the user describes the entity in human terms ("a freelancer", "a self-employed contractor", "a private customer"), default to `etgoIsperson = Y` and confirm with the user before sending the call.

### Example 4 — Add a location to a Business Partner

**Goal**: Attach a postal address to an existing Business Partner.

#### Step 1 — Read the `locationAddress` schema

```json
{ "tool": "etendo_neo_schema", "arguments": { "spec": "contacts", "entity": "locationAddress" } }
```

The schema declares the parent FK (typically `businessPartner`) and the address fields. Some address sub-fields (street, city, postal code, country, region) are exposed directly; others belong to the embedded location record and are also surfaced through the schema.

#### Step 2 — Resolve country and (optionally) region

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "contacts",
    "entity": "locationAddress",
    "column": "country",
    "query": "Spain",
    "parentContext": { "businessPartner": "<bp-id>" }
  }
}
```

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "contacts",
    "entity": "locationAddress",
    "column": "region",
    "recordContext": { "country": "<country-id>" },
    "parentContext": { "businessPartner": "<bp-id>" }
  }
}
```

#### Step 3 — Create the location

```json
{
  "tool": "etendo_neo_create",
  "arguments": {
    "spec": "contacts",
    "entity": "locationAddress",
    "fields": {
      "businessPartner": "<bp-id>",
      "address1": "Calle de Alcalá 100",
      "city": "Madrid",
      "postalCode": "28009",
      "country": "<country-id>",
      "region": "<region-id>"
    }
  }
}
```

The exact field names (`address1`, `city`, `postalCode`, etc.) must come from `etendo_neo_schema`. The example uses common Openbravo / Etendo names but the agent must verify them against the schema before sending the call.

### Example 5 — Add a contact (person) to a Business Partner

**Goal**: Attach a contact person to an existing Business Partner. The contact entity writes to `AD_User`.

#### Step 1 — Read the `contact` schema

```json
{ "tool": "etendo_neo_schema", "arguments": { "spec": "contacts", "entity": "contact" } }
```

The schema declares the parent FK (the Business Partner the contact belongs to) and the personal data fields (name, email, phone, position).

#### Step 2 — Create the contact

```json
{
  "tool": "etendo_neo_create",
  "arguments": {
    "spec": "contacts",
    "entity": "contact",
    "fields": {
      "businessPartner": "<bp-id>",
      "name": "John Smith",
      "email": "john.smith@acme.example",
      "phone": "+34 600 000 000"
    }
  }
}
```

Field names must be confirmed against the schema. Some Etendo builds expose additional contact-only flags (sales contact, billing contact, etc.); rely on the schema for the authoritative list.

### Example 6 — Create a Business Partner, its first location and its first contact atomically

When the user asks for the Business Partner and its first child records to commit or roll back together, use `etendo_neo_batch`. Chain the children to the header with `parentRef`:

```json
{
  "tool": "etendo_neo_batch",
  "arguments": {
    "operations": [
      {
        "id": "bp1",
        "spec": "contacts",
        "entity": "customer",
        "body": {
          "searchKey": "ACME",
          "name": "Acme Industries",
          "businessPartnerCategory": "<category-id>"
        }
      },
      {
        "id": "loc1",
        "spec": "contacts",
        "entity": "locationAddress",
        "parentRef": "bp1",
        "body": {
          "address1": "Calle de Alcalá 100",
          "city": "Madrid",
          "postalCode": "28009",
          "country": "<country-id>",
          "region": "<region-id>"
        }
      },
      {
        "id": "c1",
        "spec": "contacts",
        "entity": "contact",
        "parentRef": "bp1",
        "body": {
          "name": "John Smith",
          "email": "john.smith@acme.example",
          "phone": "+34 600 000 000"
        }
      }
    ]
  }
}
```

A successful response has `committed: true` and lists the resolved `recordId` for each op. A failure returns `committed: false` together with `failedAt` and `error`; the whole batch is rolled back, so no orphan rows remain.

### Example 7 — Browse existing Business Partners

To list customers whose name contains "Acme":

```json
{
  "tool": "etendo_neo_list",
  "arguments": {
    "spec": "contacts",
    "entity": "customer",
    "filters": { "name": "Acme" },
    "limit": 20
  }
}
```

The exact filter keys accepted by `etendo_neo_list` for this entity are the same field `name` values returned by `etendo_neo_schema`.

### Example 8 — Update a Business Partner

To change the commercial name of an existing customer:

```json
{
  "tool": "etendo_neo_update",
  "arguments": {
    "spec": "contacts",
    "entity": "customer",
    "id": "<bp-id>",
    "fields": {
      "name": "Acme Industries S.L."
    }
  }
}
```

Only fields with `readOnly: false` may be sent. The schema marks identifiers (`id`, `searchKey` once committed) and audit columns as read-only.

### Example 9 — Delete a contact or a location

```json
{
  "tool": "etendo_neo_delete",
  "arguments": {
    "spec": "contacts",
    "entity": "contact",
    "id": "<contact-id>"
  }
}
```

Deletion fails when business rules (existing documents referencing the record, "in use" relations, etc.) block it. Read the returned error message and surface it verbatim — the agent must not bypass the check by deleting from another entity.

## Error handling

The error shapes returned by the `contacts` spec are the standard ones documented in [../mcp/index.md](../mcp/index.md). The table below highlights the cases that are specific to this spec.

| Symptom | Likely cause | Resolution |
|---------|--------------|------------|
| Any call against `entity="bp-stats"` or `entity="bp-trend"` returns an error | These entities have no `AD_Tab` wired; they are not callable through the standard CRUD tools | Do not invent statistics. Report the limitation to the user and read the underlying KPIs through the `dashboard` spec instead, if available to the role |
| `etendo_neo_create` rejects a field as required | A field with `required: true` was omitted (commonly the business partner category) or an FK was sent unresolved | Re-read `etendo_neo_schema`; resolve every FK with `etendo_neo_selectors`; retry with the corrected `fields` object |
| `etendo_neo_create` on `customer`, `vendorCreditor` or `employee` returns a record that is **not** flagged as such | The agent updated `C_BPartner` through `businessPartner` instead of the role view | Repeat the operation through the role view (`customer`, `vendorCreditor`, or `employee`) so the server sets the matching flag |
| `etendo_neo_delete` rejects the call with a "record in use" message | The Business Partner, location or contact is referenced by existing documents | Do not attempt to bypass — report the message verbatim and ask the user how to proceed (deactivate vs delete) |
| `etendo_neo_selectors` returns no rows for an FK that the user assumes exists (e.g. a country or a category) | The query string did not match any record visible to the role, or the dependent context (`parentContext` / `recordContext`) was incomplete | Broaden the query, confirm the parent context, and never invent IDs |

For every other failure shape, follow the general decision table in [../agent-manual.md](../agent-manual.md#error-handling): abort and escalate when in doubt.
