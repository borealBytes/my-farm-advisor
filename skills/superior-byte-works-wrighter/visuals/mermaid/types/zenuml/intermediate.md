<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# ZenUML — Intermediate (6–12 messages)

Multi-step interaction. Use for typical workflows.

---

## Example: User Registration

```mermaid
zenuml
 accTitle: User Registration Flow
 accDescr: Complete user registration with validation and storage

 @Actor User
 @Service API
 @Service Auth
 @Database DB
 @Service Email

 User -> API: POST /register
 API -> API: Validate input
 API -> Auth: Hash password
 Auth --> API: Hash
 API -> DB: Create user
 DB --> API: Success
 API -> Email: Send welcome
 Email --> API: Queued
 API --> User: 201 Created
```

---

## Example: Order Processing

```mermaid
zenuml
 accTitle: Order Processing Flow
 accDescr: Order processing with inventory and payment

 @Actor Customer
 @Service Order
 @Service Inventory
 @Service Payment
 @Database DB

 Customer -> Order: Place order
 Order -> Inventory: Check stock
 Inventory --> Order: Available
 Order -> Payment: Charge
 Payment --> Order: Success
 Order -> Inventory: Reserve
 Order -> DB: Save order
 Order --> Customer: Confirmation
```

---

## Example: File Upload

```mermaid
zenuml
 accTitle: File Upload Process
 accDescr: File upload with validation and storage

 @Actor User
 @Service API
 @Service Validator
 @Service Storage
 @Database DB

 User -> API: Upload file
 API -> Validator: Check type
 Validator --> API: Valid
 API -> Validator: Check size
 Validator --> API: OK
 API -> Storage: Store file
 Storage --> API: URL
 API -> DB: Save metadata
 API --> User: Success
```

---

## Copy-Paste Template

```mermaid
zenuml
 accTitle: REPLACE WITH 3-8 WORD TITLE
 accDescr: REPLACE WITH 1-2 sentences describing what this sequence shows

 @Actor User
 @Service API
 @Service Service
 @Database DB

 User -> API: Request
 API -> API: Validate
 API -> Service: Process
 Service -> DB: Query
 DB --> Service: Data
 Service --> API: Result
 API --> User: Response
```

---

## Tips

- 6–12 messages covers most workflows
- Show self-calls with ->
- Group related operations
- Include validation steps
