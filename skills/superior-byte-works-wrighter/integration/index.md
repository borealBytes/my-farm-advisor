---
name: Integration Guides Index
description: Index of guides for integrating unified-writing with external tools and workflows
version: 1.0.0
author: Omni Unified Writing
---

# Integration Guides

Guides for using unified-writing with external tools, editors, and publishing workflows.

## ## Editor Integrations

### VS Code

**Recommended extensions:**

- **Markdown All in One** — Preview, shortcuts, table formatting
- **Mermaid Preview** — Live Mermaid diagram preview
- **LaTeX Workshop** — LaTeX math preview and compilation
- **markdownlint** — Markdown linting

**Settings for this skill:**

```json
{
  "markdown.preview.breaks": true,
  "markdown.math.enabled": true,
  "[markdown]": {
    "editor.wordWrap": "on",
    "editor.rulers": [100]
  }
}
```

### Obsidian

Obsidian renders Mermaid and LaTeX natively. Enable:

- **Settings > Editor > Strict line breaks:** Off
- **Settings > Editor > Show frontmatter:** On
- **Community plugins:** Dataview (for cross-linking), Templater (for templates)

### Typora

Typora renders Mermaid and LaTeX inline. No additional configuration needed.

---

## ## Publishing Integrations

### GitHub / GitLab

GitHub renders:

- Mermaid diagrams natively (as of 2022)
- LaTeX math via MathJax (as of 2022)
- Markdown tables, code blocks, frontmatter (displayed as table)

**Mermaid in GitHub:** Use standard fenced code blocks with `mermaid` language tag.

**LaTeX in GitHub:** Use `$...$` for inline and `$$...$$` for display math.

### Notion

Notion supports:

- Markdown import (partial — some formatting lost)
- LaTeX math blocks (`/math` command)
- Mermaid: **not natively supported** — use image export

**Workaround for Mermaid in Notion:** Export diagram as SVG/PNG using [mermaid.live](https://mermaid.live) and embed as image.

### Confluence

Confluence supports:

- Markdown via "Markdown" macro or import
- LaTeX via "LaTeX Math" macro (requires plugin)
- Mermaid via "Mermaid Diagrams" marketplace app

### Jupyter Notebooks

Markdown cells support:

- LaTeX math natively
- Mermaid via `%%mermaid` magic (requires `jupyter-mermaid` extension)

---

## ## CI/CD Integrations

### GitHub Actions — Markdown linting

```yaml
name: Lint Markdown
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: DavidAnson/markdownlint-cli2-action@v16
        with:
          globs: "**/*.md"
```

### GitHub Actions — Build PDF from Markdown

```yaml
name: Build PDF
on: [push]
jobs:
  pdf:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build PDF
        uses: docker://pandoc/latex:latest
        with:
          args: >-
            --from markdown
            --to pdf
            --output output.pdf
            input.md
```

---

## ## Reference Manager Integrations

| Tool     | Integration                                 | Notes                    |
| -------- | ------------------------------------------- | ------------------------ |
| Zotero   | Browser extension + Word/Google Docs plugin | Best for most users      |
| JabRef   | BibTeX native                               | Best for LaTeX workflows |
| Mendeley | Word plugin                                 | PDF annotation           |

See [../research/citation-management.md](../research/citation-management.md) for full guidance.

---

## ## AI Tool Integrations

### Using this skill with Claude

This skill is designed for use with Claude via the Omni skill system. Reference specific guides:

```
Use the unified-writing skill to write a methods section for my RCT.
Follow the template at prose/scientific/methods-section.md.
```

### Using with other LLMs

The templates in this skill are plain Markdown and work with any LLM. Provide the relevant template file as context.

---

## ## See Also

- [../core/workflow.md](../core/workflow.md) — Three-phase workflow
- [../prose/technical/onboarding-doc.md](../prose/technical/onboarding-doc.md) — Onboarding documentation
- [../research/citation-management.md](../research/citation-management.md) — Citation management
- [../visuals/](../visuals/) — AI visual generation
