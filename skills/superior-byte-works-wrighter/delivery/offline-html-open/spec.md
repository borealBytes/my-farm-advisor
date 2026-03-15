---
name: Offline HTML Open Spec
description: Specification for source-faithful offline HTML delivery
version: 1.0.0
author: Omni Unified Writing
---

# Offline HTML Open Spec

Open delivery compiles `wrighter` artifacts into a single offline HTML file without hiding source material from the recipient.

## 🌐 Required Properties

- one `.html` file only
- works from local disk in a regular modern browser
- no required network requests
- no external CDN fonts, scripts, or styles
- all required assets inlined or embedded

## 🧾 Source Fidelity

Open delivery should preserve the source dataset as directly as practical.

Examples:

- Markdown rendered to HTML, with source retained when useful
- Mermaid pre-rendered to inline SVG for robust offline viewing
- SVG embedded directly
- MIDI preserved as structured data or embedded playable data
- App-state preserved in plain serializable form

## 🧠 Interactivity

Interactivity is allowed when it remains self-contained.

Examples:

- tabbed views
- search and filter UI
- local graph exploration
- stateful note-taking or annotation

## 💾 Persistence

Open delivery may:

- keep local in-memory state during a session
- offer one-file snapshot export
- offer snapshot import for rollback

Open delivery should not claim confidentiality.

## ✅ Acceptance Checklist

- [ ] Opens offline in a modern browser
- [ ] Requires no remote dependencies
- [ ] Exposes the full clean dataset
- [ ] Keeps assets self-contained
- [ ] Supports optional snapshot export and restore when state exists
