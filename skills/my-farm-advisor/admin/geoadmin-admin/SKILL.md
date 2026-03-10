# geoadmin-admin

_Repo-native skill scaffold for shared geoadmin assets._

---

## 📋 Purpose

This skill will own shared geoadmin data handling for the repository, including canonical Level 0, Level 1, and Level 2 admin roots under `data/shared/geoadmin/`.

## 📦 Scope

- Shared geoadmin root discovery
- County/state/country admin layout helpers
- Future standardization and source-vintage metadata work

## 🔗 Integration

- Code lives under `.opencode/skills/geoadmin-admin/src/`
- Shared outputs live under `data/shared/geoadmin/`
- Annual maturity scripts consume this skill through repo-native path helpers and bootstrap code
