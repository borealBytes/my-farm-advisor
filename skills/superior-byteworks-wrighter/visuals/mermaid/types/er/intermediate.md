<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# ER — Intermediate (4–8 entities)

Domain model. Use for documenting a bounded context's data model.

---

## Example: E-Commerce Schema

```mermaid
erDiagram
    accTitle: E-Commerce Core Schema
    accDescr: Core e-commerce data model showing customers, orders, products, and line items with relationships

    CUSTOMER {
        int id PK
        string email
        string name
        string address
    }
    ORDER {
        int id PK
        int customer_id FK
        string status
        decimal total
        date created_at
    }
    LINE_ITEM {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal unit_price
    }
    PRODUCT {
        int id PK
        int category_id FK
        string name
        decimal price
        int stock_count
    }
    CATEGORY {
        int id PK
        string name
        string slug
    }

    CUSTOMER ||--o{ ORDER : "places"
    ORDER ||--|{ LINE_ITEM : "contains"
    LINE_ITEM }o--|| PRODUCT : "references"
    PRODUCT }o--|| CATEGORY : "belongs to"
```

---

## Copy-Paste Template

```mermaid
erDiagram
    accTitle: REPLACE WITH 3-8 WORD TITLE
    accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

    ENTITY_A {
        int id PK
        string name
        date created_at
    }
    ENTITY_B {
        int id PK
        int entity_a_id FK
        string field
    }
    ENTITY_C {
        int id PK
        int entity_b_id FK
        decimal amount
    }
    LOOKUP_TABLE {
        int id PK
        string code
        string label
    }

    ENTITY_A ||--o{ ENTITY_B : "has"
    ENTITY_B ||--|{ ENTITY_C : "contains"
    ENTITY_C }o--|| LOOKUP_TABLE : "references"
```

---

## Tips

- Show only the most important fields — not every column
- Group related entities visually by placing them near each other
- Use consistent naming: `snake_case` for fields, `UPPER_CASE` for entities
- Mark all foreign keys with `FK`
