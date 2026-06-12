# Contactos — Customer and Vendor Management for AI Agents

## Overview

This guide explains how an AI agent can query and create contacts (customers and vendors) inside Etendo Go: searching the contact directory, retrieving full contact records, and registering new customers or vendors needed by sales and procurement workflows.

This guide covers:

- Prerequisites for contact management.
- Available tools and their parameters.
- An end-to-end workflow example: search for a customer by name, retrieve their full record, and create a new vendor when one is not found.
- Error handling patterns specific to the contacts module.

## Prerequisites

- An active Etendo Go instance with the MCP server configured (see [MCP setup](../mcp/index.md)).
- An API user with the `contacts_viewer` role for read-only operations, or `contacts_manager` to create or update records.
- Tax ID formats vary by country. Verify the format required by your Etendo Go instance before submitting `create_customer` or `create_vendor` calls.

## Available tools

| Tool | Description | Required parameters | Optional parameters |
|------|-------------|---------------------|---------------------|
| `list_customers` | Returns all customers | — | `search` |
| `list_vendors` | Returns all vendors | — | `search` |
| `get_contact` | Retrieves full detail for a contact by ID | `contact_id` | — |
| `create_customer` | Registers a new customer in Etendo Go | `name`, `tax_id` | `email`, `phone`, `address`, `payment_terms`, `currency` |
| `create_vendor` | Registers a new vendor in Etendo Go | `name`, `tax_id` | `email`, `phone`, `address`, `payment_terms`, `currency` |

### Parameter details

**`list_customers` and `list_vendors` — `search` parameter**

Free-text filter matched against name, tax ID, and email. Returns all records when omitted.

**`create_customer` and `create_vendor` — full parameter reference**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Legal name of the entity |
| `tax_id` | string | Yes | Tax identifier (VAT number, CIF, EIN, etc.) |
| `email` | string | No | Primary contact email |
| `phone` | string | No | Primary phone number |
| `address.street` | string | No | Street address |
| `address.city` | string | No | City |
| `address.postal_code` | string | No | Postal or ZIP code |
| `address.country` | string | No | ISO 3166-1 alpha-2 country code (e.g., `ES`, `US`) |
| `payment_terms` | string | No | Payment term code (e.g., `30_days`, `60_days`, `immediate`) |
| `currency` | string | No | ISO 4217 currency code (e.g., `EUR`, `USD`); defaults to the instance base currency |

**`get_contact` — response `type` field values**

`customer` · `vendor` · `both`

A contact with `type: "both"` is used in both sales and purchase transactions.

## End-to-end usage example

**Goal**: A sales agent receives a new order from an entity that does not yet exist in the system. The agent searches for the contact, confirms it is missing, and creates a new customer record before placing the order.

### Step 1 — Search for the customer by name

Tool call:

```json
{
  "tool": "list_customers",
  "arguments": {
    "search": "Initech"
  }
}
```

Response:

```json
{
  "customers": []
}
```

No existing customer found. The agent proceeds to create one.

### Step 2 — Create the new customer

Tool call:

```json
{
  "tool": "create_customer",
  "arguments": {
    "name": "Initech Solutions S.L.",
    "tax_id": "B98765432",
    "email": "accounts@initech.es",
    "phone": "+34 91 555 0100",
    "address": {
      "street": "Calle Falsa 123",
      "city": "Madrid",
      "postal_code": "28001",
      "country": "ES"
    },
    "payment_terms": "30_days",
    "currency": "EUR"
  }
}
```

Response:

```json
{
  "id": "C-00201",
  "type": "customer",
  "name": "Initech Solutions S.L.",
  "tax_id": "B98765432",
  "email": "accounts@initech.es",
  "phone": "+34 91 555 0100",
  "address": {
    "street": "Calle Falsa 123",
    "city": "Madrid",
    "postal_code": "28001",
    "country": "ES"
  },
  "payment_terms": "30_days",
  "currency": "EUR",
  "created_at": "2024-06-10T17:05:00Z"
}
```

The new customer is created with ID `C-00201`.

### Step 3 — Verify the contact record

Tool call:

```json
{
  "tool": "get_contact",
  "arguments": {
    "contact_id": "C-00201"
  }
}
```

Response:

```json
{
  "id": "C-00201",
  "type": "customer",
  "name": "Initech Solutions S.L.",
  "tax_id": "B98765432",
  "email": "accounts@initech.es",
  "phone": "+34 91 555 0100",
  "address": {
    "street": "Calle Falsa 123",
    "city": "Madrid",
    "postal_code": "28001",
    "country": "ES"
  },
  "payment_terms": "30_days",
  "currency": "EUR",
  "created_at": "2024-06-10T17:05:00Z"
}
```

The agent can now use `C-00201` as the `customer_id` in a `create_sales_order` call (see [Ventas](../ventas/index.md)).

### Step 4 — Optional: create a vendor record for the same entity

If the same company is also a supplier, the agent creates a vendor record.

Tool call:

```json
{
  "tool": "create_vendor",
  "arguments": {
    "name": "Initech Solutions S.L.",
    "tax_id": "B98765432",
    "email": "purchasing@initech.es",
    "payment_terms": "60_days",
    "currency": "EUR"
  }
}
```

Response:

```json
{
  "id": "V-00201",
  "type": "vendor",
  "name": "Initech Solutions S.L.",
  "tax_id": "B98765432",
  "email": "purchasing@initech.es",
  "payment_terms": "60_days",
  "currency": "EUR",
  "created_at": "2024-06-10T17:07:00Z"
}
```

Note: Etendo Go may automatically link `C-00201` and `V-00201` as the same legal entity when they share a `tax_id`.

## Error handling

All tools return a structured error object when a call fails.

```json
{
  "error": {
    "code": "DUPLICATE_TAX_ID",
    "message": "A contact with tax_id B98765432 already exists.",
    "details": {
      "existing_contact_id": "C-00201",
      "existing_contact_type": "customer"
    }
  }
}
```

| Error code | Cause | Resolution |
|------------|-------|------------|
| `AUTH_FAILED` | Invalid API credentials | Verify `ETENDO_USERNAME` and `ETENDO_PASSWORD` |
| `INSUFFICIENT_PERMISSIONS` | API user lacks `contacts_manager` role | Assign the role in **Configuration → Users and permissions** |
| `RECORD_NOT_FOUND` | Contact ID does not exist | Call `list_customers` or `list_vendors` to retrieve valid IDs |
| `DUPLICATE_TAX_ID` | A contact with the same tax ID already exists | Read `error.details.existing_contact_id` and use the existing record instead of creating a new one |
| `INVALID_TAX_ID_FORMAT` | The `tax_id` value does not match the expected format for the country | Verify the tax ID format against the official register for the contact's country |
| `VALIDATION_ERROR` | A required field is missing or has the wrong type | Read `error.details` for the specific field that failed validation |
| `RATE_LIMITED` | Too many requests in a short window | Wait and retry with exponential back-off |
