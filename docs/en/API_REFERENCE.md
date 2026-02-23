# API Reference — Mi Colombia Digital

## Overview

The Mi Colombia Digital platform exposes REST API endpoints through Next.js API routes. All endpoints require authentication unless otherwise noted.

## Base URL

```
Development: http://localhost:3000/api
Production:  https://your-domain.com/api
```

## Authentication

All authenticated endpoints require a valid Supabase JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

---

## Endpoints

### Auth

#### POST /api/auth/login
Authenticate a citizen and receive a session token.

**Request Body:**
```json
{
  "email": "citizen@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "citizen@example.com"
  },
  "session": {
    "access_token": "jwt...",
    "refresh_token": "token..."
  }
}
```

#### POST /api/auth/register
Register a new citizen account.

**Request Body:**
```json
{
  "email": "citizen@example.com",
  "password": "securepassword",
  "document_type": "CC",
  "document_number": "1234567890",
  "first_name": "Juan",
  "last_name": "Rodriguez",
  "date_of_birth": "1990-03-15",
  "phone": "+573001234567"
}
```

#### POST /api/auth/logout
End the current session.

#### POST /api/auth/refresh
Refresh an expired access token.

---

### Citizens

#### GET /api/citizens/me
Get the authenticated citizen's profile.

**Response (200):**
```json
{
  "id": "uuid",
  "document_type": "CC",
  "document_number": "1234567890",
  "first_name": "Juan",
  "last_name": "Rodriguez",
  "date_of_birth": "1990-03-15",
  "verification_status": "verified",
  "country_id": "CO"
}
```

#### PATCH /api/citizens/me
Update the authenticated citizen's profile.

---

### Documents

#### GET /api/documents
Get all documents for the authenticated citizen.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | string | Filter by document type (CC, CE, LC, PP, RUT) |
| `status` | string | Filter by status (active, expired, suspended) |

**Response (200):**
```json
{
  "documents": [
    {
      "id": "uuid",
      "document_type": "CC",
      "document_number": "1234567890",
      "issuing_authority": "Registraduria Nacional",
      "status": "active",
      "qr_code_data": "...",
      "issue_date": "2020-01-15",
      "expiry_date": "2030-01-15"
    }
  ]
}
```

#### GET /api/documents/:id
Get a specific document by ID.

#### GET /api/documents/:id/qr
Generate a fresh QR code for a document.

**Response (200):**
```json
{
  "qr_data": "encoded_string...",
  "generated_at": "2026-02-22T10:00:00Z",
  "expires_at": "2026-02-23T10:00:00Z",
  "signature": "digital_signature..."
}
```

---

### Vehicles

#### GET /api/vehicles
Get all vehicles for the authenticated citizen.

#### GET /api/vehicles/:id
Get a specific vehicle by ID.

---

### Health

#### GET /api/health
Get health records for the authenticated citizen.

#### GET /api/health/vaccinations
Get vaccination records.

---

### Services

#### GET /api/services
Get social program enrollments for the authenticated citizen.

#### GET /api/appointments
Get upcoming appointments.

#### POST /api/appointments
Book a new appointment.

---

### Verification (Public)

#### POST /api/verify
Verify a QR code (used by officials). No auth required.

**Request Body:**
```json
{
  "qr_data": "encoded_string...",
  "verification_method": "qr_scan"
}
```

**Response (200):**
```json
{
  "valid": true,
  "document_type": "CC",
  "citizen_name": "Juan Carlos Rodriguez",
  "document_number": "123****890",
  "status": "active",
  "verified_at": "2026-02-22T10:00:00Z"
}
```

---

### Admin Endpoints

All admin endpoints require an admin JWT token with appropriate role.

#### GET /api/admin/citizens
List all citizens (paginated).

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |
| `search` | string | Search by name or document number |
| `status` | string | Filter by verification status |

#### GET /api/admin/citizens/:id
Get full citizen details (admin view).

#### POST /api/admin/documents/issue
Issue a new digital document to a citizen.

#### GET /api/admin/analytics
Get platform analytics data.

#### GET /api/admin/verification-logs
Get verification history log.

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Invalid request body |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

## Rate Limiting

- **Citizens**: 100 requests/minute
- **Admin**: 500 requests/minute
- **Verification**: 1000 requests/minute (higher for officials)
