---
name: wrighter-offline-html-sealed
description: Fingerprinted offline HTML delivery for personalized or scoped wrighter artifacts
version: 1.0.0
author: Omni Unified Writing
---

# Offline HTML Sealed

Sealed delivery packages a `wrighter` artifact for targeted recipients. It is always fingerprinted and may be passwordless, single-principal, or multi-principal.

## 🔐 Purpose

Use this mode when the delivered artifact should support one or more of these properties:

- covert per-recipient attribution
- optional authentication
- optional encryption at rest
- principal-scoped exposure
- personalized state and snapshot lineage

## 👤 Principal Model

Principals are strings.

Examples:

- `Clay`
- `clay`
- `clay@example.com`
- `user`
- `everyone`
- `delivery-bot`

The string model supports human recipients, generic users, and service actors without forcing a heavy account schema.

## 🧭 Contract

| Field          | Expectation                                                |
| -------------- | ---------------------------------------------------------- |
| Source         | Markdown, Mermaid, SVG, MIDI, app-state, optional binaries |
| Output         | One standalone `.html` file                                |
| Fingerprinting | Always on                                                  |
| Principals     | `0..n` principals                                          |
| Authentication | None, shared secret, or per-principal                      |
| Exposure       | Full, scoped, or role-like subsets                         |

## 📚 Specification

- [spec.md](spec.md)
- [../fingerprinting.md](../fingerprinting.md)
- [../snapshot-model.md](../snapshot-model.md)
- [../threat-model.md](../threat-model.md)

## 🔗 See Also

- [../SKILL.md](../SKILL.md)
- [../offline-html-open/SKILL.md](../offline-html-open/SKILL.md)
- [../offline-appliance/SKILL.md](../offline-appliance/SKILL.md)
