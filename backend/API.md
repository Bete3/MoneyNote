# MoneyNote API handoff

## Local URLs

- API base URL: `http://localhost:5000`
- Interactive documentation: `http://localhost:5000/api/docs`
- OpenAPI JSON: `http://localhost:5000/api/openapi.json`
- Health check: `GET http://localhost:5000/api/health`

The frontend should use the deployed backend URL instead of `http://localhost:5000`
when the application is deployed.

## Authentication

1. Register with `POST /api/auth/register`, or log in with `POST /api/auth/login`.
2. Read the `token` from the response.
3. Send it on protected requests:

```http
Authorization: Bearer <token>
```

The token is valid for the duration configured by `JWT_EXPIRES_IN` in the backend
environment. A missing or expired token returns `401`.

In Swagger UI, click **Authorize**, paste the token only (without manually
typing `Bearer`), and click **Authorize**.

## Main endpoints

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Log in and receive a JWT |
| GET | `/api/auth/me` | Yes | Get the current user |
| GET | `/api/records` | Yes | List records |
| POST | `/api/records` | Yes | Create a lent or borrowed record |
| GET | `/api/records/summary` | Yes | Get totals |
| GET | `/api/records/:id` | Yes | Get one record |
| PUT | `/api/records/:id` | Yes | Update a record |
| POST | `/api/records/:id/repay` | Yes | Add a repayment |
| DELETE | `/api/records/:id` | Yes | Delete a record |
| GET | `/api/messages` | Yes | List notifications |
| PATCH | `/api/messages/:id/read` | Yes | Mark one notification as read |
| PATCH | `/api/messages/read-all` | Yes | Mark all notifications as read |

## Create record example

```json
{
  "type": "lent",
  "personName": "Dawit",
  "amount": 500,
  "reason": "Lunch",
  "date": "2026-10-18T00:00:00.000Z"
}
```

`type` must be `lent` or `borrowed`. Amounts must be positive. Record status is
calculated by the backend: `pending`, `partial`, or `paid`.

## Error handling

Errors use this shape:

```json
{
  "message": "Error description"
}
```

The frontend should handle at least these status codes:

- `400`: invalid request data
- `401`: missing, invalid, or expired JWT
- `404`: requested record or message does not exist
- `409`: email is already registered
- `500`: unexpected backend or database error
