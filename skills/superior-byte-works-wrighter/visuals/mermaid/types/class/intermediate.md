<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Class — Intermediate (4–8 classes)

Domain model with relationships. Use for documenting a bounded context or module.

---

## Example: E-Commerce Domain Model

```mermaid
classDiagram
    accTitle: E-Commerce Domain Model
    accDescr: Core e-commerce domain showing Order, Customer, Product, and LineItem with their relationships

    class Customer {
        +id: string
        +email: string
        +name: string
        +placeOrder(items: LineItem[]): Order
    }
    class Order {
        +id: string
        +status: OrderStatus
        +total: decimal
        +confirm(): void
        +cancel(): void
    }
    class LineItem {
        +quantity: int
        +unitPrice: decimal
        +subtotal(): decimal
    }
    class Product {
        +id: string
        +name: string
        +price: decimal
        +inStock(): bool
    }
    class OrderStatus {
        <<enumeration>>
        PENDING
        CONFIRMED
        SHIPPED
        DELIVERED
        CANCELLED
    }

    Customer "1" --> "0..*" Order : places
    Order "1" *-- "1..*" LineItem : contains
    LineItem "0..*" --> "1" Product : references
    Order --> OrderStatus : has
```

---

## Example: Authentication System

```mermaid
classDiagram
    accTitle: Authentication System Classes
    accDescr: Authentication system showing User, Session, Token, and Permission class relationships

    class User {
        +id: string
        +email: string
        -passwordHash: string
        +authenticate(password: string): Session
        +hasPermission(perm: string): bool
    }
    class Session {
        +id: string
        +userId: string
        +expiresAt: Date
        +isValid(): bool
        +refresh(): void
    }
    class Token {
        +value: string
        +type: TokenType
        +expiresAt: Date
        +verify(): bool
    }
    class Permission {
        <<enumeration>>
        READ
        WRITE
        ADMIN
    }

    User "1" --> "0..*" Session : has
    Session --> Token : uses
    User --> Permission : granted
```

---

## Copy-Paste Template

```mermaid
classDiagram
    accTitle: REPLACE WITH 3-8 WORD TITLE
    accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

    class EntityA {
        +id: string
        +field: Type
        +method(): ReturnType
    }
    class EntityB {
        +id: string
        +entityAId: string
        +method(): ReturnType
    }
    class ValueObject {
        +field: Type
        +validate(): bool
    }
    class StatusEnum {
        <<enumeration>>
        ACTIVE
        INACTIVE
        PENDING
    }

    EntityA "1" --> "0..*" EntityB : has
    EntityB --> ValueObject : uses
    EntityA --> StatusEnum : has
```

---

## Tips

- Use multiplicity labels: `"1"`, `"0..*"`, `"1..*"`
- `*--` for composition (strong ownership, child can't exist without parent)
- `o--` for aggregation (weak ownership, child can exist independently)
- `<<enumeration>>` for enum types
- `<<abstract>>` for abstract classes
