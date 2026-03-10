<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Treemap — Advanced (12–20 nodes)

Complex hierarchy. Use for comprehensive data visualization.

---

## Example: File System

```mermaid
treemap
 accTitle: Complete File System
 accDescr: Comprehensive file system structure

 root["/"]
  bin["bin"]
   executables["Executables"]
  etc["etc"]
   config["Config"]
   scripts["Scripts"]
  home["home"]
   user1["user1"]
    documents["Documents"]
    downloads["Downloads"]
    pictures["Pictures"]
   user2["user2"]
    documents["Documents"]
    music["Music"]
  var["var"]
   log["Log"]
   tmp["Tmp"]
   cache["Cache"]
  usr["usr"]
   local["Local"]
   share["Share"]
```

---

## Example: Company Structure

```mermaid
treemap
 accTitle: Company Organization
 accDescr: Complete company organizational structure

 root["Company"]
  engineering["Engineering"]
   frontend["Frontend"]
    team_a["Team A"]
    team_b["Team B"]
   backend["Backend"]
    platform["Platform"]
    services["Services"]
   devops["DevOps"]
    sre["SRE"]
    platform["Platform"]
  product["Product"]
   design["Design"]
    ux["UX"]
    ui["UI"]
   pm["Product Mgmt"]
    core["Core"]
    growth["Growth"]
  sales["Sales"]
   enterprise["Enterprise"]
   smb["SMB"]
   cs["Customer Success"]
  marketing["Marketing"]
   brand["Brand"]
   growth["Growth"]
   content["Content"]
```

---

## Example: Budget Detail

```mermaid
treemap
 accTitle: Detailed Budget Breakdown
 accDescr: Comprehensive budget by department and category

 root["Annual Budget"]
  engineering["Engineering"]
   personnel["Personnel"]
    salaries["Salaries"]
    benefits["Benefits"]
    contractors["Contractors"]
   tools["Tools"]
    software["Software"]
    hardware["Hardware"]
   infrastructure["Infrastructure"]
    cloud["Cloud"]
    hosting["Hosting"]
  sales["Sales"]
   personnel["Personnel"]
    salaries["Salaries"]
    commissions["Commissions"]
   operations["Operations"]
    travel["Travel"]
    events["Events"]
    tools["Tools"]
  marketing["Marketing"]
   personnel["Personnel"]
   campaigns["Campaigns"]
    digital["Digital"]
    events["Events"]
    content["Content"]
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
    item_1["Item 1"]
    item_2["Item 2"]
   sub_a2["Sub A2"]
    item_3["Item 3"]
  category_b["Category B"]
   sub_b1["Sub B1"]
    item_4["Item 4"]
    item_5["Item 5"]
   sub_b2["Sub B2"]
  category_c["Category C"]
   sub_c1["Sub C1"]
   sub_c2["Sub C2"]
```

---

## Tips

- At 12+ nodes, consider if multiple treemaps would be clearer
- Maximum 4 levels deep
- Balance the tree structure
- Include values where relevant
