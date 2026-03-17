<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Class Diagrams

**Best for:** Class hierarchy, type relationships, object-oriented design, interface definitions.

---

## When to Use

- Object-oriented class hierarchies
- Interface and abstract class documentation
- Type system visualization
- Domain model documentation
- API response shape documentation

## When NOT to Use

- Database schema → use [ER](../er/index.md)
- Process steps → use [Flowchart](../flowchart/index.md)
- Service interactions → use [Sequence](../sequence/index.md)

---

## Syntax Reference

```
classDiagram
    accTitle: Title Here
    accDescr: Description here

    class ClassName {
        +publicField: Type
        -privateField: Type
        #protectedField: Type
        +publicMethod(param: Type): ReturnType
        -privateMethod(): void
    }

    ClassA --|> ClassB : inherits
    ClassA --* ClassB : composition
    ClassA --o ClassB : aggregation
    ClassA --> ClassB : association
    ClassA ..> ClassB : dependency
    ClassA ..|> InterfaceB : implements
```

**Relationship types:**

- `--|>` — inheritance (extends)
- `..|>` — implementation (implements)
- `--*` — composition (strong ownership)
- `--o` — aggregation (weak ownership)
- `-->` — association
- `..>` — dependency

---

## Complexity Levels

| File                               | Classes | Use case                        |
| ---------------------------------- | ------- | ------------------------------- |
| [simple.md](simple.md)             | 2–4     | Single hierarchy or interface   |
| [intermediate.md](intermediate.md) | 4–8     | Domain model with relationships |
| [advanced.md](advanced.md)         | 8–15    | Full system class hierarchy     |

---

## Key Tips

- Use `+` for public, `-` for private, `#` for protected
- Show only the most important fields and methods — not every getter/setter
- Use `<<interface>>` and `<<abstract>>` annotations
- Group related classes with `namespace` blocks
- Keep inheritance depth ≤3 levels in one diagram

## Anti-Patterns

```
%% ❌ Showing every field and method
class User {
    +id: int
    +email: string
    +password: string
    +createdAt: Date
    +updatedAt: Date
    +getId(): int
    +getEmail(): string
    +setEmail(email: string): void
    %% ... 20 more methods
}

%% ✅ Show only what matters for understanding
class User {
    +id: int
    +email: string
    +authenticate(password: string): bool
    +updateProfile(data: ProfileData): void
}
```
