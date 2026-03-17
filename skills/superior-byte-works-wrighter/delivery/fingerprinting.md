---
name: Sealed Delivery Fingerprinting
description: Covert forensic fingerprinting requirements for sealed wrighter delivery artifacts
version: 1.0.0
author: Omni Unified Writing
---

# Sealed Delivery Fingerprinting

Sealed delivery artifacts are always fingerprinted. The fingerprint should be covert, redundant, and difficult to remove without substantial reauthoring.

## 🎯 Goal

Fingerprinting exists to attribute leaked sealed artifacts to the delivered recipient set.

The target standard is not perfect invisibility. The target standard is practical persistence: ordinary copying, repacking, export, editing, and light rewriting should not remove attribution.

## 🧬 Fingerprint Record

```yaml
fingerprint_id: string
recipient_principals:
  - user@example.com
issue_time: 2026-03-11T00:00:00Z
watermark_version: 1
```

## 🕵️ Watermark Layers

| Layer                | Applies to                                        | Purpose                     |
| -------------------- | ------------------------------------------------- | --------------------------- |
| Manifest layer       | Delivery metadata, hashes, lineage                | Stable forensic anchor      |
| Structure layer      | HTML, CSS, JS arrangement                         | Survives routine edits      |
| State layer          | App-state graph and field layout                  | Persists across snapshots   |
| Vector layer         | SVG, Mermaid-derived SVG, MIDI event structure    | Survives common reuse paths |
| Binary wrapper layer | Embedded binary payload metadata and chunk layout | Covers non-vector fallbacks |

## 🧪 Survival Expectations

Fingerprinting should survive:

- file rename or relocation
- snapshot export and import
- light editing or repackaging
- code formatting or bundling changes
- partial extraction of content and assets

Fingerprinting may fail only after:

- substantial semantic rewriting
- deep distillation that discards the original structure
- true greenfield recreation

## ⚠️ Constraints

- Do not describe the watermark as impossible to detect.
- Do not describe the watermark as impossible to remove.
- Do describe it as covert, redundant, and forensic.

## 🔗 See Also

- [threat-model.md](threat-model.md)
- [snapshot-model.md](snapshot-model.md)
- [offline-html-sealed/spec.md](offline-html-sealed/spec.md)
