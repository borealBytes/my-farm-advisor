<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# ZenUML — Advanced (12–20 messages)

Complex workflow. Use for detailed process documentation.

---

## Example: Payment Processing

```mermaid
zenuml
 accTitle: Payment Processing Workflow
 accDescr: Complete payment processing with fraud check and reconciliation

 @Actor Customer
 @Service Gateway
 @Service Fraud
 @Service Processor
 @Service Bank
 @Database DB
 @Service Notification

 Customer -> Gateway: Submit payment
 Gateway -> Fraud: Check risk
 Fraud --> Gateway: Low risk
 Gateway -> Processor: Process
 Processor -> Bank: Authorize
 Bank --> Processor: Approved
 Processor --> Gateway: Success
 Gateway -> DB: Save transaction
 Gateway -> Notification: Send receipt
 Notification --> Customer: Email
 Gateway --> Customer: Confirmation
```

---

## Example: E-commerce Checkout

```mermaid
zenuml
 accTitle: E-commerce Checkout Flow
 accDescr: Complete checkout with cart, shipping, and payment

 @Actor Customer
 @Service Cart
 @Service Shipping
 @Service Tax
 @Service Payment
 @Service Inventory
 @Database DB
 @Service Email

 Customer -> Cart: Checkout
 Cart -> Inventory: Verify stock
 Inventory --> Cart: Available
 Cart -> Shipping: Get rates
 Shipping --> Cart: Options
 Cart -> Tax: Calculate
 Tax --> Cart: Amount
 Cart --> Customer: Review
 Customer -> Cart: Confirm
 Cart -> Payment: Charge
 Payment --> Cart: Success
 Cart -> Inventory: Reserve
 Cart -> DB: Create order
 Cart -> Email: Send confirmation
 Email --> Customer: Order details
 Cart --> Customer: Success
```

---

## Example: Multi-Service Operation

```mermaid
zenuml
 accTitle: Distributed Transaction Flow
 accDescr: Complex operation across multiple services

 @Actor User
 @Service API
 @Service Auth
 @Service Orders
 @Service Payments
 @Service Inventory
 @Service Shipping
 @Database DB
 @Service Events

 User -> API: Create order
 API -> Auth: Verify token
 Auth --> API: Valid
 API -> Orders: Create
 Orders -> Inventory: Check
 Inventory --> Orders: OK
 Orders -> Payments: Charge
 Payments --> Orders: Success
 Orders -> Shipping: Schedule
 Shipping --> Orders: Label
 Orders -> DB: Persist
 Orders -> Events: Publish
 Orders --> API: Order ID
 API --> User: Created
```

---

## Copy-Paste Template

```mermaid
zenuml
 accTitle: REPLACE WITH 3-8 WORD TITLE
 accDescr: REPLACE WITH 1-2 sentences describing what this sequence shows

 @Actor User
 @Service API
 @Service ServiceA
 @Service ServiceB
 @Service ServiceC
 @Database DB

 User -> API: Request
 API -> ServiceA: Step 1
 ServiceA -> ServiceB: Step 2
 ServiceB -> DB: Query
 DB --> ServiceB: Data
 ServiceB --> ServiceA: Result
 ServiceA -> ServiceC: Step 3
 ServiceC --> ServiceA: Done
 ServiceA --> API: Complete
 API --> User: Response
```

---

## Tips

- At 12+ messages, consider grouping
- Use clear service names
- Show async operations
- Include error handling paths
