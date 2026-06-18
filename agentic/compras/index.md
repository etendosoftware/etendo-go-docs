# Purchases (Compras) — Agentic Documentation

## Overview

This topic covers the five Etendo Go MCP specs that compose the purchase-to-pay cycle:

- `purchase-order` — supplier orders (table `C_Order` with `IsSOTrx = 'N'`).
- `goods-receipt` — incoming material receipts (table `M_InOut` with `MovementType = 'V+'`).
- `purchase-invoice` — supplier invoices and credit memos (table `C_Invoice` with `IsSOTrx = 'N'`).
- `return-to-vendor` — orders that return material to a supplier (table `C_Order`, doc category `RTV`).
- `return-material-receipt` — outgoing shipments tied to a return-to-vendor (table `M_InOut`, doc category `RTV`).

All five specs are exposed through the same generic tools described in [../mcp/index.md](../mcp/index.md): `etendo_neo_discover`, `etendo_neo_schema`, `etendo_neo_defaults`, `etendo_neo_selectors`, `etendo_neo_list`, `etendo_neo_get`, `etendo_neo_create`, `etendo_neo_update`, `etendo_neo_delete`, `etendo_neo_action`, and `etendo_neo_batch`. An agent operating purchases never calls REST endpoints or the Etendo UI — every action goes through these tools.

This page is the entry point. The two detail pages cover the most common flows end-to-end:

- [pedidos-de-compra.md](./pedidos-de-compra.md) — purchase orders: create, complete, receive, cancel.
- [facturas-de-compra.md](./facturas-de-compra.md) — purchase invoices: create from scratch, from an order, from a receipt, then complete and post.

## Prerequisites

- The Etendo Go MCP server is configured and reachable (see [../mcp/index.md](../mcp/index.md)).
- The API user has a role that grants access to **at least** the purchase windows in NEO Headless. Verify with `etendo_neo_discover` — the response must include `purchase-order`, `purchase-invoice`, `goods-receipt`, `return-to-vendor`, and `return-material-receipt`.
- There exists at least one active vendor business partner, one purchase price list, one purchase payment terms record, one warehouse, and the standard document types **Purchase Order**, **AP Invoice**, **AP CreditMemo**, **MM Receipt**, **MM Shipment**, and **Return to Vendor**. Without these records most `etendo_neo_create` calls fail with a required-FK validation message.
- The agent has read the [../agent-manual.md](../agent-manual.md) operating rules. The safety rules there apply verbatim: do not auto-confirm, do not auto-post, do not invent IDs.

## Configuration

No configuration is needed beyond the MCP server credentials. The five purchase specs are exposed by default to any role with access to the matching NEO Headless windows. To check what the current role can see:

```json
{ "tool": "etendo_neo_discover", "arguments": {} }
```

Confirm the response includes the five spec entries before any other call.

## Available capabilities

### Specs and entities

| Spec | Backing table | Main entities (verified via `etendo_neo_discover`) |
|------|---------------|----------------------------------------------------|
| `purchase-order` | `C_Order` (`IsSOTrx='N'`) | `header`, `lines`, `lineTax`, `intrastat`, `reservedStock`, `basicDiscounts`, `tax`, `paymentPlan`, `paymentDetails` |
| `purchase-invoice` | `C_Invoice` (`IsSOTrx='N'`) | `header`, `lines`, `lineTax`, `intrastat`, `tax`, `basicDiscounts`, `cashVat`, `paymentPlan`, `paymentDetails`, `reversedInvoices`, `exchangeRates`, `accounting`, `siiData`, `batuz` |
| `goods-receipt` | `M_InOut` (`MovementType='V+'`) | `goodsReceipt`, `goodsReceiptLine`, `intrastat`, `accounting`, `landedCost` |
| `return-to-vendor` | `C_Order` (`DocCategory='RTV'`) | `header`, `lines`, `lineTax`, `basicDiscounts`, `tax`, `paymentOutPlan`, `paymentOutDetails` |
| `return-material-receipt` | `M_InOut` (`DocCategory='RTV'`) | `returnMaterialReceipt`, `returnMaterialReceiptLine`, `accounting` |
| `return-to-vendor-shipment` | `M_InOut` (legacy) | `returnToVendorShipment`, `returnToVendorShipmentLine` |

### Buttons (process actions) on purchase headers

All buttons listed below are declared in the entity schema with `type:"button"` and `invokeVia:"neo_action"`. Fire them with `etendo_neo_action` using the `action` value below.

| Spec/entity | Action (column) | What it does |
|-------------|-----------------|--------------|
| `purchase-order/header` | `DocAction` | Process the order (parameters: `{"docAction":"CO"}` to complete, `"VO"` to void, `"RE"` to reactivate). Underlying process `Process Order` (id `104`). |
| `purchase-order/header` | `Posted` | Post the order to the general ledger. |
| `purchase-order/header` | `CopyFrom` | Copy lines from another order (classic process `Copy Lines`, id `211`). |
| `purchase-order/header` | `CopyFromPO` | Copy from one or more orders (process `Copy from Orders`, id `8B81D80B06364566B87853FEECAB5DE0`). |
| `purchase-order/header` | `Generatetemplate` | Copy lines from a product template (process id `800022`). |
| `purchase-order/header` | `RM_CreateInvoice` | Generate the AP invoice from the order (process `Create Invoice`, id `FF80808133362F6A013336781FCE0066`). |
| `purchase-order/header` | `RM_Pickfromreceipt` | Pick lines from existing goods receipts (process id `A2C19D0EF6594D14A64BC62E99A89CC3`). |
| `purchase-order/header` | `EM_APRM_AddPayment` | Open the Add Payment flow (process id `9BED7889E1034FE68BD85D5D16857320`). |
| `purchase-invoice/header` | `DocAction` | Process the invoice (parameters: `{"docAction":"CO"}` to complete). Underlying process `Process Invoice` (id `111`). |
| `purchase-invoice/header` | `Posted` | Post the invoice. |
| `purchase-invoice/header` | `Createfromorders` | Create invoice lines from an existing purchase order (process id `AB2EFCAABB7B4EC0A9B30CFB82963FB6`). |
| `purchase-invoice/header` | `Createfrominouts` | Create invoice lines from one or more goods receipts (process id `7737CA7330FD49FBA7EBC225E85F2BC9`). |
| `purchase-invoice/header` | `GenerateTo` | Generate the matching receipt from the invoice (process `Generate Receipt from Invoice`, id `142`). |
| `purchase-invoice/header` | `EM_APRM_Addpayment` | Open Add Payment for the invoice. |
| `goods-receipt/goodsReceipt` | `DocAction` | Process the receipt (`{"docAction":"CO"}` to complete). Underlying process `Process Shipment` (id `109`). |
| `goods-receipt/goodsReceipt` | `Posted` | Post the receipt. |
| `goods-receipt/goodsReceipt` | `RM_Receipt_PickEdit` | Open the receipt pick-and-edit picker (process id `5E9F9D7EECC24E4FBB2C60840FF613BE`). |
| `goods-receipt/goodsReceipt` | `Invoicefromshipment` | Generate the AP invoice from the receipt (process id `62250E8866EA4D96A66C309878DC039E`). |
| `goods-receipt/goodsReceipt` | `GenerateTo` | Generate the AP invoice (`Generate Invoice from Receipt`, id `154`). |
| `return-to-vendor/header` | `DocAction` | Process the return order, same shape as `purchase-order/header`. |
| `return-to-vendor/header` | `RM_PickFromShipment` | Pick the lines to return from existing shipments (process id `A2C19D0EF6594D14A64BC62E99A89CC3`). |
| `return-to-vendor/header` | `RM_CreateInvoice` | Generate the AP credit memo. |
| `return-material-receipt/returnMaterialReceipt` | `DocAction` | Process the return shipment (`Process Shipment`, id `109`). |
| `return-material-receipt/returnMaterialReceipt` | `RM_Shipment_Pickedit` | Open the shipment pick-and-edit picker (process id `4AD70293357245AB96E59C2CDB43A35D`). |

Schemas also declare buttons for tax-compliance side-effects (`EM_Tbai_*`, `EM_Aeatsii_*`, `EM_Etvfac_*`). These fire only when the corresponding Spanish/Basque tax module is installed. Inspect the live `etendo_neo_schema` response if your instance must produce TicketBAI / VeriFactu / SII payloads.

### Document statuses

The `documentStatus` column on each header is an enumerated list. The values an agent typically branches on:

| Code | Meaning | When it applies |
|------|---------|-----------------|
| `DR` | Draft | Default after `etendo_neo_create`. The record is editable and not yet committed to inventory or accounting. |
| `IP` | In Progress | Transient state during processing — usually not observed by the agent. |
| `CO` | Completed | Final state after `etendo_neo_action(action="DocAction", parameters={"docAction":"CO"})` succeeded. Inventory and AP balances have moved. |
| `VO` | Voided | Reached via `{"docAction":"VO"}`. The document is permanently cancelled. |
| `RE` | Reactivated | A `CO` document was rolled back via `{"docAction":"RE"}` and is editable again. |

`Posted` (column on the header) is a separate button — the document must be `CO` before it can be posted.

## End-to-end usage example

**Goal**: Create a purchase order for an existing vendor, complete it, generate the matching goods receipt, complete the receipt, generate the AP invoice from the receipt, and post.

The example uses only verified MCP tools. Replace every `<...>` placeholder with values returned by previous calls — never invent IDs.

### Step 1 — Discover and inspect

```json
{ "tool": "etendo_neo_discover", "arguments": {} }
{ "tool": "etendo_neo_schema", "arguments": { "spec": "purchase-order", "entity": "header" } }
{ "tool": "etendo_neo_schema", "arguments": { "spec": "purchase-order", "entity": "lines" } }
{ "tool": "etendo_neo_schema", "arguments": { "spec": "goods-receipt", "entity": "goodsReceipt" } }
{ "tool": "etendo_neo_schema", "arguments": { "spec": "purchase-invoice", "entity": "header" } }
```

Confirm the required-writable header fields for `purchase-order`: `transactionDocument`, `businessPartner`, `partnerAddress`, `invoiceAddress`, `priceList`, `paymentTerms`, `warehouse`, `currency`, `orderDate`, `scheduledDeliveryDate`, `accountingDate`. The remaining required fields have a server-side `defaultExpression` and may be omitted (the default values are surfaced by `etendo_neo_defaults`).

### Step 2 — Resolve vendor and dependent FKs

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "purchase-order",
    "entity": "header",
    "column": "businessPartner",
    "query": "<vendor-name-fragment>"
  }
}
```

Then resolve the addresses, payment terms, price list, warehouse, and currency:

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "purchase-order",
    "entity": "header",
    "column": "partnerAddress",
    "recordContext": { "businessPartner": "<vendor-id>" }
  }
}
```

For `transactionDocument`, prefer `etendo_neo_defaults` over `etendo_neo_selectors`. The defaults call already returns the correct purchase document type for the current organisation (verified output includes `transactionDocument: "<doctype-id>"` with `_identifier: "Purchase Order"`).

### Step 3 — Create the order header

```json
{
  "tool": "etendo_neo_create",
  "arguments": {
    "spec": "purchase-order",
    "entity": "header",
    "fields": {
      "businessPartner": "<vendor-id>",
      "partnerAddress": "<vendor-address-id>",
      "invoiceAddress": "<vendor-invoice-address-id>",
      "priceList": "<purchase-price-list-id>",
      "paymentTerms": "<payment-terms-id>",
      "warehouse": "<warehouse-id>",
      "currency": "<currency-id>",
      "orderDate": "2026-06-18",
      "scheduledDeliveryDate": "2026-06-20",
      "accountingDate": "2026-06-18"
    }
  }
}
```

The response contains the new `id` (column `C_Order_ID`), the auto-generated `documentNo`, and `documentStatus: "DR"`. Capture the `id` for downstream calls.

### Step 4 — Add a line

Resolve the product and tax selectors:

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "purchase-order",
    "entity": "lines",
    "column": "product",
    "query": "<product-name-fragment>"
  }
}
```

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "purchase-order",
    "entity": "lines",
    "column": "tax",
    "parentContext": {
      "businessPartner": "<vendor-id>",
      "orderDate": "2026-06-18",
      "priceList": "<purchase-price-list-id>"
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
      "salesOrder": "<purchase-order-id>",
      "product": "<product-id>",
      "orderedQuantity": 10,
      "unitPrice": 12.50,
      "tax": "<tax-id>"
    }
  }
}
```

`salesOrder` is the parent FK (column `C_Order_ID`) — the entity is shared with sales orders and the field name reflects that. The schema marks it as the parent FK for `purchase-order/lines`.

### Step 5 — Complete the order

Only after the user has authorised confirmation in the current session:

```json
{
  "tool": "etendo_neo_action",
  "arguments": {
    "spec": "purchase-order",
    "entity": "header",
    "id": "<purchase-order-id>",
    "action": "DocAction",
    "parameters": { "docAction": "CO" }
  }
}
```

Branch on `processResult`. On `success` the header transitions to `documentStatus: "CO"` and inventory expectations are recorded.

### Step 6 — Create the goods receipt

The simplest path is to fire `RM_ReceiveMaterials` on the order, which opens the Pick-and-Edit picker in the UI. For an MCP-only agent, the equivalent is to create a `goods-receipt/goodsReceipt` header with the same vendor, then add receipt lines that reference the order lines.

Read the receipt defaults:

```json
{ "tool": "etendo_neo_defaults", "arguments": { "spec": "goods-receipt", "entity": "goodsReceipt" } }
```

The `documentType` default resolves to the **MM Receipt** record (verified label: `MM Receipt`). Create the header:

```json
{
  "tool": "etendo_neo_create",
  "arguments": {
    "spec": "goods-receipt",
    "entity": "goodsReceipt",
    "fields": {
      "businessPartner": "<vendor-id>",
      "partnerAddress": "<vendor-address-id>",
      "warehouse": "<warehouse-id>",
      "salesOrder": "<purchase-order-id>",
      "movementDate": "2026-06-20",
      "accountingDate": "2026-06-20"
    }
  }
}
```

Then add a receipt line that references the order line through `salesOrderLine`:

```json
{
  "tool": "etendo_neo_create",
  "arguments": {
    "spec": "goods-receipt",
    "entity": "goodsReceiptLine",
    "fields": {
      "shipmentReceipt": "<goods-receipt-id>",
      "product": "<product-id>",
      "salesOrderLine": "<order-line-id>",
      "movementQuantity": 10,
      "uOM": "<uom-id>"
    }
  }
}
```

Complete the receipt with `DocAction`:

```json
{
  "tool": "etendo_neo_action",
  "arguments": {
    "spec": "goods-receipt",
    "entity": "goodsReceipt",
    "id": "<goods-receipt-id>",
    "action": "DocAction",
    "parameters": { "docAction": "CO" }
  }
}
```

### Step 7 — Generate and complete the AP invoice from the receipt

Fire `GenerateTo` (alias for the classic `Generate Invoice from Receipt` process, id `154`) on the completed receipt:

```json
{
  "tool": "etendo_neo_action",
  "arguments": {
    "spec": "goods-receipt",
    "entity": "goodsReceipt",
    "id": "<goods-receipt-id>",
    "action": "GenerateTo"
  }
}
```

`processResult: "success"` plus a `processMessage` that contains the new invoice's `documentNo`. Locate the freshly created invoice with `etendo_neo_list`:

```json
{
  "tool": "etendo_neo_list",
  "arguments": {
    "spec": "purchase-invoice",
    "entity": "header",
    "filters": { "businessPartner": "<vendor-id>" },
    "orderBy": "-invoiceDate",
    "limit": 5
  }
}
```

The returned record exposes `id` (column `C_Invoice_ID`) and `documentStatus`. If the process left it in `DR`, complete it:

```json
{
  "tool": "etendo_neo_action",
  "arguments": {
    "spec": "purchase-invoice",
    "entity": "header",
    "id": "<invoice-id>",
    "action": "DocAction",
    "parameters": { "docAction": "CO" }
  }
}
```

### Step 8 — Post the invoice

```json
{
  "tool": "etendo_neo_action",
  "arguments": {
    "spec": "purchase-invoice",
    "entity": "header",
    "id": "<invoice-id>",
    "action": "Posted"
  }
}
```

A `processResult: "success"` response confirms the journal entries were written. Report the invoice `id`, `documentNo`, and `grandTotalAmount` back to the user.

### Atomic variant — `etendo_neo_batch`

When header and lines must commit together, replace steps 3 and 4 with a single `etendo_neo_batch` call:

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

`parentRef: "po"` makes the batch wire the new line's `salesOrder` FK to the new header. The whole batch rolls back if any op fails.

## Error handling

The shapes below were verified against the live MCP server while writing this guide. Add to the table only after observing a new failure mode in practice.

| Symptom | Likely cause | Resolution |
|---------|--------------|------------|
| `etendo_neo_create` on `purchase-order/header` rejects with a `businessPartner` validation error | The supplied `businessPartner` ID is a customer-only BP (no `isVendor=Y`), or it does not exist | Re-resolve via `etendo_neo_selectors` and confirm the BP shows up for `purchase-order/header.businessPartner` — that selector filters vendors only |
| Header creation succeeds but `summedLineAmount` and `grandTotalAmount` stay at `0` | Lines were not created or the line `unitPrice` × `orderedQuantity` produced a zero net | Run `etendo_neo_list` on `purchase-order/lines` with `filters: { "salesOrder": "<header-id>" }` and verify each line's `lineNetAmount` |
| `etendo_neo_action(DocAction, {"docAction":"CO"})` returns `processResult: "error"` with `processMessage` mentioning *"@OrderHasNoLines@"* | The order has no lines | Add at least one line via `etendo_neo_create` on `purchase-order/lines` before retrying |
| `etendo_neo_action(DocAction, {"docAction":"CO"})` returns `processResult: "error"` with `processMessage` mentioning *period closed* or *period not open* | The `accountingDate` falls in a closed accounting period | Update the header's `accountingDate` via `etendo_neo_update` to a date in an open period |
| `goods-receipt` creation succeeds but `etendo_neo_action(GenerateTo)` returns `error` | The receipt is in `DR`; the invoice generator requires `CO` | Complete the receipt first (`DocAction` with `{"docAction":"CO"}`) before firing `GenerateTo` |
| `etendo_neo_action(Posted)` returns `processResult: "error"` with *"document not completed"* | Posting a `DR` document is not allowed | Complete it first with `DocAction` `CO` |
| Selector `transactionDocument` returns `0` items | The selector for `purchase-order/header.transactionDocument` filters by document category server-side and may not match free-text queries | Call `etendo_neo_defaults` instead — the returned `transactionDocument` is the correct value for the current organisation and role |

See [../mcp/index.md#error-handling](../mcp/index.md#error-handling) and [../agent-manual.md#error-handling](../agent-manual.md#error-handling) for the generic error matrix that applies to every spec.
