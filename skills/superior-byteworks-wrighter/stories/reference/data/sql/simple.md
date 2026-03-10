# SQL Simple Schema Template

Use this when you need a 2-4 table transactional schema.

## Includes

- Mermaid ER diagram block
- PostgreSQL DDL scaffold
- Basic indexes and constraints

## Starter

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```
