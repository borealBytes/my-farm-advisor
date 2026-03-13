---
name: API Design Document
description: Template for designing RESTful and GraphQL APIs before implementation
version: 1.0.0
author: Omni Unified Writing
---

# API Design: [API Name]

| Field        | Value                        |
| ------------ | ---------------------------- |
| **Status**   | Draft / In Review / Approved |
| **Author**   | [Name]                       |
| **Date**     | [YYYY-MM-DD]                 |
| **Version**  | v1                           |
| **Base URL** | `https://api.example.com/v1` |

---

## ## Design Principles

[State the principles guiding this API's design. Examples:]

1. **REST over RPC** — Resources are nouns; HTTP verbs express actions
2. **Consistent naming** — `snake_case` for JSON fields; `kebab-case` for URL paths
3. **Versioning** — URL versioning (`/v1/`) for breaking changes
4. **Pagination** — All list endpoints paginate with `limit`/`offset` or cursor
5. **Errors** — Consistent error format with machine-readable codes

---

## ## Resource Model

```mermaid
flowchart TD
    accTitle: API Resource Hierarchy
    accDescr: Hierarchical diagram showing the API resource model and relationships.

    ORG["/organizations"] --> MEM["/organizations/:id/members"]
    ORG --> RES["/organizations/:id/resources"]
    RES --> ATT["/organizations/:id/resources/:id/attachments"]
    USR["/users"] --> ME["/users/me"]
```

### Resource naming

| Resource            | URL pattern                  | Notes             |
| ------------------- | ---------------------------- | ----------------- |
| Organizations       | `/organizations`             | Plural noun       |
| Single organization | `/organizations/:id`         | UUID              |
| Members of org      | `/organizations/:id/members` | Nested resource   |
| Current user        | `/users/me`                  | Convenience alias |

---

## ## Authentication

**Method:** Bearer token (JWT)

```
Authorization: Bearer eyJhbGciOiJSUzI1NiJ9...
```

**Token claims:**

| Claim    | Type     | Description                |
| -------- | -------- | -------------------------- |
| `sub`    | string   | User ID (UUID)             |
| `org_id` | string   | Active organization ID     |
| `scope`  | string[] | Granted scopes             |
| `exp`    | number   | Expiry (Unix timestamp)    |
| `iat`    | number   | Issued at (Unix timestamp) |

**Scopes:**

| Scope    | Access               |
| -------- | -------------------- |
| `read`   | GET endpoints        |
| `write`  | POST, PUT, PATCH     |
| `delete` | DELETE endpoints     |
| `admin`  | Admin-only endpoints |

---

## ## Common Patterns

### Pagination

All list endpoints support cursor-based pagination:

**Request:**

```
GET /v1/resources?limit=20&cursor=eyJpZCI6IjEyMyJ9
```

**Response:**

```json
{
  "data": [...],
  "pagination": {
    "limit": 20,
    "next_cursor": "eyJpZCI6IjE0MyJ9",
    "has_more": true,
    "total": 847
  }
}
```

### Filtering and sorting

```
GET /v1/resources?filter[status]=active&sort=-created_at&limit=20
```

| Parameter | Format                                     | Example                 |
| --------- | ------------------------------------------ | ----------------------- |
| Filter    | `filter[field]=value`                      | `filter[status]=active` |
| Sort      | `sort=field` (asc) or `sort=-field` (desc) | `sort=-created_at`      |
| Fields    | `fields=id,name,created_at`                | Sparse fieldsets        |

### Error format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "name",
        "code": "REQUIRED",
        "message": "name is required"
      }
    ],
    "request_id": "req_01HXYZ"
  }
}
```

**Error codes:**

| Code               | HTTP | Description                 |
| ------------------ | ---- | --------------------------- |
| `VALIDATION_ERROR` | 400  | Request body/params invalid |
| `UNAUTHORIZED`     | 401  | Missing or invalid token    |
| `FORBIDDEN`        | 403  | Insufficient permissions    |
| `NOT_FOUND`        | 404  | Resource not found          |
| `CONFLICT`         | 409  | Duplicate or state conflict |
| `RATE_LIMITED`     | 429  | Rate limit exceeded         |
| `INTERNAL_ERROR`   | 500  | Server error                |

---

## ## Endpoint Specifications

### Resources

#### `GET /v1/resources`

List resources for the authenticated organization.

**Query parameters:**

| Parameter        | Type    | Default       | Description              |
| ---------------- | ------- | ------------- | ------------------------ |
| `limit`          | integer | 20            | Results per page (1–100) |
| `cursor`         | string  | —             | Pagination cursor        |
| `filter[status]` | string  | —             | `active`, `archived`     |
| `sort`           | string  | `-created_at` | Sort field               |

**Response `200 OK`:**

```json
{
  "data": [
    {
      "id": "res_01HXYZ",
      "name": "My Resource",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "next_cursor": "eyJpZCI6InJlc18wMUhYWVoifQ==",
    "has_more": false,
    "total": 1
  }
}
```

---

#### `POST /v1/resources`

Create a new resource.

**Request body:**

```json
{
  "name": "My Resource",
  "description": "Optional description",
  "metadata": {}
}
```

| Field         | Type   | Required | Validation            |
| ------------- | ------ | -------- | --------------------- |
| `name`        | string | Yes      | 1–255 characters      |
| `description` | string | No       | Max 10,000 characters |
| `metadata`    | object | No       | Max 64 KB             |

**Response `201 Created`:**

```json
{
  "data": {
    "id": "res_01HXYZ",
    "name": "My Resource",
    "description": null,
    "metadata": {},
    "status": "active",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

#### `GET /v1/resources/:id`

Get a single resource by ID.

**Response `200 OK`:** Same as single item in list response.

**Response `404 Not Found`:**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "request_id": "req_01HXYZ"
  }
}
```

---

#### `PATCH /v1/resources/:id`

Partially update a resource. Only provided fields are updated.

**Request body:**

```json
{
  "name": "Updated Name"
}
```

**Response `200 OK`:** Updated resource object.

---

#### `DELETE /v1/resources/:id`

Soft-delete a resource.

**Response `204 No Content`:** Empty body.

---

## ## Rate Limits

| Tier       | Requests/minute | Requests/day |
| ---------- | --------------- | ------------ |
| Free       | 60              | 1,000        |
| Pro        | 600             | 50,000       |
| Enterprise | Custom          | Custom       |

**Headers returned:**

| Header                  | Description              |
| ----------------------- | ------------------------ |
| `X-RateLimit-Limit`     | Limit for current window |
| `X-RateLimit-Remaining` | Remaining requests       |
| `X-RateLimit-Reset`     | Window reset time (Unix) |

---

## ## Versioning Strategy

| Change type         | Versioning approach                     |
| ------------------- | --------------------------------------- |
| New endpoints       | No version bump                         |
| New optional fields | No version bump                         |
| New required fields | Minor version bump + deprecation period |
| Removed fields      | Major version bump (v1 → v2)            |
| Changed field types | Major version bump                      |

**Deprecation policy:** Deprecated endpoints/fields are supported for 12 months after announcement.

---

## ## See Also

- [architecture-spec.md](architecture-spec.md) — System architecture
- [database-schema.md](database-schema.md) — Database schema
- [../../prose/technical/api-documentation.md](../../prose/technical/api-documentation.md) — Writing API docs
- [../../templates/software/api_spec.md](../../templates/software/api_spec.md) — API specification template
