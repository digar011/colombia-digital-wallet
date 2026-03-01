# Product Overview -- Mi Colombia Digital

## Vision

Mi Colombia Digital is a Citizen Digital Wallet platform that centralizes government documents and services into a single Progressive Web App (PWA). Modeled after Argentina's successful miArgentina platform (21M+ users), it is adapted for Colombia's government systems and designed as a white-label, multi-country framework.

Instead of carrying multiple physical documents and visiting different government offices, Colombian citizens access everything from their smartphone -- even offline.

---

## Target Users

| User Type | Description | Primary Actions |
|-----------|-------------|-----------------|
| **Citizens** | Colombian citizens (21M+ potential users) | View digital ID, vehicle registration, health cards; present QR codes for verification |
| **Government Officials** | Field officers, police, inspectors | Scan citizen QR codes to verify document authenticity |
| **Agency Staff** | Government agency employees across 6 agencies | Manage documents, look up citizens, handle verification requests |
| **Admin Operators** | Platform administrators | Issue documents, manage citizen accounts, view analytics, configure system |

---

## Features

### Citizen Modules

| Module | Route | Description |
|--------|-------|-------------|
| **Cedula Digital** | `/documents/identity` | View, share, and verify Cedula de Ciudadania digitally. Displays Tarjeta de Identidad for minors (under 18). |
| **Vehiculos (RUNT)** | `/documents/vehicles` | Vehicle registration, SOAT (mandatory insurance), technomechanical certificates. Integrates with RUNT data model. |
| **Salud (EPS/ADRES)** | `/documents/health` | EPS affiliation card, vaccination records, SISBEN score, chronic condition alerts. |
| **Trabajo y Tributario (DIAN)** | `/documents/work` | RUT (tax ID), employment certificates, pension fund, ARL, cesantias information. |
| **Familia** | `/documents/family` | Linked family members, children's Tarjeta de Identidad, guardianship records. |
| **Programas Sociales** | `/services` | SISBEN, Familias en Accion, Ingreso Solidario, Colombia Mayor enrollment status. Appointment booking at `/services/book`. |
| **Emergencias** | `/emergency` | One-tap calling for 123, police, fire, ambulance with country-specific emergency numbers. |
| **Perfil** | `/profile` | Citizen profile management, notification preferences, account settings. |

### QR Code Verification

Documents include scannable QR codes with digital signatures. Government officials scan the QR to verify authenticity in real time. QR codes are pre-generated and valid for 24 hours, enabling offline verification.

### Offline Mode (PWA)

Core documents are cached locally for offline viewing. Citizens in areas with poor connectivity can still present their Cedula, health card, and vehicle registration without an internet connection. The app is installable as a PWA via "Add to Home Screen."

### Government Admin Dashboard

| Page | Route | Capabilities |
|------|-------|-------------|
| Dashboard | `/admin/dashboard` | Platform metrics: registered citizens, documents issued, verification activity, system health |
| Users | `/admin/users` | Search, view, and manage citizen accounts. Detail view at `/admin/users/[id]` |
| Documents | `/admin/documents` | Issue, review, suspend, and revoke digital documents |
| Analytics | `/admin/analytics` | Registration trends, verification volumes, geographic distribution, program enrollment |
| Tickets | `/admin/tickets` | Support ticket system for citizen inquiries |
| Settings | `/admin/settings` | Platform configuration, notification rules, admin access management |

### Agency Portal

The Agency Portal (`/agency`) provides a dedicated interface for government agency staff. It supports 3 countries with 6 agencies per country.

**Supported Countries and Agencies:**

| Country | Identity | Vehicles | Tax | Health | Social Services | Technology |
|---------|----------|----------|-----|--------|-----------------|------------|
| Colombia | RNEC | RUNT | DIAN | ADRES | DPS | MinTIC |
| Ecuador | Registro Civil | ANT | SRI | IESS | MIES | MINTEL |
| Guatemala | RENAP | SAT-Vehiculos | SAT | IGSS | MIDES | CIV |

**Agency Keys:** `identity`, `vehicles`, `tax`, `health`, `socialServices`, `technology`

**Agency Features:**
- Institutional login (`.gov.co` email credentials)
- Sidebar dropdown to switch between agencies
- Document management (issue, revoke documents for the agency's domain)
- Citizen lookup (search by cedula number, name, or other identifiers)
- Verification request queue (approve/reject pending requests)
- Agency-specific analytics dashboard
- Agency configuration settings

---

## Multi-Country Support

The platform is designed as a white-label framework. Each country deployment is configured via a single JSON file in `src/config/countries/`:

| Config Area | Examples |
|-------------|----------|
| Colors | National flag colors for branding |
| Documents | Document types, formats, issuing authorities |
| Agencies | Government agencies with names and descriptions |
| Emergency Numbers | Country-specific emergency contacts |
| Social Programs | Available government programs |
| Health System | Healthcare system structure |

Currently configured: **Colombia** (primary), **Ecuador** (proof-of-concept), **Guatemala** (proof-of-concept).

---

## API Surface (Planned)

> **Status:** API routes are planned and documented but not yet implemented. The app currently uses client-side mock data and direct Supabase client calls.

See `docs/en/API_REFERENCE.md` for the full planned API contract.

| Group | Endpoints | Auth Required |
|-------|-----------|---------------|
| Auth | `POST /api/auth/login`, `register`, `logout`, `refresh` | No (login/register) |
| Citizens | `GET/PATCH /api/citizens/me` | Yes (citizen JWT) |
| Documents | `GET /api/documents`, `GET /api/documents/:id`, `GET /api/documents/:id/qr` | Yes (citizen JWT) |
| Vehicles | `GET /api/vehicles`, `GET /api/vehicles/:id` | Yes (citizen JWT) |
| Health | `GET /api/health`, `GET /api/health/vaccinations` | Yes (citizen JWT) |
| Services | `GET /api/services`, `GET/POST /api/appointments` | Yes (citizen JWT) |
| Verification | `POST /api/verify` | No (public) |
| Admin | `GET /api/admin/citizens`, `GET /api/admin/citizens/:id`, `POST /api/admin/documents/issue`, `GET /api/admin/analytics`, `GET /api/admin/verification-logs` | Yes (admin JWT) |

---

## Database Schema

12 PostgreSQL tables managed via Supabase with Row-Level Security (RLS) on all tables:

| Table | Description |
|-------|------------|
| `citizens` | Core citizen profiles (extends auth.users) |
| `digital_documents` | Digital document records with QR data and signatures |
| `vehicles` | Vehicle registration (RUNT) |
| `health_records` | EPS affiliation, SISBEN |
| `vaccinations` | Vaccination records with dose tracking |
| `family_members` | Linked family relationships |
| `citizen_services` | Social program enrollments |
| `work_tax_records` | RUT, employment, pension info |
| `appointments` | Government service appointments |
| `verification_logs` | QR scan verification audit trail |
| `admin_users` | Government admin accounts with role-based permissions |
| `notifications` | Citizen notification system |

---

## Security

- **Row-Level Security (RLS):** All database tables enforce citizen data isolation at the PostgreSQL level using `auth.uid()`
- **Security Headers:** CSP, HSTS (2-year max-age with preload), X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Zod Validation:** Input validation schemas with Spanish error messages for citizen-facing forms
- **CSRF Protection:** Double-submit cookie pattern with constant-time token comparison (ready for API integration)
- **Rate Limiting:** In-memory sliding-window rate limiter with 4 tiers (auth, citizen, verification, admin)
- **Structured Logging:** JSON logging with audit trail functions for API requests, auth events, and document access

---

## Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3s |
| Cumulative Layout Shift | < 0.1 |
| Offline Document Load | < 500ms |
| QR Code Generation | < 200ms |

---

## Current Status

The platform is in active development. The citizen UI, admin dashboard, and agency portal are fully functional with mock data. Production-critical work remaining includes:

1. Replace mock authentication with Supabase Auth
2. Implement API routes (server-side data access)
3. Connect all pages to real database queries
4. End-to-end RLS verification with real auth tokens
5. Service worker implementation for true offline support

See `docs/PRODUCTION_ROADMAP.md` for the complete change history and planned phases.
See `docs/TODO_QUEUE.md` for the prioritized backlog.
