---
name: Offline HTML Sealed Spec
description: Specification for covertly fingerprinted and optionally protected offline HTML delivery
version: 1.0.0
author: Omni Unified Writing
---

# Offline HTML Sealed Spec

Sealed delivery compiles `wrighter` artifacts into a single offline HTML file for private or recipient-targeted use.

## 🔒 Required Properties

- one `.html` file only
- offline operation in a regular modern browser
- no required network access
- covert per-artifact fingerprinting is mandatory
- snapshots preserve lineage and fingerprint inheritance

## 👥 Principal And Auth Modes

| Mode                        | Principals                | Authentication                    |
| --------------------------- | ------------------------- | --------------------------------- |
| Fingerprinted public sealed | `0` or generic principals | None                              |
| Single-principal sealed     | `1` principal             | Optional password or local unlock |
| Multi-principal sealed      | `n` principals            | Shared or per-principal auth      |

## 🧩 Exposure Rules

Sealed artifacts may expose:

- the full artifact to all principals
- different sections by principal string
- service-delivered content produced by hidden workflow logic

When strong process or filesystem isolation is required, use appliance mode instead of claiming HTML-only isolation.

## 🧬 Fingerprinting Rules

1. Every sealed artifact gets a unique `delivery_id` and `fingerprint_id`.
2. Fingerprinting is duplicated across manifest, structure, state, vector assets, and binary wrappers.
3. Attribution should survive ordinary editing and repackaging.
4. Removal should require substantial reauthoring or heavy distillation.

## 🔐 Protection Levels

| Level              | Meaning                                 |
| ------------------ | --------------------------------------- |
| `none`             | Fingerprinted but not encrypted         |
| `local-unlock`     | Shared unlock gate for the artifact     |
| `principal-unlock` | Per-principal gate with scoped exposure |

## 💾 Snapshots

Snapshots may be:

- plain or encrypted depending on protection level
- manually exported
- offered after major updates
- imported later for rollback

Snapshots must retain original delivery lineage.

## ✅ Acceptance Checklist

- [ ] Opens offline in a modern browser
- [ ] Supports `0..n` principal strings
- [ ] Fingerprinting is always present
- [ ] Snapshot lineage survives export and import
- [ ] Security claims stay within browser reality
