# Production Roadmap — Mi Colombia Digital

> **Document Purpose**: A complete record of every change, integration, and modification that has been completed or is planned for the Mi Colombia Digital platform, along with the rationale for each decision.
>
> **Last Updated**: February 26, 2026

---

## Table of Contents

1. [Completed Changes](#completed-changes)
   - [Phase 1 — Project Scaffolding](#phase-1--project-scaffolding-february-22-2026)
   - [Phase 2 — Full Platform Build](#phase-2--full-platform-build-february-22-2026)
   - [Phase 3 — Stability Fix](#phase-3--stability-fix-february-22-2026)
   - [Phase 4 — Agency Portals & Localization](#phase-4--agency-portals--localization-february-23-2026)
   - [Phase 5 — Documentation Audit](#phase-5--documentation-audit-february-26-2026)
   - [Phase 6 — Security Headers](#phase-6--security-headers-february-26-2026)
2. [Planned Changes](#planned-changes)
   - [Phase 7 — CI/CD Pipeline](#phase-7--cicd-pipeline-priority-critical)
   - [Phase 8 — Real Authentication](#phase-8--real-authentication-priority-critical)
   - [Phase 9 — API Routes](#phase-9--api-routes-priority-critical)
   - [Phase 10 — Real Data Integration](#phase-10--real-data-integration-priority-critical)
   - [Phase 11 — RLS & Access Control Verification](#phase-11--rls--access-control-verification-priority-high)
   - [Phase 12 — PWA & Assets](#phase-12--pwa--assets-priority-high)
   - [Phase 13 — Monitoring & Observability](#phase-13--monitoring--observability-priority-high)
   - [Phase 14 — Quality & Accessibility](#phase-14--quality--accessibility-priority-medium)
   - [Phase 15 — Rate Limiting & API Security](#phase-15--rate-limiting--api-security-priority-medium)
3. [Phase Summary Table](#phase-summary-table)

---

# Completed Changes

Everything documented in this section is merged and present in the current codebase.

---

## Phase 1 — Project Scaffolding (February 22, 2026)

| Change | Purpose |
|--------|---------|
| Initialized Next.js 14 project with TypeScript, TailwindCSS, and ESLint via `create-next-app` | Establish a modern, type-safe frontend foundation with utility-first CSS for rapid UI development. Next.js 14 provides App Router, server components, and built-in API route support needed for a production government platform. |

**Files created**: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `next.config.mjs`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

---

## Phase 2 — Full Platform Build (February 22, 2026)

### 2.1 — Citizen Modules (8 modules)

| Module | Route | Purpose |
|--------|-------|---------|
| **Cedula Digital (Identity)** | `/documents/identity` | Digitize the Cedula de Ciudadania, Colombia's primary identity document. Citizens should be able to view, share, and present their cedula from their phone instead of carrying the physical card. |
| **Vehiculos (RUNT Vehicles)** | `/documents/vehicles` | Digitize vehicle registration, SOAT (mandatory insurance), and technomechanical certificates. Integrates with RUNT (Registro Unico Nacional de Transito) data model. |
| **Salud (Health / EPS)** | `/documents/health` | Digitize EPS affiliation cards, vaccination records, SISBEN scores, and chronic condition alerts. Citizens frequently need EPS information at medical appointments. |
| **Trabajo y Tributario (Work / DIAN)** | `/documents/work` | Digitize RUT (tax ID), employment certificates, pension fund, ARL, and cesantias information. Workers need these documents for employment verification and tax procedures. |
| **Familia (Family)** | `/documents/family` | Display linked family members, children's Tarjeta de Identidad, and guardianship records. Parents frequently need to present children's documents at schools and medical facilities. |
| **Servicios (SISBEN / Social Programs)** | `/services` | Show enrollment status for Familias en Accion, Ingreso Solidario, Colombia Mayor, and other social programs. Includes appointment booking at `/services/book`. |
| **Emergencias (Emergency)** | `/emergency` | One-tap calling for 123, police, fire, and ambulance with country-specific emergency numbers. Critical safety feature for a citizen-facing app. |
| **Perfil (Profile)** | `/profile` | Citizen profile management, notification preferences, and account settings. Central place for citizens to review and update their information. |

### 2.2 — Government Admin Dashboard

| Change | Purpose |
|--------|---------|
| Admin dashboard at `/admin/dashboard` | Provide government operators with an overview of platform metrics: registered citizens, documents issued, verification activity, and system health. |
| Users management at `/admin/users` with detail view at `/admin/users/[id]` | Enable admins to search, view, and manage citizen accounts. Detail view shows full citizen profile, documents, and activity history. |
| Documents management at `/admin/documents` | Allow admins to issue, review, suspend, and revoke digital documents across all document types. |
| Analytics page at `/admin/analytics` | Data-driven insights for government decision-makers: registration trends, verification volumes, geographic distribution, and program enrollment. |
| Tickets page at `/admin/tickets` | Support ticket system for handling citizen inquiries and document issues. |
| Settings page at `/admin/settings` | System configuration for platform parameters, notification rules, and admin access management. |
| Admin layout with `Sidebar` + `AdminHeader` + `AdminRoleContext` | Dedicated desktop-optimized layout for government operators, separate from the mobile-first citizen experience. AdminRoleContext provides role-based UI rendering. |

### 2.3 — Authentication System

| Change | Purpose |
|--------|---------|
| Login page at `/login` | Entry point for citizen authentication. Currently uses mock localStorage-based auth for demo capability. |
| Register page at `/register` | Citizen registration with document type, document number, name, date of birth, and contact information. Form structure mirrors the production flow for stakeholder review. |
| Verify page at `/verify` | Email/phone verification step in the registration flow. Structured for future OTP integration. |
| `AuthContext` + `useAuth` hook | Global authentication state management. Provides `user`, `login()`, `logout()`, `isAuthenticated` across the entire app. Mock implementation allows full UI testing without a backend. |

### 2.4 — Reusable UI Components (11 components)

| Component | Purpose |
|-----------|---------|
| `Avatar` | Consistent user avatar display with fallback initials |
| `Badge` | Status indicators (active, expired, pending) across documents and services |
| `Button` | Standardized button with variants (primary, secondary, outline, ghost, danger) |
| `Card` | Container component for document cards, dashboard widgets, and list items |
| `EmptyState` | Friendly empty-state messaging when no data exists (avoids blank screens) |
| `Input` | Form input with label, error state, and helper text for accessibility |
| `LoadingSpinner` | Loading indicator for async operations and page transitions |
| `Modal` | Overlay dialog for confirmations, document details, and QR code display |
| `QRCode` | QR code generator using `react-qr-code` for document verification |
| `Tabs` | Tab navigation for switching between sub-views within a page |
| `index.ts` | Barrel export for clean imports across the codebase |

**Additional component groups**:
- **Document components** (4): `DocumentCard`, `DocumentViewer`, `HealthCard`, `VehicleCard` — specialized card layouts matching each document type's data structure.
- **Card components** (2): `QuickActionCard`, `StatCard` — dashboard-specific widgets for actions and KPI display.
- **Layout components** (7): `AdminHeader`, `BottomNav`, `CountrySwitcher`, `Header`, `Sidebar`, `AgencySidebar`, `AgencyHeader` — structural components for each portal's navigation.

### 2.5 — Multi-Country Configuration

| Change | Purpose |
|--------|---------|
| `colombia.json` — Full configuration (colors, documents, agencies, emergency numbers, social programs) | Primary deployment target. Configures all Colombia-specific government agencies (RNEC, RUNT, DIAN, ADRES, DPS, MinTIC), document types (CC, CE, TI, PP, NIT, RUT), and emergency numbers (123, 112). |
| `ecuador.json` — Ecuador configuration | White-label proof-of-concept. Maps to Ecuador's equivalent agencies (Registro Civil, ANT, SRI, IESS, MIES, MINTEL) and document types. |
| `guatemala.json` — Guatemala configuration | White-label proof-of-concept. Maps to Guatemala's equivalent agencies (RENAP, SAT, IGSS, MIDES, CIV) and document types. |
| `CountryContext` + `CountrySwitcher` | Runtime country switching for demos. In production, each deployment would be fixed to a single country. The context provides colors, document types, and agency data to all components. |

### 2.6 — Supabase Infrastructure

| Change | Purpose |
|--------|---------|
| `client.ts` — Browser-side Supabase client | Client-side data access using the anonymous key. Used by citizen-facing pages for reads. |
| `server.ts` — Server-side Supabase client | Server component data access with cookie-based auth. Required for SSR pages and API routes. |
| `middleware.ts` — Supabase middleware helper | Token refresh and session management in Next.js middleware. Keeps auth tokens fresh on every request. |

### 2.7 — Database Schema (12 tables)

| Table | Purpose |
|-------|---------|
| `citizens` | Core citizen profiles extending Supabase `auth.users`. Contains document type/number, name, date of birth, address, verification status, and biometric enrollment flag. |
| `digital_documents` | All digital document records with QR code data, digital signatures, issuing authority, and expiry dates. Supports offline caching flag. |
| `vehicles` | RUNT vehicle records: plate, brand, model, SOAT, technomechanical, insurance. |
| `health_records` | EPS affiliation, regime type, SISBEN score, allergies, chronic conditions, disability status. |
| `vaccinations` | Vaccination records with dose tracking, lot numbers, manufacturer, and next-dose scheduling. |
| `family_members` | Linked family relationships (child, spouse, parent, guardian, dependent) with optional cross-reference to another citizen account. |
| `citizen_services` | Social program enrollments: Familias en Accion, Ingreso Solidario, Colombia Mayor, etc. Tracks enrollment dates and payment schedules. |
| `work_tax_records` | RUT number, employer info, tax regime, pension fund, ARL, cesantias. |
| `appointments` | Government service appointments with scheduling, location, confirmation codes, and status tracking. |
| `verification_logs` | Audit trail for every QR scan verification: who verified, method, result, IP, location, and timestamp. |
| `admin_users` | Government admin accounts with role-based permissions (super_admin, admin, operator, viewer) and agency assignment. |
| `notifications` | Citizen notification system for document updates, appointment reminders, program status changes. |

**Supporting infrastructure**: 13 indexes for query performance, `update_updated_at()` trigger function applied to 7 tables.

### 2.8 — Row-Level Security (RLS)

| Change | Purpose |
|--------|---------|
| RLS policies on all 12 tables (`002_rls_policies.sql`) | Citizens must only access their own data. RLS enforces this at the database level so that even if application code has a bug, unauthorized data access is blocked by PostgreSQL. Policies use `auth.uid()` to match the authenticated user to their records. |

### 2.9 — Playwright E2E Test Suite

| Test File | Coverage | Purpose |
|-----------|----------|---------|
| `auth/auth.spec.ts` | Login, register, verify page rendering | Ensure authentication flows render correctly and handle form interactions in both authenticated and unauthenticated states. |
| `citizen/dashboard.spec.ts` | Dashboard rendering, navigation | Verify the main citizen dashboard loads, displays widgets, and navigates to sub-sections. |
| `citizen/documents.spec.ts` | Document viewing, card interactions | Verify all document types render with correct data and QR code generation works. |
| `citizen/services.spec.ts` | Social programs, appointment booking | Verify service listings and appointment booking flow. |
| `citizen/emergency.spec.ts` | Emergency contacts, call buttons | Verify emergency page renders all contacts with correct phone numbers. |
| `citizen/profile.spec.ts` | Profile page, settings | Verify profile data display and settings interactions. |
| `admin/admin-dashboard.spec.ts` | Admin dashboard, stats | Verify admin dashboard renders metrics and management tables. |
| `config/country-switch.spec.ts` | Multi-country switching | Verify country context updates UI across the entire app. |

**Configuration**: 3 Playwright projects (chromium-desktop, mobile-chrome on Pixel 5, mobile-safari on iPhone 12). Tests run against `http://localhost:3000` with auto-start dev server.

### 2.10 — Bilingual Documentation

| Document | Languages | Purpose |
|----------|-----------|---------|
| `README.md` | English | Project overview, quick start, structure, and deployment instructions for the GitHub repository landing page. |
| `ONBOARDING.md` | EN + ES | Step-by-step developer setup guide. Enables new team members to clone, install, and run the project in under 10 minutes. |
| `ARCHITECTURE.md` | EN + ES | System architecture diagrams, component tree, data flow, security model, and technology decision rationale. For architects and senior developers. |
| `API_REFERENCE.md` | EN + ES | Complete API surface documentation (currently planned, not implemented). Defines the target contract for backend integration. |
| `TESTING.md` | EN + ES | Test structure, commands, configuration, writing conventions, and CI integration guide. |

### 2.11 — Middleware & Route Protection

| Change | Purpose |
|--------|---------|
| Root middleware (`src/middleware.ts`) | Centralized route protection. Redirects unauthenticated users to `/login` for citizen routes. Redirects authenticated users away from auth pages to `/dashboard`. Checks `auth-token` cookie for citizens and `agency-token` cookie for agency staff. |
| Public path allowlist (`/login`, `/register`, `/verify`, `/`) | These routes must be accessible without authentication for obvious reasons. |
| API route passthrough | API routes skip middleware auth checks because they validate tokens server-side. |

### 2.12 — Mock Data System

| File | Lines (approx.) | Purpose |
|------|-----------------|---------|
| `citizenData.ts` | ~300 | Complete mock citizen profile (Juan Carlos Rodriguez Martinez, CC 1234567890) with documents, vehicles, health records, vaccinations, family members, appointments, and notifications. Enables full UI demonstration. |
| `adminData.ts` | ~200 | Admin dashboard mock data: KPI stats, recent activities, system health, registration trends. |
| `agencyData.ts` | ~1,800 | Mock data for all 6 agencies across 3 countries. Includes agency staff profiles, issued documents, pending requests, and analytics. |
| `ticketData.ts` | ~100 | Support ticket mock data for the admin tickets page. |

**Design decision**: Mock-first development allows full stakeholder demonstrations, UI testing, and frontend development without any backend dependency. The app automatically falls back to mock data when Supabase credentials are not configured.

---

## Phase 3 — Stability Fix (February 22, 2026)

| Change | Purpose |
|--------|---------|
| Server client environment variable handling (`src/lib/supabase/server.ts`) | The app crashed on startup when `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` were missing. Now throws a clear error message instead of silently passing `undefined` to the Supabase client. This is essential because the app must function in demo mode without any Supabase connection. |
| Root page redirect safety (`src/app/page.tsx`) | The root page no longer attempts to initialize a Supabase client. It performs a simple redirect to `/login`, ensuring the landing page works regardless of backend configuration. |
| Dashboard test fix (`tests/e2e/citizen/dashboard.spec.ts`) | Dashboard navigation test was failing when the app redirected to login (no auth). Updated test to handle the login redirect gracefully, so the full test suite passes in both authenticated and unauthenticated states. |

**Result**: All 19 Playwright E2E tests pass without requiring a live Supabase connection.

---

## Phase 4 — Agency Portals & Localization (February 23, 2026)

### 4.1 — Agency Portal System

| Change | Purpose |
|--------|---------|
| Agency selection page at `/agency` (6 agency cards) | Government agency staff need a clear entry point to select their agency. Each card displays the agency name, description, and icon. Supports all 3 configured countries. |
| Agency login at `/agency/login` with `.gov.co` email auth | Agency staff authenticate with institutional email credentials, separate from citizen accounts. This separation ensures agency and citizen identity systems do not cross. |
| 6 agency pages per agency: dashboard, documents, citizens, requests, analytics, settings | Each agency needs dedicated tools for their domain. For example, RNEC manages identity documents while RUNT manages vehicle registrations. The page set is consistent across agencies but the data and context change per agency. |
| `AgencySidebar` with agency dropdown switcher | Staff who work across multiple agencies can switch context without logging out. The sidebar provides navigation within the current agency's pages. |
| `AgencyHeader` | Top bar showing current agency name, staff user info, and quick actions. |
| Agency layout at `src/app/(agency)/layout.tsx` | Separate Next.js route group ensures the agency portal has its own layout tree, independent of citizen and admin layouts. |

**Agency keys**: `identity`, `vehicles`, `tax`, `health`, `socialServices`, `technology`

**Countries and agencies**:

| Country | Identity | Vehicles | Tax | Health | Social Services | Technology |
|---------|----------|----------|-----|--------|-----------------|------------|
| Colombia | RNEC | RUNT | DIAN | ADRES | DPS | MinTIC |
| Ecuador | Registro Civil | ANT | SRI | IESS | MIES | MINTEL |
| Guatemala | RENAP | SAT-Vehiculos | SAT | IGSS | MIDES | CIV |

### 4.2 — Separate Agency Auth Flow

| Change | Purpose |
|--------|---------|
| Middleware updated to handle `agency-token` cookie | Agency auth is independent from citizen auth. The middleware checks `agency-token` for all routes under `/agency/[agencyKey]/*` and redirects to `/agency/login` if missing. |
| `AGENCY_PUBLIC_PATHS` allowlist (`/agency`, `/agency/login`) | The agency selection page and login page must be accessible without agency authentication. |

### 4.3 — Spanish Admin Translations

| Change | Purpose |
|--------|---------|
| Translated 305+ strings across all admin pages to Spanish | Colombian government operators are native Spanish speakers. While the admin interface was initially built in English for development speed, production requires full Spanish support. |
| Clickable admin analytics KPI cards with navigation | Admin KPI cards (total citizens, documents issued, etc.) now navigate to their respective detail views on click. Improves admin workflow efficiency. |

### 4.4 — Age-Based Identity Documents

| Change | Purpose |
|--------|---------|
| Tarjeta de Identidad for minors (< 18 years old) | Colombian law mandates Tarjeta de Identidad for citizens under 18. The platform must correctly display the age-appropriate document type. The identity page checks the citizen's date of birth and renders either Tarjeta de Identidad or Cedula de Ciudadania accordingly. |

### 4.5 — Test Admin Account

| Change | Purpose |
|--------|---------|
| Test admin credentials (`admin123@test.gov.co` / `Test123!`) | QA engineers and demo presenters need a known admin account that works without creating real government credentials. |

### 4.6 — PWA Manifest

| Change | Purpose |
|--------|---------|
| `public/manifest.json` with app name, colors, and icon references | Enables "Add to Home Screen" on mobile devices. When citizens install the PWA, it appears as a standalone app with the Colombian flag colors (`#003893` theme). References `icon-192.png` and `icon-512.png` (icons not yet generated — see Phase 12). |

### 4.7 — Agency E2E Tests

| Change | Purpose |
|--------|---------|
| `tests/e2e/agency/agency.spec.ts` (9 new tests) | Regression coverage for the entire agency portal: selection page rendering, login flow, agency navigation, dashboard metrics, and page transitions. |

**Result**: Total test count increased from 19 to 84 passing tests (across 3 Playwright projects).

---

## Phase 5 — Documentation Audit (February 26, 2026)

| Change | Purpose |
|--------|---------|
| Updated `README.md` — Fixed project structure tree (added `services/book`, `admin/tickets`, `admin/users/[id]`), added `lib/providers`, updated env vars table | Documentation must match the actual codebase. New developers reading an inaccurate README will misunderstand the project structure and waste time. |
| Updated `ONBOARDING.md` (EN + ES) — Fixed key directories, mock data listing, env vars, and test structure | The onboarding guide listed outdated file paths and missing mock data files. Developers following the guide would encounter discrepancies. |
| Updated `ARCHITECTURE.md` (EN + ES) — Added agency portal to system diagrams and component tree | The architecture document did not reflect the agency portal added in Phase 4. System diagrams must show all three portals (citizen, admin, agency). |
| Updated `API_REFERENCE.md` (EN + ES) — Added notice that API endpoints are planned, not implemented | Developers were confused about whether the API routes existed. The notice at the top of the document now explicitly states the current status: "planned and not yet implemented." |
| Updated `TESTING.md` (EN + ES) — Fixed test file structure, corrected Playwright project names | Test structure showed outdated file paths. Playwright project names did not match `playwright.config.ts`. |

**Result**: All 8 documentation files (4 English + 4 Spanish) accurately reflect the current codebase.

---

## Phase 6 — Security Headers (February 26, 2026)

| Header | Value | Purpose |
|--------|-------|---------|
| `X-DNS-Prefetch-Control` | `on` | Enable DNS prefetching for faster resolution of external resources (e.g., Supabase endpoints). |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Enforce HTTPS for all connections for 2 years. Prevents protocol downgrade attacks and cookie hijacking. Required for any application handling citizen PII. HSTS preload list inclusion ensures browsers enforce HTTPS even on first visit. |
| `X-Frame-Options` | `SAMEORIGIN` | Prevent the platform from being embedded in iframes on external sites. Protects against clickjacking attacks where an attacker overlays invisible frames over the app to hijack clicks. |
| `X-Content-Type-Options` | `nosniff` | Prevent browsers from MIME-type sniffing responses away from their declared `Content-Type`. Stops browsers from executing uploaded files as scripts. |
| `Referrer-Policy` | `origin-when-cross-origin` | Send the full URL as referrer for same-origin requests (useful for analytics) but only the origin for cross-origin requests. Prevents leaking citizen-specific URL paths to external services. |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(self)` | Disable camera and microphone access entirely (not needed). Restrict geolocation to same-origin only (may be needed for emergency services). Prevents malicious scripts from accessing sensitive device features. |
| `Content-Security-Policy` | See below | Comprehensive resource loading policy (detailed below). |

**Content-Security-Policy breakdown**:

| Directive | Value | Rationale |
|-----------|-------|-----------|
| `default-src` | `'self'` | Only allow resources from the same origin by default. |
| `script-src` | `'self' 'unsafe-eval' 'unsafe-inline'` | Allow scripts from same origin. `unsafe-eval` and `unsafe-inline` required by Next.js development mode and certain runtime features. |
| `style-src` | `'self' 'unsafe-inline'` | Allow styles from same origin. `unsafe-inline` required by TailwindCSS runtime and Next.js style injection. |
| `img-src` | `'self' data: blob: https:` | Allow images from same origin, data URIs (for QR codes), blob URLs, and any HTTPS source (for citizen photos from Supabase Storage). |
| `font-src` | `'self' data:` | Allow fonts from same origin and data URIs (Geist font embedding). |
| `connect-src` | `'self' https://*.supabase.co wss://*.supabase.co` | Allow API connections to same origin and Supabase (HTTPS for REST, WSS for real-time subscriptions). |
| `frame-ancestors` | `'none'` | Prevent the app from being embedded in any iframe (stronger than X-Frame-Options). |

**Implementation**: Applied via `next.config.mjs` `headers()` function to all routes matching `/(.*)`

---

# Planned Changes

Everything documented in this section has NOT yet been implemented. Items are ordered by priority.

---

## Phase 7 — CI/CD Pipeline (Priority: Critical)

| Change | Purpose |
|--------|---------|
| **GitHub Actions workflow** — Build + lint + Playwright tests on every pull request | Automated quality gates prevent broken code from reaching the main branch. Without CI, bugs introduced in one PR can silently break other features. For a government platform, deployment reliability is non-negotiable. |
| **Deployment pipeline** — Automatic deployment to Vercel (or equivalent) from `main` branch | Manual deployments are error-prone and slow. Automated deployments ensure every merge to main is immediately available in production, with rollback capability. |
| **Environment variable management** — Secrets stored in GitHub Actions / Vercel dashboard | Credentials must never be committed to the repository. CI/CD pipeline must securely inject Supabase URL, anon key, and service role key at build time. |

**Files to create**:
- `.github/workflows/ci.yml` — PR validation (build, lint, test)
- `.github/workflows/deploy.yml` — Production deployment on main merge (optional, if not using Vercel's GitHub integration)

**Estimated effort**: 1 day

---

## Phase 8 — Real Authentication (Priority: Critical)

| Change | Purpose |
|--------|---------|
| **Replace mock auth with Supabase Auth** | Production requires real identity verification. The current localStorage-based mock auth provides zero security — any user can set an `auth-token` cookie and access all routes. Supabase Auth provides JWT-based authentication with bcrypt password hashing, token refresh, and session management. |
| **Update `AuthContext` and `useAuth` hook** | Must switch from `localStorage.setItem('user', ...)` to `supabase.auth.signInWithPassword()`, `supabase.auth.signUp()`, and `supabase.auth.signOut()`. The context must subscribe to `onAuthStateChange` for reactive session updates. |
| **Update middleware to use Supabase JWT tokens** | Replace `cookies.get('auth-token')` check with Supabase server-side session validation using `@supabase/ssr`. The middleware must call `supabase.auth.getUser()` to verify the JWT on each request. |
| **Email verification flow** | Citizens must verify email ownership before accessing government documents. Without email verification, anyone can register with a fake email and the account cannot be recovered. Supabase Auth provides built-in email confirmation with customizable templates. |
| **Password reset flow** | Standard authentication requirement. Citizens who forget their password must be able to reset it via email. Supabase Auth provides `resetPasswordForEmail()` with a magic link flow. |

**Files to modify**:
- `src/lib/contexts/AuthContext.tsx`
- `src/lib/hooks/useAuth.ts`
- `src/middleware.ts`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/app/(auth)/verify/page.tsx`

**Estimated effort**: 2-3 days

---

## Phase 9 — API Routes (Priority: Critical)

| Change | Purpose |
|--------|---------|
| **Implement Next.js API routes** for all endpoints documented in `docs/en/API_REFERENCE.md` | Client-side-only data access is insecure for production. API routes provide a server-side layer where authentication tokens are validated, input is sanitized, and database queries are executed with proper authorization. Without API routes, a malicious user could modify client-side JavaScript to query any data. |

**Endpoints to implement**:

| Route Group | Endpoints | Purpose |
|-------------|-----------|---------|
| `/api/auth/*` | `login`, `register`, `logout`, `refresh` | Server-side auth operations with proper cookie handling |
| `/api/citizens/*` | `me` (GET, PATCH) | Authenticated citizen profile access |
| `/api/documents/*` | list (GET), detail (GET), QR generation (GET) | Document data with citizen ownership validation |
| `/api/vehicles/*` | list (GET), detail (GET) | Vehicle records scoped to authenticated citizen |
| `/api/health/*` | records (GET), vaccinations (GET) | Health data scoped to authenticated citizen |
| `/api/services/*` | programs (GET), appointments (GET, POST) | Social program data and appointment creation |
| `/api/verify` | POST (public, no auth required) | QR code verification endpoint for government officials |
| `/api/admin/*` | `citizens` (GET), `citizens/:id` (GET), `documents/issue` (POST), `analytics` (GET), `verification-logs` (GET) | Admin endpoints with role-based access control |

**Note**: The directory structure for API routes already exists (`src/app/api/auth/`, `src/app/api/citizens/`, etc.) but the directories are empty — no `route.ts` files have been created.

**Estimated effort**: 3-5 days

---

## Phase 10 — Real Data Integration (Priority: Critical)

| Change | Purpose |
|--------|---------|
| **Connect all citizen pages to Supabase queries** | Replace mock data imports with real database reads. Each page currently imports from `src/lib/mock/citizenData.ts` — these must be replaced with TanStack React Query hooks that call the API routes (Phase 9) or Supabase client directly. |
| **Connect admin pages to Supabase queries** | Replace `src/lib/mock/adminData.ts` imports with real admin data queries. |
| **Connect agency pages to Supabase queries** | Replace `src/lib/mock/agencyData.ts` imports with real agency data queries. |
| **Seed database with test data** | Development and QA testing require realistic data volumes. Seed scripts should create multiple citizen profiles with varying document sets, verification states, and geographic distribution. |
| **Implement TanStack React Query hooks** | Create custom hooks (e.g., `useDocuments()`, `useVehicles()`, `useHealthRecords()`) that handle loading states, error states, caching, and background refetching. The `QueryProvider` is already configured. |

**Files to modify**: Every page file under `src/app/(citizen)/`, `src/app/(admin)/`, and `src/app/(agency)/`.

**Estimated effort**: 5-7 days

---

## Phase 11 — RLS & Access Control Verification (Priority: High)

| Change | Purpose |
|--------|---------|
| **End-to-end RLS testing with real auth tokens** | RLS policies have been defined in SQL but never tested with real Supabase Auth tokens. Policies using `auth.uid()` must be validated: a citizen with UUID `A` must NOT be able to read records belonging to citizen UUID `B`. Testing must cover all 12 tables. |
| **Admin role enforcement** | Admin API endpoints must check the JWT's role claim before executing queries. A citizen token must be rejected by admin endpoints. The `admin_users` table defines roles (super_admin, admin, operator, viewer) — each role must be tested for correct access levels. |
| **Cross-portal isolation** | Verify that agency tokens cannot access citizen data and citizen tokens cannot access agency data. The separate auth flows (citizen vs. agency) must be validated at the database level, not just at the middleware level. |

**Estimated effort**: 2-3 days

---

## Phase 12 — PWA & Assets (Priority: High)

| Change | Purpose |
|--------|---------|
| **Generate PWA icons** (192x192, 512x512 minimum; plus Apple touch icons at 120, 152, 167, 180) | The `manifest.json` references `/icons/icon-192.png` and `/icons/icon-512.png` but the `/public/icons/` directory is empty. Without these icons, "Add to Home Screen" shows a generic browser icon and some devices will reject the PWA installation. |
| **Add country flag assets** to `public/flags/` | The `CountrySwitcher` component references flag images for Colombia, Ecuador, and Guatemala. The `/public/flags/` directory is empty. Without flags, the country switcher shows broken images. |
| **Implement service worker** for offline caching | Citizens need access to core documents (Cedula, health card) without internet connectivity. Colombia has significant rural areas with poor connectivity. The service worker should cache the most recent document data, QR codes, and the app shell. `next-pwa` is already installed as a dependency. |
| **Configure `next-pwa`** in `next.config.mjs` | The `next-pwa` package is in `package.json` but is not configured in `next.config.mjs`. It needs to wrap the Next.js config to generate the service worker at build time. |

**Estimated effort**: 2-3 days

---

## Phase 13 — Monitoring & Observability (Priority: High)

| Change | Purpose |
|--------|---------|
| **Error monitoring** (Sentry or equivalent) | Track and alert on production errors in real time. A government platform serving citizens cannot afford silent failures — if the Cedula page crashes for 10% of users, the team must know immediately. Sentry provides stack traces, breadcrumbs, and user impact analysis. |
| **Server-side logging** (structured JSON logs) | Audit trail for document access and admin actions. Government compliance may require logging who accessed which citizen's data, when, and from where. Structured logs enable integration with centralized log management (CloudWatch, Datadog, etc.). |
| **Analytics and metrics** | Track platform adoption (registrations per day), usage patterns (most-viewed documents), performance (API latency p95/p99), and errors (rate by endpoint). Essential for demonstrating platform value to government stakeholders and identifying optimization priorities. |

**Estimated effort**: 2-3 days

---

## Phase 14 — Quality & Accessibility (Priority: Medium)

| Change | Purpose |
|--------|---------|
| **Accessibility audit (WCAG 2.1 AA compliance)** | Government platforms must be accessible to citizens with disabilities. This is a legal requirement in many jurisdictions and an ethical obligation for any public service. Audit must cover: screen reader compatibility, keyboard navigation, color contrast ratios, focus indicators, ARIA labels, and form accessibility. |
| **Performance optimization** (Lighthouse targets) | Citizens access the platform on low-end Android devices and slow 3G/4G connections. Performance targets from `ARCHITECTURE.md`: FCP < 1.5s, LCP < 2.5s, TTI < 3s, CLS < 0.1. Optimization may include: code splitting, image optimization, font subsetting, and server component usage. |
| **Expand E2E test coverage** | Current tests cover happy paths across 9 test files. Production requires: error state testing (network failures, invalid inputs), edge cases (expired documents, suspended accounts), mobile-specific interactions (swipe, pinch-to-zoom on QR), and cross-browser validation. |
| **Load testing** | Government platforms face sudden traffic spikes during events such as election days, social program payment dates, or policy announcements. Load testing with tools like k6 or Artillery must validate the platform handles at least 10,000 concurrent users without degradation. |

**Estimated effort**: 5-7 days

---

## Phase 15 — Rate Limiting & API Security (Priority: Medium)

| Change | Purpose |
|--------|---------|
| **Rate limiting on auth endpoints** (`/api/auth/login`, `/api/auth/register`) | Prevent brute-force password attacks on citizen accounts. Without rate limiting, an attacker can attempt thousands of password combinations per second. Target: 5 attempts per minute per IP for login, 3 registrations per hour per IP. |
| **Rate limiting on verification endpoint** (`/api/verify`) | The QR verification endpoint is public (no auth required) because government officials scan QR codes without citizen credentials. Without rate limiting, it can be abused for enumeration attacks (scanning sequential document numbers to discover valid ones). Target: 1,000 requests per minute per IP. |
| **Input validation with Zod schemas** | Validate all request bodies at the API boundary using Zod schemas. Prevents injection attacks (SQL injection, NoSQL injection), ensures data integrity (valid email format, non-negative values, correct document number format), and provides clear error messages for malformed requests. |
| **CSRF protection** | Prevent cross-site request forgery on state-changing operations (document issuance, profile updates, appointment booking). CSRF tokens must be validated on all POST/PATCH/DELETE endpoints. |
| **API key management for agency integrations** | When external agency systems (RNEC, RUNT, etc.) integrate directly via API, each agency needs a unique API key with usage tracking, rate limits, and revocation capability. This is required before any government agency API integration goes live. |

**Estimated effort**: 3-4 days

---

# Phase Summary Table

| Phase | Status | Priority | Description | Estimated Effort |
|-------|--------|----------|-------------|-----------------|
| 1 | Completed | -- | Project scaffolding (Next.js 14 + TS + Tailwind) | -- |
| 2 | Completed | -- | Full platform build (citizen, admin, auth, components, DB, tests, docs) | -- |
| 3 | Completed | -- | Stability fix (env var handling, test fix) | -- |
| 4 | Completed | -- | Agency portals, Spanish admin translations, PWA manifest | -- |
| 5 | Completed | -- | Documentation audit (8 docs updated) | -- |
| 6 | Completed | -- | Security headers (CSP, HSTS, X-Frame-Options, etc.) | -- |
| 7 | **Planned** | Critical | CI/CD pipeline (GitHub Actions + deployment) | 1 day |
| 8 | **Planned** | Critical | Real authentication (Supabase Auth, email verification, password reset) | 2-3 days |
| 9 | **Planned** | Critical | API routes (auth, citizens, documents, vehicles, health, services, verify, admin) | 3-5 days |
| 10 | **Planned** | Critical | Real data integration (replace mock data, TanStack Query hooks, seed data) | 5-7 days |
| 11 | **Planned** | High | RLS & access control verification (end-to-end testing) | 2-3 days |
| 12 | **Planned** | High | PWA & assets (icons, flags, service worker, next-pwa config) | 2-3 days |
| 13 | **Planned** | High | Monitoring & observability (Sentry, logging, analytics) | 2-3 days |
| 14 | **Planned** | Medium | Quality & accessibility (WCAG audit, performance, test coverage, load testing) | 5-7 days |
| 15 | **Planned** | Medium | Rate limiting & API security (auth rate limits, Zod validation, CSRF, API keys) | 3-4 days |

**Total estimated effort for planned phases**: 23-36 days

---

> **Note**: This roadmap reflects the state of the codebase as of February 26, 2026. Phase priorities and estimates should be reviewed and updated as the project progresses.
