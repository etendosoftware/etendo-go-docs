# AGENTS.md

This file provides instructions for AI agents working on the `etendo-go-docs` repository.

## Purpose

The `/agentic/` directory contains machine-readable documentation intended to be consumed by AI agents. These guides provide precise, structured information about Etendo Go features and integrations for agent-driven workflows. They are **not** part of the MkDocs site and are not rendered as HTML.

## Structure conventions

```
/agentic/
├── index.md                  # Root index — lists all topic sections
└── <topic>/
    └── index.md              # Topic guide — self-contained, covers one integration or feature area
```

- One subdirectory per topic.
- Each topic directory must have an `index.md` as its entry point.
- Additional pages within a topic are allowed but must be linked from the topic's `index.md`.

## Writing style

- **Language**: English only.
- **Tone**: Concise and explicit — no ambiguity, no marketing language.
- **Headings**: H2 (`##`) for top-level sections, H3 (`###`) for subsections.
- **Code blocks**: Always include a language tag (` ```json `, ` ```bash `, etc.).
- **Instructions**: Use imperative mood ("Run", "Set", "Configure", "Add").
- **Values**: Use exact parameter names, endpoint paths, and environment variable names. Wrap placeholders in angle brackets: `<your-value>`.
- **Prerequisites**: List every prerequisite before any instructions.
- **Lists**: Prefer numbered lists for sequential steps, bullet lists for unordered items.
- **Tables**: Use tables to document parameters, tools, error codes, and configuration options.

## Sections required in every topic guide

Every `/agentic/<topic>/index.md` must contain the following sections in order:

1. **Overview** — what this topic covers and why it matters for agents.
2. **Prerequisites** — what must be configured before following this guide.
3. **Configuration** — step-by-step setup instructions with exact values.
4. **Available capabilities** — tools, endpoints, or resources exposed (use a table).
5. **End-to-end usage example** — at least one complete walkthrough from input to output.
6. **Error handling** — common errors, their causes, and how to resolve them.

## Steps to add a new section to /agentic/

1. Create a new directory: `/agentic/<topic>/`
2. Create `/agentic/<topic>/index.md` following the section structure above.
3. Register the new topic in `/agentic/index.md` by adding a row to the "Topic sections" table.
4. Keep each guide self-contained — do not rely on content from other agentic pages.

## Steps to update an existing section

1. Edit the relevant `/agentic/<topic>/index.md`.
2. Validate that all code examples work against the current API version before committing.
3. Remove outdated information rather than appending corrections inline.

## Maintenance rules

- Delete obsolete sections entirely — do not mark them as deprecated.
- Keep `/agentic/index.md` in sync with the actual subdirectories present.
- Never add MkDocs-specific syntax (admonitions, tabs, grid cards) — this content is read as plain Markdown.
