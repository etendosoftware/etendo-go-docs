# Etendo Go Docs

Documentation for **Etendo Go**, split into two parts:

- **`docs/`** — the human-facing [MkDocs](https://www.mkdocs.org/) site, published at
  [etendosoftware.github.io/etendo-go-docs](https://etendosoftware.github.io/etendo-go-docs/).
- **`agentic/`** — machine-readable guides written for AI agents (see [`AGENTS.md`](./AGENTS.md)).
  This is the content indexed by [Context7](https://context7.com).

## Context7 integration

[Context7](https://context7.com) is an MCP server that delivers up-to-date,
version-specific documentation straight into your LLM / coding assistant. This
repository is published as a Context7 library so any MCP-capable agent can pull
the Etendo Go agentic docs on demand.

- **Library ID:** `/etendosoftware/etendo-go-docs`
- **Indexed content:** the `agentic/` folder only (configured in
  [`context7.json`](./context7.json)).
- **Auto-refresh:** every push to `main` triggers a re-index via the
  [`context7-refresh`](./.github/workflows/context7-refresh.yml) GitHub Action.

### Install the Context7 MCP server

You need [Node.js](https://nodejs.org) ≥ 18. The official installer
(`npx ctx7 setup`) auto-detects your environment and writes the MCP config for
you — no manual editing required.

**Auto-detect (recommended)**

```bash
npx ctx7 setup
```

**Target a specific client**

| Client            | Command                       |
| ----------------- | ----------------------------- |
| Claude Code (CLI) | `npx ctx7 setup --claude`     |
| Cursor (IDE)      | `npx ctx7 setup --cursor`     |
| Opencode (CLI)    | `npx ctx7 setup --opencode`   |
| Codex (CLI)       | `npx ctx7 setup --codex`      |
| Antigravity (IDE) | `npx ctx7 setup --antigravity`|

For any other client (VS Code, Windsurf, Gemini CLI, etc.), see the
[manual setup guide for all clients](https://context7.com/docs/resources/all-clients).

Restart the client after the setup completes. An API key is optional but
recommended for higher rate limits — get one at
[context7.com/dashboard](https://context7.com/dashboard).

### Query the Etendo Go docs

Once the MCP server is connected, reference this library in any prompt. Two ways:

1. **Pin the library explicitly** — fastest and most reliable:

   ```text
   How do I configure the MCP treasury tools in Etendo Go?
   use library /etendosoftware/etendo-go-docs
   ```

2. **Let Context7 resolve it** — mention "Etendo Go" and add `use context7`:

   ```text
   Explain bank reconciliation in Etendo Go. use context7
   ```

The agent will call the Context7 tools (`resolve-library-id` and
`get-library-docs`) and inject the matching agentic docs into its context before
answering.

You can also browse the indexed library directly at
[context7.com/etendosoftware/etendo-go-docs](https://context7.com/etendosoftware/etendo-go-docs).

## Local development (MkDocs site)

```bash
pip install -r requirements.txt
mkdocs serve
```

The site is then available at `http://127.0.0.1:8000`.
