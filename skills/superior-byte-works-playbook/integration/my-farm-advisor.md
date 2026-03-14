# Integration: my-farm-advisor

This skill integrates with the `my-farm-advisor` skill to pull
live farm context into playbook generation.

## Context Queries

When building a playbook, request the following from my-farm-advisor:

```
- field_profiles: id, name, acres, soil_type, drainage_class, 
  last_crop, current_crop, GPS_bounds
- crop_history: field_id, year, crop, variety, yield, notes
- equipment_inventory: id, type, make, model, last_service_date
- current_season: year, planting_progress, GDD_to_date, precip_ytd
- active_incidents: field_id, type, severity, date_opened
```

## Enrichment Behavior

If `my-farm-advisor` returns data, the playbook builder:
1. Substitutes real field IDs, acreages, and crop names into templates
2. Sets GDD-based trigger conditions from current-season data
3. Flags fields with active incidents and adjusts preconditions
4. Pulls equipment from inventory for `tools_required` fields

If no context available, builder falls back to user-supplied info
or prompts for the minimum required fields.

## Integration: superior-byte-works-google-timesfm-forecasting

If the forecasting skill is loaded:
- Pull 14-day weather forecast for farm location
- Embed forecast into Phase 2 (Planting) trigger conditions
- Flag any frost risk windows in Phase 2–3
- Annotate harvest phases with drydown forecast
