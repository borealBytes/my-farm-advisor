---
name: API Documentation
description: Guide and templates for writing clear, complete API reference documentation
version: 1.0.0
author: Omni Unified Writing
---

# API Documentation

API documentation is a contract between the API author and the developer using it. Good API docs reduce support burden, accelerate integration, and prevent misuse.

---

## ## Documentation Levels

| Level          | Audience               | Content                                         |
| -------------- | ---------------------- | ----------------------------------------------- |
| **Quickstart** | New users              | Get to first successful call in < 5 minutes     |
| **Reference**  | Integrating developers | Complete endpoint/method specification          |
| **Guides**     | Intermediate users     | Common patterns, authentication, error handling |
| **Changelog**  | All users              | Breaking changes, deprecations, new features    |

---

## ## Endpoint Reference Template

Every endpoint needs:

````markdown
## `METHOD /path/to/endpoint`

Brief description (1 sentence).

### Request

**Headers**

| Header          | Required | Description                    |
| --------------- | -------- | ------------------------------ |
| `Authorization` | Yes      | Bearer token: `Bearer <token>` |
| `Content-Type`  | Yes      | `application/json`             |

**Path Parameters**

| Parameter | Type   | Description                   |
| --------- | ------ | ----------------------------- |
| `id`      | string | Resource identifier (UUID v4) |

**Query Parameters**

| Parameter | Type    | Default | Description         |
| --------- | ------- | ------- | ------------------- |
| `limit`   | integer | 20      | Max results (1–100) |
| `offset`  | integer | 0       | Pagination offset   |

**Request Body**

| Field  | Type     | Required | Description                |
| ------ | -------- | -------- | -------------------------- |
| `name` | string   | Yes      | Display name (1–255 chars) |
| `tags` | string[] | No       | Classification tags        |

**Example Request**

```bash
curl -X POST https://api.example.com/v1/resources \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Resource",
    "tags": ["production", "critical"]
  }'
```
````

### Response

**Success: `201 Created`**

```json
{
  "id": "res_01HXYZ",
  "name": "My Resource",
  "tags": ["production", "critical"],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Response Fields**

| Field        | Type              | Description                |
| ------------ | ----------------- | -------------------------- |
| `id`         | string            | Unique resource identifier |
| `name`       | string            | Display name               |
| `created_at` | string (ISO 8601) | Creation timestamp         |

**Error Responses**

| Status | Code               | Description                            |
| ------ | ------------------ | -------------------------------------- |
| `400`  | `VALIDATION_ERROR` | Request body failed validation         |
| `401`  | `UNAUTHORIZED`     | Missing or invalid token               |
| `409`  | `CONFLICT`         | Resource with this name already exists |
| `429`  | `RATE_LIMITED`     | Exceeded rate limit (see headers)      |

````

---

## ## Authentication Section Template

```markdown
## Authentication

All API requests require a Bearer token in the `Authorization` header.

### Obtaining a Token

```bash
curl -X POST https://api.example.com/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{"client_id": "YOUR_ID", "client_secret": "YOUR_SECRET"}'
````

Response:

```json
{
  "access_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Token Scopes

| Scope              | Access                               |
| ------------------ | ------------------------------------ |
| `read:resources`   | GET endpoints                        |
| `write:resources`  | POST, PUT, PATCH endpoints           |
| `delete:resources` | DELETE endpoints                     |
| `admin`            | All endpoints including admin routes |

### Token Expiry

Tokens expire after 1 hour. Refresh using the `/v1/auth/refresh` endpoint.

````

---

## ## Error Reference Template

```markdown
## Error Handling

All errors follow a consistent format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "details": [
      {
        "field": "name",
        "message": "must be between 1 and 255 characters"
      }
    ],
    "request_id": "req_01HXYZ"
  }
}
````

### Error Codes

| Code               | HTTP Status | Description              | Resolution                                                    |
| ------------------ | ----------- | ------------------------ | ------------------------------------------------------------- |
| `VALIDATION_ERROR` | 400         | Request body invalid     | Check `details` for field-level errors                        |
| `UNAUTHORIZED`     | 401         | Token missing or expired | Re-authenticate                                               |
| `FORBIDDEN`        | 403         | Insufficient scope       | Request additional scopes                                     |
| `NOT_FOUND`        | 404         | Resource does not exist  | Verify the ID                                                 |
| `RATE_LIMITED`     | 429         | Too many requests        | Respect `Retry-After` header                                  |
| `INTERNAL_ERROR`   | 500         | Server error             | Retry with exponential backoff; contact support if persistent |

````

---

## ## Rate Limiting Section Template

```markdown
## Rate Limits

| Plan | Requests/minute | Requests/day |
|------|----------------|--------------|
| Free | 60 | 1,000 |
| Pro | 600 | 50,000 |
| Enterprise | Custom | Custom |

Rate limit status is returned in response headers:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Requests allowed per window |
| `X-RateLimit-Remaining` | Requests remaining in current window |
| `X-RateLimit-Reset` | Unix timestamp when window resets |

When rate limited, implement exponential backoff:

```python
import time
import random

def request_with_backoff(fn, max_retries=5):
    for attempt in range(max_retries):
        response = fn()
        if response.status_code != 429:
            return response
        wait = (2 ** attempt) + random.uniform(0, 1)
        time.sleep(wait)
    raise Exception("Max retries exceeded")
````

````

---

## ## Quickstart Template

```markdown
## Quickstart

Get your first successful API call in under 5 minutes.

### 1. Get your API key

Sign up at [dashboard.example.com](https://dashboard.example.com) and copy your API key.

### 2. Make your first request

```bash
export API_KEY="your_api_key_here"

curl https://api.example.com/v1/resources \
  -H "Authorization: Bearer $API_KEY"
````

Expected response:

```json
{ "data": [], "total": 0 }
```

### 3. Create a resource

```bash
curl -X POST https://api.example.com/v1/resources \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "My First Resource"}'
```

You're now ready to explore the full [API Reference](#reference).

```

---

## ## Writing Principles for API Docs

| Principle | Application |
|-----------|------------|
| **Show, don't tell** | Every endpoint has a working `curl` example |
| **Error-first** | Document error cases as thoroughly as success cases |
| **Versioning** | State the API version in every URL and document breaking changes |
| **Defaults** | Always state default values for optional parameters |
| **Types** | Be precise: `string (UUID v4)` not just `string` |

---

## ## See Also

- [user-guide.md](user-guide.md) — User-facing guides
- [onboarding-doc.md](onboarding-doc.md) — Developer onboarding
- [../../templates/software/api_spec.md](../../templates/software/api_spec.md) — API specification template
- [../../templates/system_design/api-design.md](../../templates/system_design/api-design.md) — API design document
```
