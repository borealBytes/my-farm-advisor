<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# ER — Simple (2–4 entities)

Single relationship. Use for documenting a core entity pair.

---

## Example: User and Post

```mermaid
erDiagram
    accTitle: User Post Relationship
    accDescr: Simple one-to-many relationship between users and their blog posts

    USER {
        int id PK
        string email
        string name
        date created_at
    }
    POST {
        int id PK
        int user_id FK
        string title
        string content
        date published_at
    }

    USER ||--o{ POST : "writes"
```

---

## Example: Order and Customer

```mermaid
erDiagram
    accTitle: Customer Order Relationship
    accDescr: Customer to order relationship showing a customer can place many orders

    CUSTOMER {
        int id PK
        string email
        string name
    }
    ORDER {
        int id PK
        int customer_id FK
        string status
        decimal total
        date created_at
    }

    CUSTOMER ||--o{ ORDER : "places"
```

---

## Copy-Paste Template

```mermaid
erDiagram
    accTitle: REPLACE WITH 3-8 WORD TITLE
    accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

    PARENT_ENTITY {
        int id PK
        string name
        date created_at
    }
    CHILD_ENTITY {
        int id PK
        int parent_id FK
        string field
    }

    PARENT_ENTITY ||--o{ CHILD_ENTITY : "has"
```

---

## Tips

- `||--o{` = one parent to zero-or-many children (most common)
- `||--|{` = one parent to one-or-many children (required relationship)
- Relationship labels are verb phrases: `"places"`, `"contains"`, `"belongs to"`
- Always mark `PK` and `FK` explicitly
