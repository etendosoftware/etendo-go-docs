# Etendo Go — Agentic Documentation

This directory contains documentation written for AI agents. It is **not** part of the MkDocs site and is **not** rendered as HTML. All content is plain Markdown intended to be read and executed by automated agents.

## Purpose

These guides provide structured, unambiguous information about Etendo Go integrations and operational capabilities. Use them when:

- Configuring an AI agent to interact with Etendo Go.
- Automating workflows that read from or write to an Etendo Go instance.
- Integrating third-party tools with the Etendo Go API.
- Building agent pipelines that consume ERP data.

## Topic sections

| Section | Description |
|---------|-------------|
| [Agent operating manual](./agent-manual.md) | Normative manual that teaches an MCP-only agent how to plan, discover specs, read schemas, resolve selectors, chain tool calls, and react to failures end-to-end |
| [MCP](./mcp/index.md) | Configure and use the Etendo Go MCP server: prerequisites, the `spec + entity` model, the generic `neo_*` tools, the `generate_*` report tools, and the single `etendo://status` resource |
| [Finance](./finance/index.md) | Finance domain mapped to MCP specs: financial accounts, payments in / out, payment terms, conversion rates, and the full bank-reconciliation flow (`import → process → match → reconcile`) |
| [Contacts](./contacts/index.md) | `contacts` spec mapped to the Contactos window: business partners with customer / vendor / employee roles, contact persons, addresses, bank accounts, accounting overrides, discounts, intrastat and document-type defaults |

## How to read these guides

1. Open the topic index listed above for the integration or feature you need.
2. Read the **Prerequisites** section first and satisfy every requirement before proceeding.
3. Follow **Configuration** steps in order — each step depends on the previous one.
4. Use the **Available tools** and **Specs available** tables as a reference while building agent logic; never hard-code spec or entity names — call `neo_discover` at runtime to obtain the authoritative list for the current user.
5. Run the **End-to-end usage example** to verify your setup works before writing custom workflows.

## Conventions used across all guides

| Convention | Meaning |
|------------|---------|
| `<placeholder>` | Replace with your actual value before use |
| `https://go.etendo.cloud` | Default Etendo Go cloud endpoint; replace with your instance URL if self-hosted |
| `(optional)` | Configuration value that has a working default; can be omitted |
| Required | Configuration value that has no default; must be provided |

All API requests require a valid JWT token unless the endpoint is explicitly marked as public.
