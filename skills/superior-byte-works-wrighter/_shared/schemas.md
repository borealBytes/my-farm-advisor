---
name: wrighter-schemas
description: Data structure definitions
---

# Schemas

Standard structures for wrighter metadata.

## Frontmatter

| Field | Type | Required |
|-------|------|----------|
| name | string | Yes |
| description | string | Yes |
| tier | number | No |

## Tier Levels

| Tier | Lines | Purpose |
|------|-------|---------|
| 1 | <30 | Router only |
| 2 | <100 | Light content |
| 3 | 100+ | Full docs |
