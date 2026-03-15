---
name: Delivery Snapshot Model
description: Shared snapshot and rollback model for wrighter delivery artifacts
version: 1.0.0
author: Omni Unified Writing
---

# Delivery Snapshot Model

Snapshots are portable rollback points derived from a delivery artifact. They are never the canonical source of truth.

## 💾 Snapshot Purpose

Snapshots support:

- local save and restore
- periodic checkpoints after state changes
- rollback to prior artifact states
- lineage preservation across exports and imports

## 🧩 Snapshot Record

```yaml
snapshot_id: string
parent_delivery_id: string
parent_snapshot_id: string | null
created_at: 2026-03-11T00:00:00Z
schema_version: 1
principal_scope:
  - user
state_blob: string
integrity_hash: sha256:...
fingerprint_lineage:
  root_delivery_id: string
  root_fingerprint_id: string
```

## 🔁 Behavior Rules

1. A delivery artifact may export zero or more snapshots.
2. A snapshot may restore the artifact to a prior state.
3. Snapshot imports must preserve lineage rather than replace it.
4. Sealed snapshots inherit recipient fingerprinting and tamper scoring.
5. Open snapshots may remain plain and inspectable.

## 🕰️ Save Strategy

| Trigger                   | Default behavior           |
| ------------------------- | -------------------------- |
| Manual save               | Offer snapshot export      |
| Major state change        | Suggest snapshot           |
| Timed interval            | Optional periodic reminder |
| Before destructive action | Offer checkpoint           |

## 🔗 See Also

- [asset-model.md](asset-model.md)
- [fingerprinting.md](fingerprinting.md)
- [offline-html-sealed/spec.md](offline-html-sealed/spec.md)
