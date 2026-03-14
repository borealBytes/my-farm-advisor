# superior-byte-works-playbook

**Vendor:** Superior Byte Works LLC
**Skill ID:** `superior-byte-works-playbook`
**Version:** 0.1.0
**Status:** alpha

## Summary

Generates structured operational playbooks, runbooks, SOPs, and field
procedure documents tailored for agricultural operations. Supports
seasonal planning cycles, incident response, and repeatable farm
workflows — all grounded in your actual farm data context.

## Capability Map

| Module | Description |
|---|---|
| `core/` | Playbook engine: schema, builder, renderer |
| `templates/` | Reusable playbook type templates |
| `examples/` | Worked example playbooks |
| `integration/` | Hooks into my-farm-advisor context providers |
| `references/` | External SOPs, extension points |

## Quick Start

Load the skill, then invoke with a playbook type and context:

```
load_skill(["superior-byte-works-playbook"])
// then ask: "Generate a spring planting runbook for field B-4"
```

## Playbook Types

- **seasonal-runbook** — Full seasonal cycle (prep → plant → tend → harvest → close)
- **incident-response** — Pest, disease, weather event response procedures
- **field-sop** — Standard operating procedure for a specific field task
- **equipment-checklist** — Pre/post operation equipment checks
- **crop-rotation-plan** — Multi-season rotation logic with decision trees

## Maintainer

Clayton Young · Superior Byte Works LLC · borealBytes
