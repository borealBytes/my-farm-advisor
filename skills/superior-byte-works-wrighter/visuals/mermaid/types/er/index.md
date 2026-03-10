<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# ER Diagrams

**Best for:** Database schema, data model documentation, entity relationships.

---

## When to Use

- Database schema documentation
- Data model design
- API response shape relationships
- Domain entity relationships
- Migration planning

## When NOT to Use

- Class hierarchy with methods → use [Class](../class/index.md)
- Process flows → use [Flowchart](../flowchart/index.md)
- Service interactions → use [Sequence](../sequence/index.md)

---

## Syntax Reference

```
erDiagram
    accTitle: Title Here
    accDescr: Description here

    ENTITY_A {
        type field_name PK
        type field_name FK
        type field_name
    }

    ENTITY_A ||--o{ ENTITY_B : "relationship label"
```

**Cardinality notation:**

- `||` — exactly one
- `o|` — zero or one
- `}|` — one or more
- `}o` — zero or more

**Relationship examples:**

- `||--||` — one to one
- `||--o{` — one to zero-or-many
- `||--|{` — one to one-or-many
- `}o--o{` — many to many

---

## Complexity Levels

| File                               | Entities | Use case             |
| ---------------------------------- | -------- | -------------------- |
| [simple.md](simple.md)             | 2–4      | Single relationship  |
| [intermediate.md](intermediate.md) | 4–8      | Domain model         |
| [advanced.md](advanced.md)         | 8–15     | Full database schema |

---

## Key Tips

- Use `UPPER_CASE` for entity names (convention)
- Mark `PK` and `FK` explicitly
- Relationship labels should be verb phrases: `"places"`, `"contains"`, `"belongs to"`
- Show only the most important fields — not every column
- Use `string`, `int`, `decimal`, `date`, `bool` for types

## Anti-Patterns

```
%% ❌ No field types or PK/FK markers
ENTITY {
    id
    name
    other_id
}

%% ✅ Explicit types and markers
ENTITY {
    int id PK
    string name
    int other_id FK
}
```
