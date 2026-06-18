# Purchase Orders (Pedidos de compra)

## Overview

Operate the `purchase-order` spec from MCP: discover the entities, build the header, attach lines, complete or void the document, and react to errors. The spec backs the **Purchase Order** window in Etendo Go and writes to the `C_Order` table with `IsSOTrx = 'N'`.

This page is normative for an agent: every section maps directly to MCP tool calls. The sibling page [pedidos-de-compra](./pedidos-de-compra.md) is the canonical reference for that flow; [facturas-de-compra.md](./facturas-de-compra.md) covers the invoice that usually follows.

## Prerequisites

- The MCP server is reachable (`etendo_neo_discover` returns `purchase-order` in the `specs` array).
- The role has `GET`, `POST`, `PUT`, `DELETE` on `purchase-order/header` and `purchase-order/lines`. These are the methods advertised by `etendo_neo_discover`.
- At least one vendor business partner, one purchase price list, one purchase payment terms record, one warehouse, and the **Purchase Order** document type exist.

## Configuration

No spec-specific configuration. Run a connectivity probe before the first call:

```json
{ "tool": "etendo_neo_discover", "arguments": {} }
```

and inspect the schema once per session:

```json
{ "tool": "etendo_neo_schema", "arguments": { "spec": "purchase-order", "entity": "header" } }
{ "tool": "etendo_neo_schema", "arguments": { "spec": "purchase-order", "entity": "lines" } }
```

## Available capabilities

### Entities on `purchase-order`

| Entity | Backing table | Purpose |
|--------|---------------|---------|
| `header` | `C_Order` | The order document (1 record per order). |
| `lines` | `C_OrderLine` | Order lines. Parent FK column: `salesOrder` (DB `C_Order_ID`). |
| `lineTax` | `C_OrderLineTax` | Per-line tax breakdown (read-mostly; populated by the order processor). |
| `tax` | `C_OrderTax` | Header-level tax aggregation. |
| `intrastat` | (intra-EU statistical declaration tab) | Intrastat tab. |
| `reservedStock` | `M_Reservation` | Reservations created from order lines. |
| `basicDiscounts` | (header discount tab) | Basic discount tab. |
| `paymentPlan` | `FIN_Payment_Schedule` | Scheduled payment instalments. |
| `paymentDetails` | `FIN_Payment_ScheduleDetail` | Settled payment details. |

### Required writable fields on `purchase-order/header`

Source: `etendo_neo_schema(spec="purchase-order", entity="header")`. The list shows fields with `required: true` and `readOnly: false`. Fields with a `defaultExpression` are auto-filled by the server and may be omitted; the rest must be supplied by the agent.

| Field (JSON name) | DB column | Type | Default | Notes |
|-------------------|-----------|------|---------|-------|
| `transactionDocument` | `C_DocTypeTarget_ID` | foreignKey | (selector) | Document type that determines the spec — must resolve to **Purchase Order** for this spec. Prefer `etendo_neo_defaults` over `etendo_neo_selectors` (the selector filters server-side and may return empty). |
| `businessPartner` | `C_BPartner_ID` | foreignKey | — | Vendor BP. Use `etendo_neo_selectors` with a `query`. |
| `partnerAddress` | `C_BPartner_Location_ID` | foreignKey | — | Vendor delivery address. Depends on `businessPartner` — pass `recordContext: { "businessPartner": "<id>" }`. |
| `invoiceAddress` | `BillTo_ID` | foreignKey | — | Vendor invoice address. Same dependency. |
| `priceList` | `M_PriceList_ID` | foreignKey | — | Purchase price list. |
| `paymentTerms` | `C_PaymentTerm_ID` | foreignKey | — | Payment terms. |
| `warehouse` | `M_Warehouse_ID` | foreignKey | — | Destination warehouse. |
| `currency` | `C_Currency_ID` | foreignKey | `@C_Currency_ID@` | Usually defaulted from the client; override only when the order is in a non-default currency. |
| `orderDate` | `DateOrdered` | date | `@#Date@` | ISO date. |
| `scheduledDeliveryDate` | `DatePromised` | date | `@#Date@` | ISO date. |
| `accountingDate` | `DateAcct` | date | `@#Date@` | Must fall in an open accounting period. |
| `invoiceTerms` | `InvoiceRule` | list | `D` | Defaulted; omit unless the agent must override. |
| `deliveryTerms` | `DeliveryRule` | list | `A` | Defaulted; omit unless overriding. |
| `deliveryMethod` | `DeliveryViaRule` | list | `P` | Defaulted; omit unless overriding. |
| `freightCostRule` | `FreightCostRule` | list | `I` | Defaulted. |
| `formOfPayment` | `PaymentRule` | list | `B` | Defaulted. |
| `priority` | `PriorityRule` | list | `5` | Defaulted. |
| `cashVAT` | `Iscashvat` | boolean | `N` | Defaulted. |
| `salesTransaction` | `IsSOTrx` | boolean | `@IsSOTrx@` | Must be `false` for a purchase order. The spec sets this server-side; do not send. |

Read-only fields (omit from `etendo_neo_create`): `id` (`C_Order_ID`), `documentNo` (`DocumentNo`). They are returned in the create response.

### Required writable fields on `purchase-order/lines`

| Field (JSON name) | DB column | Type | Default | Notes |
|-------------------|-----------|------|---------|-------|
| `salesOrder` | `C_Order_ID` | foreignKey | — | Parent FK. Use the `id` from the header `etendo_neo_create` response, or `parentRef` in `etendo_neo_batch`. |
| `product` | `M_Product_ID` | foreignKey | — | The line's product. |
| `orderedQuantity` | `QtyOrdered` | number | `1` | Quantity in the line UOM. |
| `unitPrice` | `PriceActual` | number | — | Net unit price (the price the order pays). |
| `tax` | `C_Tax_ID` | foreignKey | — | Line tax. Depends on header context — pass `parentContext: { "businessPartner": ..., "orderDate": ..., "priceList": ... }`. |
| `uOM` | `C_UOM_ID` | foreignKey | — | Auto-derived from the product when omitted, but the schema marks it as required. |
| `warehouse` | `M_Warehouse_ID` | foreignKey | `@M_Warehouse_ID@` | Defaulted from the header. |

### Buttons (actions on `purchase-order/header`)

Fire with `etendo_neo_action`. The full list lives in `etendo_neo_schema`. The actions used by an agent most often:

| Action | What it does | `parameters` |
|--------|--------------|--------------|
| `DocAction` | Process the order: complete (`CO`), void (`VO`), reactivate (`RE`). | `{ "docAction": "<CO|VO|RE>" }` |
| `Posted` | Post the completed order to accounting. | — |
| `CopyFrom` | Copy lines from another order (classic process id `211`). | — |
| `CopyFromPO` | Copy from one or more existing orders. | — |
| `Generatetemplate` | Copy lines from a product template (process id `800022`). | — |
| `RM_CreateInvoice` | Create the AP invoice from the order. | — |
| `RM_Pickfromreceipt` | Pick lines from an existing goods receipt. | — |
| `EM_APRM_AddPayment` | Open Add Payment for the order. | — |

## End-to-end usage example

**Goal**: Create a purchase order for vendor `Blanquiceleste S.A.` of 10 units of `Queso Sardo` at 12.50 EUR each, then complete it.

The IDs below come from a real instance and are shown to make the example concrete; the agent **must** re-resolve every ID through `etendo_neo_selectors` or `etendo_neo_list` against its own environment before executing the calls.

### Step 1 — Resolve the vendor

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "purchase-order",
    "entity": "header",
    "column": "businessPartner",
    "query": "Blanqui"
  }
}
```

Sample verified response:

```json
{
  "items": [
    { "id": "BC8DDDF69DDA49E9938729F19B0F330E", "label": "Blanquiceleste S.A." }
  ],
  "totalCount": 1,
  "hasMore": false
}
```

### Step 2 — Resolve dependent addresses

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "purchase-order",
    "entity": "header",
    "column": "partnerAddress",
    "recordContext": { "businessPartner": "BC8DDDF69DDA49E9938729F19B0F330E" }
  }
}
```

Sample verified response:

```json
{
  "items": [
    { "id": "0BC94169F59444C1828693147CF067FA", "label": "Riva" },
    { "id": "4380CC6D925841E99BB516C78E7717CF", "label": "Victor Blanco 23" }
  ],
  "totalCount": 2,
  "hasMore": false
}
```

Repeat with `column: "invoiceAddress"` and the same `recordContext` to obtain the billing address ID.

### Step 3 — Inspect defaults

```json
{ "tool": "etendo_neo_defaults", "arguments": { "spec": "purchase-order", "entity": "header" } }
```

The verified response on a sample instance returns, among others:

```json
{
  "transactionDocument": "808F8818F724497D94282AC83493F394",
  "transactionDocument$_identifier": "Purchase Order",
  "paymentTerms": "2113A0179D5946D4A339704961E653FF",
  "paymentTerms$_identifier": "30 Días",
  "priceList": "F888E6AAB93E44E88433C21A8F3C0161",
  "priceList$_identifier": "Lista de compra (sin impuestos)",
  "currency": "102",
  "currency$_identifier": "EUR",
  "paymentMethod": "EA00223235264DB78D44D9A47B87E808",
  "paymentMethod$_identifier": "Efectivo",
  "documentNo": "<1000040>"
}
```

Reuse those IDs in the next call (or resolve them yourself via selectors).

### Step 4 — Create the header

```json
{
  "tool": "etendo_neo_create",
  "arguments": {
    "spec": "purchase-order",
    "entity": "header",
    "fields": {
      "businessPartner": "BC8DDDF69DDA49E9938729F19B0F330E",
      "partnerAddress": "4380CC6D925841E99BB516C78E7717CF",
      "invoiceAddress": "4380CC6D925841E99BB516C78E7717CF",
      "priceList": "F888E6AAB93E44E88433C21A8F3C0161",
      "paymentTerms": "2113A0179D5946D4A339704961E653FF",
      "warehouse": "1FF18B068AA94146A2A49C51E13C739C",
      "currency": "102",
      "transactionDocument": "808F8818F724497D94282AC83493F394",
      "orderDate": "2026-06-18",
      "scheduledDeliveryDate": "2026-06-20",
      "accountingDate": "2026-06-18"
    }
  }
}
```

The response carries the new `id` (assign it to `<order-id>`), the auto-generated `documentNo`, and `documentStatus: "DR"`.

### Step 5 — Add a line

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "purchase-order",
    "entity": "lines",
    "column": "product",
    "query": "Queso"
  }
}
```

Then resolve the line tax using the header context:

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "purchase-order",
    "entity": "lines",
    "column": "tax",
    "parentContext": {
      "businessPartner": "BC8DDDF69DDA49E9938729F19B0F330E",
      "orderDate": "2026-06-18",
      "priceList": "F888E6AAB93E44E88433C21A8F3C0161"
    }
  }
}
```

Create the line:

```json
{
  "tool": "etendo_neo_create",
  "arguments": {
    "spec": "purchase-order",
    "entity": "lines",
    "fields": {
      "salesOrder": "<order-id>",
      "product": "<product-id>",
      "orderedQuantity": 10,
      "unitPrice": 12.50,
      "tax": "<tax-id>"
    }
  }
}
```

### Step 6 — Complete

```json
{
  "tool": "etendo_neo_action",
  "arguments": {
    "spec": "purchase-order",
    "entity": "header",
    "id": "<order-id>",
    "action": "DocAction",
    "parameters": { "docAction": "CO" }
  }
}
```

On `processResult: "success"` the order moves to `documentStatus: "CO"` and `processed: true`. Report `id`, `documentNo`, and `grandTotalAmount` to the user.

### Common follow-up flows

- **Void the order**: same `DocAction` call with `{"docAction":"VO"}`. Allowed only while no receipt or invoice has consumed the lines.
- **Reactivate**: `{"docAction":"RE"}` reopens a `CO` order. Lines become editable again; reservations are cancelled.
- **Generate AP invoice directly**: fire `RM_CreateInvoice`. The response carries the new invoice's `documentNo` in `processMessage`. Locate the record with `etendo_neo_list` on `purchase-invoice/header` filtered by vendor and date.
- **List vendor orders**: `etendo_neo_list` on `purchase-order/header` with `filters: { "businessPartner": "<vendor-id>" }` and `orderBy: "-orderDate"`.
- **Update header (still draft)**: `etendo_neo_update` with only the fields to change. The server rejects updates on `CO` documents — reactivate first.

### Atomic creation with `etendo_neo_batch`

```json
{
  "tool": "etendo_neo_batch",
  "arguments": {
    "operations": [
      {
        "id": "po",
        "spec": "purchase-order",
        "entity": "header",
        "body": {
          "businessPartner": "<vendor-id>",
          "partnerAddress": "<vendor-address-id>",
          "invoiceAddress": "<vendor-invoice-address-id>",
          "priceList": "<purchase-price-list-id>",
          "paymentTerms": "<payment-terms-id>",
          "warehouse": "<warehouse-id>",
          "currency": "<currency-id>",
          "transactionDocument": "<purchase-order-doctype-id>",
          "orderDate": "2026-06-18",
          "scheduledDeliveryDate": "2026-06-20",
          "accountingDate": "2026-06-18"
        }
      },
      {
        "id": "pol",
        "spec": "purchase-order",
        "entity": "lines",
        "parentRef": "po",
        "body": {
          "product": "<product-id>",
          "orderedQuantity": 10,
          "unitPrice": 12.50,
          "tax": "<tax-id>"
        }
      }
    ]
  }
}
```

On success: `committed: true` and `operations[].recordId` for both ops. Fire `DocAction` on the header next.

## Error handling

| Symptom | Likely cause | Resolution |
|---------|--------------|------------|
| `etendo_neo_create` rejects with *"Required field: transactionDocument"* | The document type is missing or the resolved ID belongs to a different category (e.g. Sales Order) | Run `etendo_neo_defaults` and use the returned `transactionDocument` — it is filtered by category and organisation |
| `etendo_neo_selectors` for `businessPartner` returns vendors that look like customers | The selector for `purchase-order/header.businessPartner` server-side filters by `isVendor='Y'`. If a BP appears it *is* a vendor. If the agent picked one that does not behave like a vendor downstream, re-read the BP record via `etendo_neo_get` on `contacts/vendorCreditor` | — |
| `etendo_neo_create` on `lines` rejects with *"Tax not found"* | The `tax` ID does not match the header context (BP + date + price list) | Re-resolve `tax` with the correct `parentContext` |
| `DocAction` (`CO`) returns `processResult: "error"` with *@OrderHasNoLines@* | No lines created yet | Create at least one line before completing |
| `DocAction` (`CO`) returns `processResult: "error"` with a period-related message | `accountingDate` falls in a closed period | `etendo_neo_update` the header with a date in an open period, then retry |
| `DocAction` (`VO`) returns `error` mentioning *"Cannot void"* | A goods receipt or invoice has consumed the lines | Reverse the downstream document(s) first, then re-attempt |
| `etendo_neo_update` returns `error` on a `CO` header | Completed orders are read-only | Fire `DocAction` `RE` to reactivate, update, then complete again |

Generic error rules from [../mcp/index.md#error-handling](../mcp/index.md#error-handling) and [../agent-manual.md#error-handling](../agent-manual.md#error-handling) also apply.
