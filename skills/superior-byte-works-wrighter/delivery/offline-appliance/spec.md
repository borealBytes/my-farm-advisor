---
name: Offline Appliance Spec
description: Specification for a future runtime-backed wrighter delivery appliance
version: 1.0.0
author: Omni Unified Writing
---

# Offline Appliance Spec

Offline appliance is a future delivery class for experiences that need a stronger principal and permission model than standalone HTML can honestly provide.

## 🧱 Concept

The appliance model may provide:

- principal-aware local sessions
- service principals and hidden jobs
- event-triggered or scheduled delivery
- home-directory-like views
- stronger permission and storage boundaries

## ⚙️ Why It Exists

Some requested experiences sound like a mini local system:

- a user opens the artifact and sees only their view
- background actors deliver content into that view
- privileged logic exists but is not exposed as raw source

Those requirements exceed what plain offline HTML can guarantee.

## 📏 Boundary Rule

If the experience requires true isolation, local process semantics, or filesystem-like permissions, it belongs in appliance mode.

If the experience only needs portable offline delivery with optional gating and forensic attribution, it belongs in sealed HTML mode.

## 🛣️ First Planning Goals

1. Define runtime assumptions.
2. Define principal and service models.
3. Define job scheduling and event delivery.
4. Define snapshot and restore behavior.
5. Define stronger security and trust guarantees.
