<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Pie Chart — Intermediate (4–6 slices)

Use for multi-category breakdowns. Consider combining small values into "Other".

---

## Example: Development Time by Activity

```mermaid
pie showData
 accTitle: Development Time Distribution
 accDescr: Breakdown of developer time spent across different activities in a typical sprint

 "💻 Coding" : 35
 "🔍 Code Review" : 20
 "🐛 Debugging" : 15
 "📋 Meetings" : 15
 "📝 Documentation" : 10
 "⚙️ DevOps" : 5
```

---

## Example: Customer Feedback Categories

```mermaid
pie showData
 accTitle: Customer Feedback Distribution
 accDescr: Categorization of customer feedback tickets by type and priority

 "✨ Feature Request" : 30
 "🐛 Bug Report" : 25
 "❓ Support Question" : 20
 "👍 Praise" : 15
 "📊 Usage Question" : 8
 "🔄 Other" : 2
```

---

## Example: Infrastructure Costs

```mermaid
pie showData
 accTitle: Monthly Infrastructure Costs
 accDescr: Cloud infrastructure cost breakdown by service category

 "☁️ Compute" : 40
 "💾 Storage" : 25
 "🌐 CDN" : 15
 "🗄️ Database" : 12
 "🔒 Security" : 5
 "📊 Monitoring" : 3
```

---

## Copy-Paste Template

```mermaid
pie showData
 accTitle: REPLACE WITH 3-8 WORD TITLE
 accDescr: REPLACE WITH 1-2 sentences describing what this chart shows

 "📊 Category A" : 30
 "🔧 Category B" : 25
 "👥 Category C" : 20
 "📱 Category D" : 15
 "⚙️ Category E" : 7
 "🔄 Other" : 3
```

---

## Tips

- Combine slices under 5% into an "Other" category
- Use `showData` for percentage visibility
- 4–6 slices is the sweet spot for readability
- Group related categories with consistent emoji themes
