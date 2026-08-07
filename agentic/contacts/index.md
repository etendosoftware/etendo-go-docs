# Contacts — Agentic Documentation

## Overview

The `contacts` spec is Etendo Go's central registry of business partners (customers, vendors / creditors, employees, and the people that work for them). It backs the **Contactos** window in the Etendo Go UI ([user guide](../../docs/es/comercial/contactos/contactos.md)), but every operation exposed through the UI is also reachable through MCP.

A single business partner record can hold any combination of three roles — **Customer**, **Vendor**, **Employee** — by flipping the matching flag on the partner. The same record exposes child entities for contact persons, addresses, bank accounts, accounting overrides, discounts, intrastat configuration, and document type defaults.

This guide maps every entity exposed by the `contacts` spec to its purpose, lists the entities that are non-functional today, and walks through the canonical agentic flow: locate a business partner, create a contact person, attach an address, then attach a bank account.

All entity names below were obtained from `etendo_neo_discover` against a current Etendo Go instance and match the discovery list in the [MCP guide](../mcp/index.md#specs-available). Field-level details (required flags, FK selectors, default expressions, button columns) are **not** enumerated here on purpose — they are role / module dependent. Read them at runtime with `etendo_neo_schema(spec, entity)` before every write.

## Prerequisites

- The Etendo Go MCP server is configured in your client. See [MCP setup](../mcp/index.md).
- The API user has a role granting access to the **Business Partner** (Contactos) window. Verify by running `etendo_neo_discover` and confirming the `contacts` spec appears in the response.
- `etendo://status` is readable and authentication succeeds.

## Configuration

No additional configuration is required beyond the base MCP server. The `contacts` spec is exposed through the same generic `etendo_neo_*` tools described in the [MCP guide](../mcp/index.md).

## Available capabilities

### Entities (verified via `etendo_neo_discover`)

`contacts` is a write spec (type `W`). The entities below are the full set returned by `etendo_neo_discover` for the `contacts` spec, mapped to the corresponding section of the **Contactos** UI window.

| Entity | UI section | Purpose | Status |
|--------|------------|---------|--------|
| `businessPartner` | Form header (Razón Social / Persona / Empresa) | Header record of the partner. Holds the role flags (`IsCustomer`, `IsVendor`, `IsEmployee`), the name / search key, the language, the URL, the tax category, and the parent partner. | Functional |
| `customer` | Tab Financiero → sub-section Cliente | Customer-side configuration: price list, payment method, payment terms, sales rep, customer category, blocking flag, credit limit. Only relevant when the BP has the customer role enabled. | Functional |
| `vendorCreditor` | Tab Financiero → sub-section Proveedor | Vendor-side configuration: purchase price list, payment method, payment terms, vendor category, blocking flag, expense G/L account. Only relevant when the BP has the vendor role enabled. | Functional |
| `employee` | (employee role) | Employee-side configuration for partners flagged as employees. | Functional |
| `contact` | Tab General → sub-tab Persona | People that work for / represent the partner: name, email, phone, position, login. Maps to the Etendo "Contact (User)" tab on the BP. | Functional |
| `bankAccount` | Tab General → sub-tab Cuenta Bancaria | Bank accounts of the partner: IBAN, SWIFT, bank, branch, account number, currency. | Functional |
| `locationAddress` | Tab General → sub-tab Dirección | Postal addresses of the partner with their usage flags (`Dir. envíos`, `Dir. factura`, `Pay-from`, `Remit-to`). Editing an address opens the Location popup. | Functional |
| `customerAccounting` | Accounting sub-tab under Cliente | Per-organisation accounting overrides for the customer side (receivable, prepayment, write-off, not-invoiced revenue, etc.). | Functional |
| `vendorAccounting` | Accounting sub-tab under Proveedor | Per-organisation accounting overrides for the vendor side (liability, service liability, expense, prepayment, etc.). | Functional |
| `employeeAccounting` | Accounting sub-tab under Empleado | Per-organisation accounting overrides for the employee side. | Functional |
| `documentType` | (BP document-type defaults) | Per-partner default document type for sales / purchase documents — used when the partner overrides the org-level default. | Functional |
| `basicDiscount` | (BP discounts) | Discounts attached directly to the partner (independent of the price list). | Functional |
| `costSalaryCategory` | (employee salary categories) | Cost / salary category assignments for employees over time (valid-from date, cost rate). | Functional |
| `intrastatShipments` | (intrastat — outbound) | Intrastat configuration for outbound shipments to this partner. | Functional |
| `intrastatAdquisitions` | (intrastat — inbound) | Intrastat configuration for inbound acquisitions from this partner. | Functional |
| `bp-stats` | Panel Lateral (Ingresos / Gastos del mes) | **Non-functional today.** Appears in `etendo_neo_discover` but is **not** wired to an `AD_Tab`: calling `etendo_neo_schema(spec="contacts", entity="bp-stats")` returns a `No AD_Tab linked` error and CRUD calls reject the entity. Do not attempt to use it; surface the user-facing aggregate via reports instead. | Gap |
| `bp-trend` | Panel Lateral (gráfico comparativo) | **Non-functional today.** Same behaviour as `bp-stats` — listed in `etendo_neo_discover` but not backed by an `AD_Tab`, so `etendo_neo_schema` and CRUD calls return `No AD_Tab linked`. | Gap |

> The exact set of writable fields, required flags, FK selectors and process buttons on each entity is authoritative only in the live schema. Always run `etendo_neo_schema(spec="contacts", entity=<entity>)` before any `etendo_neo_create`, `etendo_neo_update` or `etendo_neo_action` call against the entity, and resolve every FK field through `etendo_neo_selectors`.

### Roles and the role-toggle pattern

The three role flags on `businessPartner` (`isCustomer`, `isVendor`, `isEmployee` — confirm the exact names in `etendo_neo_schema`) act as gates for their respective child entities:

- A BP without the customer role can still receive a `customerAccounting` row, but the customer-side defaults stored there are ignored by sales documents until the role is enabled.
- Same pattern for vendor / vendorAccounting and employee / employeeAccounting.

To switch roles, update the corresponding boolean field on `businessPartner`. Do not delete the role-specific rows when disabling a role — keep them so the configuration survives a future re-enable.

### Process buttons

Buttons on `contacts` entities are fired through `etendo_neo_action(spec="contacts", entity=<entity>, id=<id>, action=<column>)`. The complete list per entity is authoritative only in the live schema — call `etendo_neo_schema` and inspect every field with `type: "button"` and `invokeVia: "neo_action"` before firing. Pass `parameters: {}` on the first call when you do not know the parameter shape: the server's validation message reports the required keys.

### Reports

The `contacts` spec is a write spec only — it does not own any `etendo_generate_*` report tools. Customer / vendor activity, aging and turnover are surfaced through the finance and sales reports (see [Finance](../finance/index.md)).

## End-to-end usage example

This walkthrough covers the canonical agentic flow against the `contacts` spec: locate an existing business partner, attach a new contact person, add a postal address, and add a bank account. Every step uses only the generic `etendo_neo_*` tools.

The example assumes the agent has already verified connectivity (`etendo://status`) and that `etendo_neo_discover` returned `contacts` in the `specs` array.

### Step 1 — Locate the business partner

Search for the BP by name through the standard list call. If the agent does not yet have a record context, `etendo_neo_list` is the right tool — `etendo_neo_selectors` is for resolving FK fields on a target entity, not for free-form lookup of the partner itself.

```json
{
  "tool": "etendo_neo_list",
  "arguments": {
    "spec": "contacts",
    "entity": "businessPartner",
    "filters": { "name": "Acme" },
    "limit": 10,
    "orderBy": "name"
  }
}
```

If the partner does not exist, create it first with `etendo_neo_create(spec="contacts", entity="businessPartner", fields={…})`. Read the header schema with `etendo_neo_schema(spec="contacts", entity="businessPartner")` to learn the exact field set; the role flags must be set on the header even if the role-specific child rows are not created yet.

Capture the response `id` — this is the `C_BPartner_ID` and is the parent FK for every other step.

### Step 2 — Inspect the contact-person schema and create the person

```json
{
  "tool": "etendo_neo_schema",
  "arguments": { "spec": "contacts", "entity": "contact" }
}
```

The schema response is the only authoritative source of the field names, required flags, default expressions, FK selectors and the buttons available for `etendo_neo_action`. Build the create payload using only the `name` values returned by the schema.

Resolve any FK field on `contact` through `etendo_neo_selectors`. For example, if the schema declares a `businessPartner` FK on `contact`:

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "contacts",
    "entity": "contact",
    "column": "businessPartner",
    "query": "Acme"
  }
}
```

Then create the contact person:

```json
{
  "tool": "etendo_neo_create",
  "arguments": {
    "spec": "contacts",
    "entity": "contact",
    "fields": {
      "businessPartner": "<bp-id>",
      "name": "Jane Doe",
      "email": "jane.doe@acme.example",
      "phone": "+34 600 000 000"
    }
  }
}
```

The exact set of writable fields is what `etendo_neo_schema` declared — submit only fields whose `readOnly` flag is `false`. Send the role-relevant flag (for example `isSalesContact`) only if the schema lists it as a writable field.

### Step 3 — Add a postal address

```json
{
  "tool": "etendo_neo_schema",
  "arguments": { "spec": "contacts", "entity": "locationAddress" }
}
```

`locationAddress` references a location record (street, postal code, city, region, country). Inspect the schema to confirm whether the spec exposes the location fields inline or expects a pre-resolved FK to a `C_Location_ID`. Resolve every FK encountered (country, region, etc.) via `etendo_neo_selectors`:

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "contacts",
    "entity": "locationAddress",
    "column": "country",
    "query": "Spain"
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
    "recordContext": { "country": "<country-id>" }
  }
}
```

Create the address row with the usage flags the user requested (`shipTo`, `invoiceTo`, `payFrom`, `remitTo` — confirm the exact names against the schema):

```json
{
  "tool": "etendo_neo_create",
  "arguments": {
    "spec": "contacts",
    "entity": "locationAddress",
    "fields": {
      "businessPartner": "<bp-id>",
      "name": "HQ",
      "shipTo": true,
      "invoiceTo": true,
      "country": "<country-id>",
      "region": "<region-id>"
    }
  }
}
```

### Step 4 — Add a bank account

```json
{
  "tool": "etendo_neo_schema",
  "arguments": { "spec": "contacts", "entity": "bankAccount" }
}
```

Bank-account fields commonly include IBAN, SWIFT, bank, branch, account number and currency. Resolve the currency FK (and any other FK declared by the schema) before creating:

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "contacts",
    "entity": "bankAccount",
    "column": "currency",
    "query": "EUR"
  }
}
```

```json
{
  "tool": "etendo_neo_create",
  "arguments": {
    "spec": "contacts",
    "entity": "bankAccount",
    "fields": {
      "businessPartner": "<bp-id>",
      "iBAN": "ES0000000000000000000000",
      "swiftCode": "ABCDESMMXXX",
      "currency": "<currency-id>"
    }
  }
}
```

### Step 5 — (Alternative) Atomic creation across child tabs

When the contact person, the address and the bank account must commit or roll back together, replace the three independent create calls with one `etendo_neo_batch` operation. Use `parentRef` on each child op to point at the `businessPartner` op (or pass `businessPartner: "<bp-id>"` directly in each child body when the parent already exists):

```json
{
  "tool": "etendo_neo_batch",
  "arguments": {
    "operations": [
      {
        "id": "c1",
        "spec": "contacts",
        "entity": "contact",
        "body": {
          "businessPartner": "<bp-id>",
          "name": "Jane Doe",
          "email": "jane.doe@acme.example"
        }
      },
      {
        "id": "a1",
        "spec": "contacts",
        "entity": "locationAddress",
        "body": {
          "businessPartner": "<bp-id>",
          "name": "HQ",
          "shipTo": true,
          "invoiceTo": true,
          "country": "<country-id>",
          "region": "<region-id>"
        }
      },
      {
        "id": "b1",
        "spec": "contacts",
        "entity": "bankAccount",
        "body": {
          "businessPartner": "<bp-id>",
          "iBAN": "ES0000000000000000000000",
          "currency": "<currency-id>"
        }
      }
    ]
  }
}
```

A successful response carries `committed: true` and an `operations` array with the resolved `recordId` for every op. On failure the response is `committed: false` with `failedAt: { id, index }` and an `error` payload — the whole transaction was rolled back, nothing is partially written.

## Error handling

Errors from the `contacts` spec follow the generic MCP error model described in [MCP — Error handling](../mcp/index.md#error-handling). The points specific to contacts workflows are:

| Symptom | Likely cause | Resolution |
|---------|--------------|------------|
| `etendo_neo_schema(spec="contacts", entity="bp-stats" \| "bp-trend")` returns `No AD_Tab linked` | These two entities are listed by `etendo_neo_discover` but are not backed by an `AD_Tab` in the current Etendo Go release. They are a known gap, not a configuration error. | Do not use `bp-stats` / `bp-trend`. Source the side-panel totals from the finance reports or from `etendo_neo_list` queries against the sales / purchase invoice specs. |
| `etendo_neo_create` on `customer` / `vendorCreditor` / `employee` succeeds but the role-specific defaults are not applied to new documents | The role flag on the parent `businessPartner` is still off | `etendo_neo_update(spec="contacts", entity="businessPartner", id=<bp-id>, fields={ "isCustomer": true, … })` to enable the role |
| `etendo_neo_create` on `contact` / `locationAddress` / `bankAccount` rejects the call as missing the parent FK | The `businessPartner` FK was omitted or was wrong | Re-read the schema to confirm the exact FK name; pass the value from step 1 — never invent a BP ID |
| `etendo_neo_selectors` for `country`, `region`, `currency`, `language` returns no rows | The current organisation does not have that reference configured (or the role lacks access) | Confirm the reference exists in the Etendo UI or via `etendo_neo_list` against the relevant spec before retrying |
| `etendo_neo_create` on `bankAccount` succeeds but the IBAN check digit is rejected on save | The submitted IBAN failed Etendo's modulo-97 validation | Re-validate the IBAN before sending; surface the server message verbatim to the user |
| `etendo_neo_action` on a button declared by `etendo_neo_schema` returns `processResult: "error"` | The underlying Etendo process raised a validation, state-machine or business-rule error | Read `processMessage` verbatim; do not retry blindly |

Enum codes for `list`-typed fields on `contacts` entities (BP type, salutation, credit status, etc.) are intentionally not enumerated here — they are role / module dependent. Resolve them at runtime from the field metadata returned by `etendo_neo_schema`, or by inspecting existing records via `etendo_neo_list`.
