<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Treemap — Simple (3–6 nodes)

Basic hierarchical data. Use for simple categorization.

---

## Example: File System

```mermaid
treemap
 accTitle: Project File Structure
 accDescr: Simple project directory structure

 root["Project"]
  src["Source"]
   app["App"]
   components["Components"]
  docs["Docs"]
   readme["README"]
```

---

## Example: Budget

```mermaid
treemap
 accTitle: Department Budget
 accDescr: Simple budget breakdown by department

 root["Budget"]
  engineering["Engineering"]
   salaries["Salaries"]
   tools["Tools"]
  marketing["Marketing"]
   ads["Advertising"]
   events["Events"]
```

---

## Example: Organization

```mermaid
treemap
 accTitle: Team Structure
 accDescr: Simple team hierarchy

 root["Company"]
  product["Product"]
   design["Design"]
   engineering["Engineering"]
  sales["Sales"]
   enterprise["Enterprise"]
   smb["SMB"]
```

---

## Copy-Paste Template

```mermaid
treemap
 accTitle: REPLACE WITH 3-8 WORD TITLE
 accDescr: REPLACE WITH 1-2 sentences describing what this treemap shows

 root["Root"]
  category_a["Category A"]
   item_1["Item 1"]
   item_2["Item 2"]
  category_b["Category B"]
   item_3["Item 3"]
```

---

## Tips

- 3–6 nodes is ideal for simple treemaps
- Keep hierarchy depth ≤ 2
- Use descriptive names
- Balance branches
