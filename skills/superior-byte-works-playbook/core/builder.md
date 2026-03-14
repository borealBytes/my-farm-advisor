# Playbook Builder

The builder is the cognitive engine of this skill. It transforms
a user request + farm context into a fully structured playbook.

## Builder Algorithm

```
1. PARSE intent
   - extract: playbook_type, target_fields, crop, timeframe, event_trigger
   - if any missing → ask one clarifying question at a time

2. LOAD context
   - query my-farm-advisor for: field profiles, crop history,
     current season, upcoming weather (via timesfm if available)
   - if no context available → proceed with user-supplied info

3. SELECT template
   - load base template from templates/<type>.md
   - identify which phases apply to this context

4. POPULATE phases
   for each phase:
     a. set trigger (date / threshold / manual)
     b. enumerate steps using farm-specific data
     c. assign responsible_party (default: "operator")
     d. set tools_required from known equipment list
     e. derive success_criteria from agronomic best practice
     f. write contingency for each critical step

5. VALIDATE
   - check: all phases have exit_criteria
   - check: all critical steps have contingency
   - check: date ranges are internally consistent
   - check: no undefined field/crop references

6. RENDER
   - default: Markdown
   - optional: YAML (schema-compliant)
   - optional: checklist-only extract

7. VERSION STAMP
   - assign id: sbw-pb-<type>-<yyyymmdd>-<slug>
   - set version: 0.1.0, authored: today
```

## Context Enrichment Priority

1. Explicit user input (highest priority)
2. my-farm-advisor field/crop data
3. TimesFM forecast data
4. Regional agronomic defaults for Upper Michigan
5. Generic best-practice fallbacks (lowest priority)
