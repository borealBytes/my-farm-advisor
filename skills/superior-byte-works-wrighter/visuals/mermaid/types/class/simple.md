<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Class — Simple (2–4 classes)

Single hierarchy or interface. Use for quick type documentation.

---

## Example: Animal Hierarchy

```mermaid
classDiagram
    accTitle: Animal Class Hierarchy
    accDescr: Simple inheritance hierarchy showing Animal base class with Dog and Cat subclasses

    class Animal {
        +name: string
        +speak(): string
    }
    class Dog {
        +breed: string
        +fetch(): void
    }
    class Cat {
        +indoor: bool
        +purr(): void
    }

    Animal <|-- Dog
    Animal <|-- Cat
```

---

## Example: Repository Interface

```mermaid
classDiagram
    accTitle: Repository Interface Pattern
    accDescr: Repository pattern showing interface definition and concrete implementation relationship

    class Repository~T~ {
        <<interface>>
        +findById(id: string): T
        +save(entity: T): void
        +delete(id: string): void
    }
    class UserRepository {
        +findById(id: string): User
        +findByEmail(email: string): User
        +save(user: User): void
        +delete(id: string): void
    }

    Repository <|.. UserRepository
```

---

## Copy-Paste Template

```mermaid
classDiagram
    accTitle: REPLACE WITH 3-8 WORD TITLE
    accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

    class BaseClass {
        +publicField: Type
        -privateField: Type
        +publicMethod(): ReturnType
    }
    class ChildClass {
        +additionalField: Type
        +overriddenMethod(): ReturnType
    }

    BaseClass <|-- ChildClass
```

---

## Tips

- Show only the most important fields and methods
- Use `<<interface>>` and `<<abstract>>` annotations for clarity
- `<|--` for inheritance (arrow points to parent)
- `..|>` for implementation (arrow points to interface)
