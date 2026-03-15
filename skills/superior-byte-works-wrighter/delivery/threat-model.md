---
name: Delivery Threat Model
description: Threat model and guarantee boundaries for wrighter delivery artifacts
version: 1.0.0
author: Omni Unified Writing
---

# Delivery Threat Model

Delivery guarantees differ by mode. This document keeps those guarantees honest.

## 🛡️ Open Mode Guarantees

Open artifacts promise:

- full offline usability in a modern browser
- full inspectability
- clean source-faithful dataset delivery
- no hidden privileged views

Open artifacts do not promise confidentiality.

## 🔐 Sealed Mode Guarantees

Sealed artifacts promise:

- per-artifact fingerprinting
- optional local authentication
- optional encryption at rest
- principal-scoped exposure rules
- snapshot lineage and rollback

Sealed artifacts do not promise true operating-system isolation when delivered as a normal standalone HTML file.

## 🖥️ Appliance Mode Guarantees

Appliance mode is reserved for a stronger runtime that may model users, service principals, jobs, and local-system-like permissions.

It should not inherit the lighter security claims of plain offline HTML.

## 👤 Attacker Assumptions

| Attacker                                    | Open                  | Sealed HTML                      | Appliance                        |
| ------------------------------------------- | --------------------- | -------------------------------- | -------------------------------- |
| Curious recipient with browser tools        | Full access by design | Expected                         | Expected                         |
| Recipient who copies the file               | Allowed               | Fingerprinting should persist    | Fingerprinting should persist    |
| Recipient who lightly rewrites contents     | Allowed               | Attribution should often survive | Attribution should often survive |
| Recipient seeking true privilege escalation | Not relevant          | Browser limits apply             | Runtime must define controls     |

## 📏 Honest Language

Use these phrases:

- `fully inspectable` for open mode
- `fingerprinted and optionally protected` for sealed mode
- `runtime-backed permission model` for appliance mode

Avoid these phrases unless a stronger runtime exists:

- `true Linux permissions`
- `undetectable watermark`
- `impossible to leak`

## 🔗 See Also

- [fingerprinting.md](fingerprinting.md)
- [offline-html-open/spec.md](offline-html-open/spec.md)
- [offline-html-sealed/spec.md](offline-html-sealed/spec.md)
- [offline-appliance/spec.md](offline-appliance/spec.md)
