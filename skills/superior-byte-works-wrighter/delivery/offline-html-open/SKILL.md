---
name: wrighter-offline-html-open
description: Source-faithful, single-file offline HTML delivery for wrighter artifacts
version: 1.0.0
author: Omni Unified Writing
---

# Offline HTML Open

Open delivery is the default human-facing format when the full dataset should remain raw, inspectable, and offline.

## 🚪 Purpose

Use this mode when the recipient should receive a single self-contained `.html` file that:

- opens in a modern browser with no internet
- contains the full clean dataset from source
- remains fully inspectable and open
- may include static or interactive behavior

## 🧭 Contract

| Field       | Expectation                                   |
| ----------- | --------------------------------------------- |
| Source      | Markdown, Mermaid, SVG, MIDI, math, app-state |
| Output      | One standalone `.html` file                   |
| Network     | No required network access                    |
| Inspection  | Full source visibility                        |
| Persistence | Optional plain snapshots                      |

## 📚 Specification

- [spec.md](spec.md)
- [../asset-model.md](../asset-model.md)
- [../snapshot-model.md](../snapshot-model.md)

## 🔗 See Also

- [../SKILL.md](../SKILL.md)
- [../offline-html-sealed/SKILL.md](../offline-html-sealed/SKILL.md)
