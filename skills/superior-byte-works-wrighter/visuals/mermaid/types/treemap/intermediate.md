<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Treemap — Intermediate (6–12 nodes)

Multi-level hierarchy. Use for detailed categorization.

---

## Example: Disk Usage

```mermaid
treemap
 accTitle: Disk Usage Breakdown
 accDescr: Disk space usage by category and application

 root["Storage"]
  system["System"]
   os["OS"]
   drivers["Drivers"]
   temp["Temp"]
  applications["Applications"]
   browser["Browser"]
   ide["IDE"]
   office["Office"]
  user_data["User Data"]
   documents["Documents"]
   photos["Photos"]
   videos["Videos"]
```

---

## Example: Market Share

```mermaid
treemap
 accTitle: Market Share by Segment
 accDescr: Market share breakdown by region and product

 root["Market"]
  north_america["North America"]
   enterprise["Enterprise"]
   smb["SMB"]
   consumer["Consumer"]
  europe["Europe"]
   enterprise["Enterprise"]
   smb["SMB"]
  asia["Asia"]
   enterprise["Enterprise"]
   consumer["Consumer"]
```

---

## Example: Cost Centers

```mermaid
treemap
 accTitle: Cost Center Breakdown
 accDescr: Cost breakdown by department and category

 root["Costs"]
  engineering["Engineering"]
   personnel["Personnel"]
   infrastructure["Infrastructure"]
   licenses["Licenses"]
  sales["Sales"]
   personnel["Personnel"]
   travel["Travel"]
   tools["Tools"]
  marketing["Marketing"]
   personnel["Personnel"]
   advertising["Advertising"]
   events["Events"]
```

---

## Copy-Paste Template

```mermaid
treemap
 accTitle: REPLACE WITH 3-8 WORD TITLE
 accDescr: REPLACE WITH 1-2 sentences describing what this treemap shows

 root["Root"]
  category_a["Category A"]
   sub_a1["Sub A1"]
   sub_a2["Sub A2"]
   sub_a3["Sub A3"]
  category_b["Category B"]
   sub_b1["Sub B1"]
   sub_b2["Sub B2"]
  category_c["Category C"]
   sub_c1["Sub C1"]
   sub_c2["Sub C2"]
```

---

## Tips

- 6–12 nodes provides good detail
- Keep hierarchy depth ≤ 3
- Group related items
- Consider including values in labels
