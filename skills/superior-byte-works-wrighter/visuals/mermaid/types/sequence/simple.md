<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Sequence — Simple (2–3 participants)

Single request/response flows. Use for basic API calls and simple interactions.

---

## Example: API Request

```mermaid
sequenceDiagram
    accTitle: Basic API Request Response
    accDescr: Simple two-participant API request and response between client and server

    actor Client as 👤 Client
    participant API as 🌐 API

    Client->>API: GET /users/123
    API-->>Client: 200 OK { user data }
```

---

## Example: Database Query

```mermaid
sequenceDiagram
    accTitle: Service Database Query Flow
    accDescr: Three-participant flow showing service querying database and returning results to caller

    actor User as 👤 User
    participant App as 🌐 App
    participant DB as 💾 Database

    User->>App: Request user profile
    App->>DB: SELECT * FROM users WHERE id=?
    DB-->>App: Return user row
    App-->>User: Return profile JSON
```

---

## Example: Webhook Delivery

```mermaid
sequenceDiagram
    accTitle: Webhook Delivery Confirmation
    accDescr: Webhook delivery flow from event trigger through delivery to acknowledgment

    participant Source as ⚡ Event source
    participant Hook as 🔌 Webhook handler
    participant Target as 🌐 Target service

    Source->>Hook: Emit event
    Hook->>Target: POST /webhook
    Target-->>Hook: 200 OK
    Hook-->>Source: Delivery confirmed
```

---

## Copy-Paste Template

```mermaid
sequenceDiagram
    accTitle: REPLACE WITH 3-8 WORD TITLE
    accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

    actor User as 👤 User
    participant App as 🌐 App
    participant DB as 💾 Database

    User->>App: Send request
    App->>DB: Query data
    DB-->>App: Return results
    App-->>User: Send response
```

---

## Tips

- `->>` for requests (solid), `-->>` for responses (dashed)
- Use `actor` for humans, `participant` for systems
- Alias with `as` to add emoji: `participant App as 🌐 App`
- Keep it simple — 2–3 participants, 4–8 messages
