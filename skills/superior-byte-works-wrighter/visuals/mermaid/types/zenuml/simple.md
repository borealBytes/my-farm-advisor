<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# ZenUML — Simple (3–6 messages)

Basic interaction. Use for simple API calls.

---

## Example: API Call

```mermaid
zenuml
 accTitle: Simple API Request
 accDescr: Basic API request and response flow

 @Actor User
 @Service API

 User -> API: GET /users
 API --> User: 200 OK
```

---

## Example: Database Query

```mermaid
zenuml
 accTitle: Database Query Flow
 accDescr: Simple database query sequence

 @Service App
 @Database DB

 App -> DB: SELECT * FROM users
 DB --> App: Result set
```

---

## Example: Cache Check

```mermaid
zenuml
 accTitle: Cache Lookup
 accDescr: Simple cache lookup with fallback

 @Service App
 @Service Cache
 @Database DB

 App -> Cache: Get key
 Cache --> App: Miss
 App -> DB: Query
 DB --> App: Data
```

---

## Copy-Paste Template

```mermaid
zenuml
 accTitle: REPLACE WITH 3-8 WORD TITLE
 accDescr: REPLACE WITH 1-2 sentences describing what this sequence shows

 @Actor User
 @Service Service
 @Database DB

 User -> Service: Request
 Service -> DB: Query
 DB --> Service: Result
 Service --> User: Response
```

---

## Tips

- 3–6 messages is ideal for simple flows
- Declare participants with @Type
- Use -> for request, --> for response
- Keep messages concise
