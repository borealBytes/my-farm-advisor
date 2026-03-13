<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# ER — Advanced (8–15 entities)

Full database schema. Use for documenting complete domain models with multiple relationships.

---

## Example: SaaS Platform Schema

```mermaid
erDiagram
    accTitle: SaaS Platform Database Schema
    accDescr: Complete SaaS platform data model showing organizations, users, subscriptions, billing, and audit trails

    ORGANIZATION {
        int id PK
        string name
        string slug
        string plan_type
        date created_at
        bool is_active
    }

    USER {
        int id PK
        int organization_id FK
        string email
        string name
        string role
        date last_login
        bool is_admin
    }

    SUBSCRIPTION {
        int id PK
        int organization_id FK
        int plan_id FK
        string status
        date start_date
        date end_date
        decimal monthly_cost
    }

    PLAN {
        int id PK
        string name
        string tier
        int max_users
        int max_projects
        decimal base_price
    }

    PROJECT {
        int id PK
        int organization_id FK
        int owner_id FK
        string name
        string description
        date created_at
        string status
    }

    INVITATION {
        int id PK
        int organization_id FK
        int invited_by FK
        string email
        string token
        date expires_at
        string status
    }

    AUDIT_LOG {
        int id PK
        int organization_id FK
        int user_id FK
        string action
        string entity_type
        int entity_id
        json changes
        date created_at
    }

    BILLING_EVENT {
        int id PK
        int organization_id FK
        int subscription_id FK
        string event_type
        decimal amount
        string currency
        date event_date
        string stripe_id
    }

    ORGANIZATION ||--o{ USER : "employs"
    ORGANIZATION ||--o{ PROJECT : "owns"
    ORGANIZATION ||--o{ SUBSCRIPTION : "has"
    ORGANIZATION ||--o{ INVITATION : "sends"
    ORGANIZATION ||--o{ AUDIT_LOG : "generates"
    ORGANIZATION ||--o{ BILLING_EVENT : "incurs"
    USER ||--o{ PROJECT : "owns"
    USER ||--o{ INVITATION : "sends"
    USER ||--o{ AUDIT_LOG : "performs"
    PLAN ||--o{ SUBSCRIPTION : "defines"
    SUBSCRIPTION ||--o{ BILLING_EVENT : "generates"
```

---

## Example: Content Management System

```mermaid
erDiagram
    accTitle: CMS Database Schema
    accDescr: Content management system showing articles, categories, tags, authors, comments, and media relationships

    AUTHOR {
        int id PK
        string username
        string email
        string bio
        string avatar_url
        date joined_at
        bool is_editor
    }

    CATEGORY {
        int id PK
        string name
        string slug
        string description
        int parent_id FK
    }

    ARTICLE {
        int id PK
        int author_id FK
        int category_id FK
        string title
        string slug
        text content
        string status
        date published_at
        date updated_at
        int view_count
    }

    TAG {
        int id PK
        string name
        string slug
        int usage_count
    }

    ARTICLE_TAG {
        int article_id PK, FK
        int tag_id PK, FK
    }

    COMMENT {
        int id PK
        int article_id FK
        int author_id FK
        int parent_id FK
        text content
        date created_at
        bool is_approved
    }

    MEDIA {
        int id PK
        int article_id FK
        string filename
        string mime_type
        int file_size
        string url
        date uploaded_at
    }

    AUTHOR ||--o{ ARTICLE : "writes"
    CATEGORY ||--o{ ARTICLE : "contains"
    CATEGORY ||--o{ CATEGORY : "has sub"
    ARTICLE ||--o{ COMMENT : "receives"
    AUTHOR ||--o{ COMMENT : "posts"
    COMMENT ||--o{ COMMENT : "replies to"
    ARTICLE ||--o{ MEDIA : "includes"
    ARTICLE ||--o{ ARTICLE_TAG : "tagged as"
    TAG ||--o{ ARTICLE_TAG : "labels"
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
        string status
    }

    ENTITY_C {
        int id PK
        int entity_b_id FK
        decimal amount
        date timestamp
    }

    LOOKUP_X {
        int id PK
        string code
        string label
    }

    LOOKUP_Y {
        int id PK
        string code
        string label
    }

    AUDIT_LOG {
        int id PK
        int entity_a_id FK
        string action
        json changes
        date created_at
    }

    ENTITY_A ||--o{ ENTITY_B : "has"
    ENTITY_B ||--|{ ENTITY_C : "contains"
    ENTITY_B }o--|| LOOKUP_X : "references"
    ENTITY_C }o--|| LOOKUP_Y : "references"
    ENTITY_A ||--o{ AUDIT_LOG : "generates"
```

---

## Tips

- Group related entities visually by placing them near each other
- Use junction tables (like ARTICLE_TAG) for many-to-many relationships
- Consider splitting into multiple diagrams if exceeding 15 entities
- Show audit/tracking tables to demonstrate data lineage
- Use consistent naming: `snake_case` for fields, `UPPER_CASE` for entities
