# Purchase Invoices (Facturas de compra)

## Overview

Operate the `purchase-invoice` spec from MCP. The spec backs the **Purchase Invoice** window and writes to `C_Invoice` with `IsSOTrx = 'N'`. Three creation paths are supported by the underlying processes:

1. **Standalone** — build the header + lines manually.
2. **From a purchase order** — fire `Createfromorders` (Create Lines From Order, process id `AB2EFCAABB7B4EC0A9B30CFB82963FB6`).
3. **From a goods receipt** — fire `Createfrominouts` (Create Lines From Shipment/Receipt, process id `7737CA7330FD49FBA7EBC225E85F2BC9`), or generate the invoice directly from the receipt with `goods-receipt/goodsReceipt.GenerateTo`.

This page covers all three. The companion page [pedidos-de-compra.md](./pedidos-de-compra.md) covers the order side.

## Prerequisites

- `etendo_neo_discover` returns `purchase-invoice` in the `specs` array.
- The role has `GET`, `POST`, `PUT`, `DELETE` on `purchase-invoice/header` and `purchase-invoice/lines`.
- At least one of the **AP Invoice**, **AP CreditMemo**, or **Reversed Purchase Invoice** document types exists in the instance. Verified via:

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "purchase-invoice",
    "entity": "header",
    "column": "transactionDocument"
  }
}
```

Sample verified response:

```json
{
  "items": [
    { "id": "42B7DE94BC324C3F9CC0934375E90FFF", "label": "AP CreditMemo" },
    { "id": "5C6E02993E9B4FCA81C07955EF676C62", "label": "AP Invoice" },
    { "id": "AFFD4594FB734E9682D5769669A9D471", "label": "Reversed Purchase Invoice" }
  ],
  "totalCount": 3,
  "hasMore": false
}
```

## Configuration

No spec-specific configuration. Inspect the schema once per session:

```json
{ "tool": "etendo_neo_schema", "arguments": { "spec": "purchase-invoice", "entity": "header" } }
{ "tool": "etendo_neo_schema", "arguments": { "spec": "purchase-invoice", "entity": "lines" } }
```

## Available capabilities

### Entities on `purchase-invoice`

| Entity | Backing table | Purpose |
|--------|---------------|---------|
| `header` | `C_Invoice` | The invoice document. |
| `lines` | `C_InvoiceLine` | Invoice lines. Parent FK column: `invoice` (DB `C_Invoice_ID`). |
| `lineTax` | `C_InvoiceLineTax` | Per-line tax breakdown (populated by the invoice processor). |
| `tax` | `C_InvoiceTax` | Header-level tax aggregation. |
| `intrastat` | (intra-EU declaration tab) | Intrastat reporting. |
| `basicDiscounts` | (header discount tab) | Basic discount tab. |
| `cashVat` | `C_Invoice_CashVAT` | Cash-VAT regime detail. |
| `paymentPlan` | `FIN_Payment_Schedule` | Scheduled instalments. |
| `paymentDetails` | `FIN_Payment_ScheduleDetail` | Settled payment details. |
| `reversedInvoices` | (rectification tab) | Link to the reversed invoice when this is a credit memo / rectification. |
| `exchangeRates` | `C_Invoice_Rate` | Multi-currency exchange overrides. |
| `accounting` | `Fact_Acct` | Posted journal entries. |
| `siiData` | (AEAT SII) | Spanish SII data (only when the SII module is installed). |
| `batuz` | (Basque BATUZ) | BATUZ data (only when the Batuz module is installed). |

### Required writable fields on `purchase-invoice/header`

Source: `etendo_neo_schema(spec="purchase-invoice", entity="header")`. Required, writable fields with no server-side default:

| Field (JSON name) | DB column | Type | Notes |
|-------------------|-----------|------|-------|
| `transactionDocument` | `C_DocTypeTarget_ID` | foreignKey | Choose **AP Invoice** for a regular invoice, **AP CreditMemo** for a credit memo, **Reversed Purchase Invoice** for a rectification. |
| `businessPartner` | `C_BPartner_ID` | foreignKey | Vendor BP. |
| `partnerAddress` | `C_BPartner_Location_ID` | foreignKey | Vendor address. Depends on `businessPartner` — pass `recordContext: { "businessPartner": "<id>" }`. |
| `paymentMethod` | `FIN_Paymentmethod_ID` | foreignKey | Required for purchase invoices (unlike on the order, where it is optional). |
| `paymentTerms` | `C_PaymentTerm_ID` | foreignKey | Payment terms. |
| `priceList` | `M_PriceList_ID` | foreignKey | Purchase price list (must match the price list configured on the vendor). |
| `currency` | `C_Currency_ID` | foreignKey | Defaulted from the client; override only when needed. |
| `invoiceDate` | `DateInvoiced` | date | Defaulted to today. |
| `accountingDate` | `DateAcct` | date | Defaulted to today; must fall in an open period. |

Required fields with defaults the agent can usually accept: `documentStatus` (`DR`), `paymentComplete` (`N`), `cashVAT` (`N`), `daysTillDue` (`0`), `totalPaid` (`0`), `outstandingAmount` (`0`), `dueAmount` (`0`), `prepaymentamt` (`0`), `salesTransaction` (`@IsSOTrx@` — must be `false`, set by the spec; do not send).

Read-only (omit from `etendo_neo_create`): `id` (`C_Invoice_ID`), `documentNo` (`DocumentNo`). The server returns them in the response.

### Required writable fields on `purchase-invoice/lines`

| Field (JSON name) | DB column | Type | Notes |
|-------------------|-----------|------|-------|
| `invoice` | `C_Invoice_ID` | foreignKey | Parent FK. Use the header `id` from create, or `parentRef` in `etendo_neo_batch`. |
| `invoicedQuantity` | `QtyInvoiced` | number | Defaults to `1`; supply the right value for the line. |
| `unitPrice` | `PriceActual` | number | Net unit price. |
| `lineNetAmount` | `LineNetAmt` | number | `unitPrice * invoicedQuantity`. The server validates the relation; some processors recompute it from price + quantity. |
| `listPrice` | `PriceList` | number | List price. |
| `priceLimit` | `PriceLimit` | number | Lower price limit. |
| `lineNo` | `Line` | number | Defaults to `MAX(line)+10`. |

The line schema declares `product` as **optional** (`required: false`). In practice an agent supplies `product` for every product line; lines without a product are reserved for the financial-only "Financial Invoice Line" pattern (`financialInvoiceLine: true` + an `account` value). `tax` is also optional in the schema and is normally derived from the product + BP + dates by the line callout.

### Buttons (actions on `purchase-invoice/header`)

| Action | What it does | `parameters` |
|--------|--------------|--------------|
| `DocAction` | Process the invoice: complete (`CO`), void (`VO`), reactivate (`RE`). Underlying classic process id `111`. | `{ "docAction": "<CO|VO|RE>" }` |
| `Posted` | Post to the general ledger. | — |
| `Createfromorders` | Create lines from an existing purchase order. | (Process opens picker; for headless flows, prefer creating lines directly) |
| `Createfrominouts` | Create lines from one or more goods receipts. | (Process opens picker) |
| `GenerateTo` | Generate the matching receipt from the invoice (`Generate Receipt from Invoice`, id `142`). | — |
| `EM_APRM_Addpayment` | Open Add Payment for the invoice. | — |
| `EM_APRM_Processinvoice` | "APRM Process Invoice" (id `B54318B49E984B9CB855AEFB1F474CD6`). Equivalent to `DocAction CO` for invoices managed by the APRM workflow. | — |

## End-to-end usage example

**Goal**: Receive a vendor invoice (PDF, manual entry). Create the AP invoice for vendor `Blanquiceleste S.A.`, add one product line, complete it, then post.

### Step 1 — Resolve the document type

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "purchase-invoice",
    "entity": "header",
    "column": "transactionDocument",
    "query": "AP Invoice"
  }
}
```

Pick the **AP Invoice** row (verified `id` on the sample instance: `5C6E02993E9B4FCA81C07955EF676C62`).

### Step 2 — Resolve the vendor and address

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "purchase-invoice",
    "entity": "header",
    "column": "businessPartner",
    "query": "Blanqui"
  }
}
```

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "purchase-invoice",
    "entity": "header",
    "column": "partnerAddress",
    "recordContext": { "businessPartner": "<vendor-id>" }
  }
}
```

### Step 3 — Inspect defaults

```json
{ "tool": "etendo_neo_defaults", "arguments": { "spec": "purchase-invoice", "entity": "header" } }
```

The response surfaces a default `paymentTerms`, `priceList`, `paymentMethod`, and `currency`. Reuse them unless the user requires different values.

### Step 4 — Create the header

```json
{
  "tool": "etendo_neo_create",
  "arguments": {
    "spec": "purchase-invoice",
    "entity": "header",
    "fields": {
      "transactionDocument": "5C6E02993E9B4FCA81C07955EF676C62",
      "businessPartner": "<vendor-id>",
      "partnerAddress": "<vendor-address-id>",
      "paymentMethod": "<payment-method-id>",
      "paymentTerms": "<payment-terms-id>",
      "priceList": "<purchase-price-list-id>",
      "currency": "<currency-id>",
      "invoiceDate": "2026-06-18",
      "accountingDate": "2026-06-18",
      "orderReference": "<vendor-invoice-number-from-pdf>"
    }
  }
}
```

Capture `id` (DB `C_Invoice_ID`) and `documentNo`. The header arrives in `documentStatus: "DR"`.

### Step 5 — Add a line

Resolve the product, then resolve the line tax (depends on header context):

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "purchase-invoice",
    "entity": "lines",
    "column": "product",
    "query": "<product-fragment>"
  }
}
```

```json
{
  "tool": "etendo_neo_selectors",
  "arguments": {
    "spec": "purchase-invoice",
    "entity": "lines",
    "column": "tax",
    "parentContext": {
      "businessPartner": "<vendor-id>",
      "invoiceDate": "2026-06-18",
      "priceList": "<purchase-price-list-id>"
    }
  }
}
```

```json
{
  "tool": "etendo_neo_create",
  "arguments": {
    "spec": "purchase-invoice",
    "entity": "lines",
    "fields": {
      "invoice": "<invoice-id>",
      "product": "<product-id>",
      "invoicedQuantity": 10,
      "unitPrice": 12.50,
      "lineNetAmount": 125.00,
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
    "spec": "purchase-invoice",
    "entity": "header",
    "id": "<invoice-id>",
    "action": "DocAction",
    "parameters": { "docAction": "CO" }
  }
}
```

On `processResult: "success"` the header transitions to `documentStatus: "CO"`. `grandTotalAmount`, `outstandingAmount`, and the payment plan are written by the processor.

### Step 7 — Post

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

A `processResult: "success"` confirms the journal entries were written. Report `id`, `documentNo`, `grandTotalAmount`, and `outstandingAmount` to the user.

## Alternative flow — From a purchase order

When the invoice mirrors an existing PO:

1. Confirm the PO is `documentStatus: "CO"`.
2. Create the invoice header with the same vendor / dates (Step 4 above). Optionally set the `salesOrder` field on the header to link the PO (`C_Order_ID`).
3. Fire the `Createfromorders` action on the new invoice header:

```json
{
  "tool": "etendo_neo_action",
  "arguments": {
    "spec": "purchase-invoice",
    "entity": "header",
    "id": "<invoice-id>",
    "action": "Createfromorders"
  }
}
```

That underlying process (`AB2EFCAABB7B4EC0A9B30CFB82963FB6`) usually opens a picker in the UI to choose order lines. From an MCP-only agent, the simpler equivalent is to skip the picker and create lines manually using the PO lines as a reference (read them via `etendo_neo_list` on `purchase-order/lines` with `filters: { "salesOrder": "<po-id>" }`, then push one `etendo_neo_create` per line on `purchase-invoice/lines` with `salesOrderLine` set to the source `C_OrderLine_ID`).

## Alternative flow — From a goods receipt

When the order has already been received and the agent must invoice the received quantity:

1. Locate the completed receipt via `etendo_neo_list` on `goods-receipt/goodsReceipt`.
2. Fire `GenerateTo` (process id `154`) on the receipt:

```json
{
  "tool": "etendo_neo_action",
  "arguments": {
    "spec": "goods-receipt",
    "entity": "goodsReceipt",
    "id": "<receipt-id>",
    "action": "GenerateTo"
  }
}
```

The response carries the new invoice's `documentNo` in `processMessage`. Locate the freshly created invoice:

```json
{
  "tool": "etendo_neo_list",
  "arguments": {
    "spec": "purchase-invoice",
    "entity": "header",
    "filters": { "documentNo": "<doc-no-from-processMessage>" },
    "limit": 1
  }
}
```

3. Complete (`DocAction` `CO`) and post (`Posted`) as in Steps 6–7.

## Credit memo (rectification)

To enter a credit memo, set `transactionDocument` to the **AP CreditMemo** ID at create time, then either:

- Create lines manually with negative `invoicedQuantity`, or
- After creating the header, populate `etgoTotalDiscount` / use the `EM_Etvfac_Rect_Create` button (process id `E36A8BA259164E78AFDDC760172C18F5`) when the source invoice should be linked.

The completion (`DocAction` `CO`) and posting (`Posted`) steps are identical.

## Error handling

| Symptom | Likely cause | Resolution |
|---------|--------------|------------|
| `etendo_neo_create` rejects with *"Required field: paymentMethod"* | `paymentMethod` is required on the invoice header (it is optional on the order header) | Resolve via `etendo_neo_selectors` on `purchase-invoice/header.paymentMethod` and include it |
| `etendo_neo_create` succeeds but `grandTotalAmount` is `0` after `DocAction` `CO` | Lines were not created, or the line `unitPrice` × `invoicedQuantity` produced zero | List the lines (`etendo_neo_list` on `purchase-invoice/lines` filtered by `invoice`), verify amounts, fix or recreate |
| `DocAction` (`CO`) returns `processResult: "error"` with *@InvoiceWithoutLines@* | No lines created | Create at least one line first |
| `DocAction` (`CO`) returns `error` mentioning *period closed* | `accountingDate` falls in a closed period | `etendo_neo_update` the header with a date in an open period, then retry |
| `Posted` returns `error` mentioning *"document not completed"* | Posting requires `documentStatus: "CO"` | Fire `DocAction` `CO` first |
| `Posted` returns `processResult: "warning"` with a balance message | Accounts are unbalanced or the posting period has constraints | Surface the `processMessage` verbatim; treat the document as **not** posted |
| `Createfromorders` / `Createfrominouts` returns `error` mentioning *"BPartner mismatch"* | The source order/receipt belongs to a different vendor than the invoice header | Recreate the header with the matching vendor, or pick a different source document |

Generic error rules from [../mcp/index.md#error-handling](../mcp/index.md#error-handling) and [../agent-manual.md#error-handling](../agent-manual.md#error-handling) also apply.
