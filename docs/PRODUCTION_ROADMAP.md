# Production Roadmap — Mi Colombia Digital

> **Document Purpose**: A complete record of every change, integration, and modification that has been completed or is planned for the Mi Colombia Digital platform, along with the rationale for each decision.
>
> **Last Updated**: March 2, 2026

---

## Table of Contents

1. [Completed Changes](#completed-changes)
   - [Phase 1 — Project Scaffolding](#phase-1--project-scaffolding-february-22-2026)
   - [Phase 2 — Full Platform Build](#phase-2--full-platform-build-february-22-2026)
   - [Phase 3 — Stability Fix](#phase-3--stability-fix-february-22-2026)
   - [Phase 4 — Agency Portals & Localization](#phase-4--agency-portals--localization-february-23-2026)
   - [Phase 5 — Documentation Audit](#phase-5--documentation-audit-february-26-2026)
   - [Phase 6 — Security Headers](#phase-6--security-headers-february-26-2026)
   - [Phase 7 — Validation, Logging, Security, A11y, Tests, PWA & Performance](#phase-7--validation-logging-security-a11y-tests-pwa--performance-march-1-2026)
   - [Phase 8 — API Routes, React Query, Sentry & Offline Caching](#phase-8--api-routes-react-query-sentry--offline-caching-march-2-2026)
   - [Phase 9 — Production Hardening P1](#phase-9--production-hardening-p1-march-2-2026)
   - [Phase 10 — Production Hardening P2](#phase-10--production-hardening-p2-march-2-2026)
2. [Planned Changes](#planned-changes)
   - [Phase 11 — Real Authentication](#phase-11--real-authentication-priority-critical)
   - [Phase 12 — Real Data Integration](#phase-12--real-data-integration-priority-critical)
   - [Phase 13 — Admin Role-Based Access Control](#phase-13--admin-role-based-access-control-priority-critical)
   - [Phase 14 — RLS & Access Control Verification](#phase-14--rls--access-control-verification-priority-high)
   - [Phase 15 — Redis Rate Limiting](#phase-15--redis-rate-limiting-priority-medium)
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

## Phase 7 — Validation, Logging, Security, A11y, Tests, PWA & Performance (March 1, 2026)

### 7.1 — Zod Validation on Forms (PR #2)

| Change | Purpose |
|--------|---------|
| **Profile edit form** with `updateProfileSchema` | Inline editing for phone, email, address, city, department with real-time Zod validation and Spanish error messages. |
| **Appointment booking form** with `appointmentBookingSchema` | Service type selector, date/time pickers, and notes field with full validation replacing the placeholder alert. |
| **Admin document issuance** with `issueDocumentSchema` | Form-level validation on citizen ID and document type with inline error display. |
| **Admin user status change** with `updateCitizenStatusSchema` | Status selector and reason field with min-length validation for audit trail. |

### 7.2 — Structured Logging & API Helpers (PR #3)

| Change | Purpose |
|--------|---------|
| **Middleware logging** | Route protection decisions (redirects, blocks, allows) logged via `logger.info`/`logger.debug` with pathname and action metadata. |
| **Auth event logging** | `logAuthEvent()` wired into `useAuth` for login, register, logout, and failed login events. |
| **API response helpers** (`apiHelpers.ts`) | `createApiResponse()`, `createErrorResponse()`, `ApiErrors` factory, and `withAuth()` wrapper for standardized API responses. |

### 7.3 — CSRF Protection (PR #4)

| Change | Purpose |
|--------|---------|
| **CSRF token endpoint** (`/api/csrf`) | GET endpoint issues tokens via double-submit cookie pattern, rate limited by `authLimiter` (10 req/min). |
| **`useCsrf` hook** | Client-side hook auto-fetches CSRF token on mount with `refreshToken` for on-demand refresh. |

### 7.4 — WCAG 2.1 AA Accessibility Audit (PR #5)

| Change | Purpose |
|--------|---------|
| `layout.tsx` zoom | `userScalable: true`, `maximumScale: 5` — fixes WCAG 1.4.4 Resize Text. |
| `Button.tsx` | `aria-busy` when loading, `aria-hidden` on decorative icons. |
| `Input.tsx` | Right icon keyboard access (`tabIndex={0}` + `onKeyDown`), `aria-hidden` on decorative left icon. |
| `Modal.tsx` | `useId()` for unique `aria-labelledby`/`aria-describedby` IDs. |
| `LoadingSpinner.tsx` | `role="status"` and `aria-label` for screen reader announcements. |
| `EmptyState.tsx` | `aria-hidden` on decorative icon container. |
| `AdminHeader.tsx` | `aria-label` on search, `aria-expanded`/`aria-haspopup` on menus, `role="menu"`/`role="menuitem"`. |
| Dashboard page | `role="status"` on loading, `aria-label` on interactive elements, visible focus rings. |

### 7.5 — E2E Test Expansion (PR #6)

| Change | Purpose |
|--------|---------|
| **30 new E2E tests** across 3 files (136 total test cases, 408 across 3 browsers) | `auth-errors.spec.ts` (10 tests), `admin-settings.spec.ts` (8 tests), `empty-states.spec.ts` (12 tests). |

### 7.6 — Production PWA Icons (PR #7)

| Change | Purpose |
|--------|---------|
| **12 PNG icons** from SVG source via `sharp` | Standard PWA sizes (72–512px), Apple touch icon (180px), favicons (16/32px), maskable variant (512px with safe-area padding). |
| **Icon generation script** (`scripts/generate-pwa-icons.mjs`) | Reproducible PNG generation from SVG source. |

### 7.7 — Performance Optimization (PR #8)

| Change | Purpose |
|--------|---------|
| **Dynamic import** `react-qr-code` via `next/dynamic` | QR code lazy-loaded only on document detail pages, reducing initial bundle. |
| **Avatar optimization** | `<img>` → `next/image` in Header, AdminHeader, and AgencyHeader. |

### 7.8 — Build Fix

| Change | Purpose |
|--------|---------|
| **`AdminRoleContext.tsx`** created | Missing context file that caused pre-existing build error. |

---

## Phase 8 — API Routes, React Query, Sentry & Offline Caching (March 2, 2026)

### 8.1 — API Routes with Mock Data (PR #11)

| Change | Purpose |
|--------|---------|
| **21 API route handlers** | Auth (login, register, logout), citizen (profile, documents, vehicles, health, family, work, appointments, notifications), admin (citizens CRUD, documents, analytics, activity), and public verify — all using mock data with `{ success, data, meta }` response format. |
| **Server-side Zod validation** | All mutation endpoints validate request bodies with existing Zod schemas, returning 422 with Spanish error details on failure. |
| **CSRF protection** | `csrfProtect()` integrated into all POST/PUT routes, returning 403 on token mismatch. |
| **Structured logging** | `logApiRequest()`, `logAuthEvent()`, `logDocumentAccess()` wired into every route with request timing. |
| **Rate limiting** | `authLimiter` (10/min), `citizenApiLimiter` (100/min), `adminLimiter` (500/min), `verificationLimiter` (1000/min) with 429 responses and `Retry-After` headers. |

### 8.2 — React Query Hooks (PR #12)

| Change | Purpose |
|--------|---------|
| **12 hooks** with query key factories | `useCitizenProfile`, `useCitizenDocuments`, `useCitizenVehicles`, `useCitizenHealth`, `useCitizenFamily`, `useCitizenWork`, `useCitizenAppointments`, `useCitizenNotifications`, `useAdminCitizens`, `useAdminAnalytics`, `useAdminActivity`, `useVerifyDocument`. |
| **Type-safe API client** | `fetchApi<T>()` utility with `ApiError` class for standardized error handling. |

### 8.3 — Sentry Error Monitoring (PR #9)

| Change | Purpose |
|--------|---------|
| **`@sentry/nextjs`** configured | Client, server, and edge runtimes with 10% production sampling, session replay, and source map uploads in CI. |
| **Global error boundary** | `global-error.tsx` with Spanish UI that captures to Sentry and offers retry. |

### 8.4 — Offline Caching (PR #10)

| Change | Purpose |
|--------|---------|
| **Runtime caching strategies** in `next-pwa` | `NetworkFirst` for API/pages (24h), `CacheFirst` for images (30d) and fonts (1y), `StaleWhileRevalidate` for JS/CSS (7d). |
| **Offline fallback page** | `/offline` route with Spanish UI shown when navigation fails without connectivity. |
| **`useOfflineStatus` hook** | Tracks `navigator.onLine` with event listeners. |
| **`OfflineBanner` component** | Amber warning banner at top of layout when offline. |

---

## Phase 9 — Production Hardening P1 (March 2, 2026)

| Change | PR | Issue | Purpose |
|--------|-----|-------|---------|
| **robots.txt and sitemap.xml** | #37 | #20 | Generated via Next.js metadata API. Robots blocks `/admin/*`, `/agency/*`, `/api/*`; sitemap includes public pages with priority and changeFrequency. |
| **Route-level error boundaries** | #38 | #21 | `error.tsx` in each route group (`(citizen)`, `(admin)`, `(agency)`, `(auth)`) with Spanish UI, Sentry capture, retry button, and navigation to safe page. |
| **Remove hardcoded API key** | #34 | #22 | Removed fake API key `sk-ag-7f3a92bc-...` from agency settings, replaced with masked placeholder. |
| **Aria-live regions** | #39 | #23 | `role="alert"` / `aria-live="assertive"` on auth errors, `role="status"` / `aria-live="polite"` on success confirmations, search counts, toasts, and loading states. |
| **CSP hardened** | #42 | #24 | Removed `'unsafe-eval'` from `script-src` in Content Security Policy. `'unsafe-inline'` retained as Next.js App Router requires it for hydration. |
| **Makefile** | #35 | #25 | Standardized `make` targets: `dev`, `build`, `clean`, `lint`, `typecheck`, `audit`, `ci`, `e2e`, `e2e-prod`, etc. |
| **Biome formatter** | #41 | #26 | Biome v2.4.4 with project conventions (2-space indent, single quotes, 100-char lines). `npm run format` / `npm run format:check`. |
| **223 unit tests** | #40 | #27 | Jest + ts-jest with 8 test suites covering `cn`, `csrf`, `logger`, `apiHelpers`, `rateLimit`, and all Zod schemas. 98%+ coverage. |
| **Sentry DSN documentation** | #36 | #28 | Added `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` to `.env.example`, CLAUDE.md, and ONBOARDING docs. |

---

## Phase 10 — Production Hardening P2 (March 2, 2026)

| Change | PR | Issue | Purpose |
|--------|-----|-------|---------|
| **Loading states for all routes** | #46 | #30 | `loading.tsx` with `LoadingSpinner` in every route group for automatic Next.js Suspense boundaries. |
| **JSON-LD structured data** | #45 | #31 | Government organization schema on layout and login page for SEO rich results. |
| **npm audit in CI** | #43 | #32 | `npm audit --audit-level=high` step in GitHub Actions after install (`continue-on-error: true`). `audit` Makefile target. CI branch triggers fixed from `main` to `master`. |
| **Playwright production build testing** | #44 | #33 | `playwright.prod.config.ts` runs E2E tests against `next start` production server. CI updated to test against production build. `e2e-prod` Makefile target. |

---

# Planned Changes

Everything documented in this section has NOT yet been implemented. All remaining items require external infrastructure (Supabase credentials, Redis) that is not yet provisioned.

---

## Phase 11 — Real Authentication (Priority: Critical)

> **GitHub Issue**: [#15](https://github.com/digar011/colombia-digital-wallet/issues/15)
> **Blocked by**: Supabase credentials

| Change | Purpose |
|--------|---------|
| **Replace mock auth with Supabase Auth** | Production requires real identity verification. The current localStorage-based mock auth provides zero security — any user can set an `auth-token` cookie and access all routes. Supabase Auth provides JWT-based authentication with bcrypt password hashing, token refresh, and session management. |
| **Update `AuthContext` and `useAuth` hook** | Must switch from `localStorage.setItem('user', ...)` to `supabase.auth.signInWithPassword()`, `supabase.auth.signUp()`, and `supabase.auth.signOut()`. The context must subscribe to `onAuthStateChange` for reactive session updates. |
| **Update middleware to use Supabase JWT tokens** | Replace `cookies.get('auth-token')` check with Supabase server-side session validation using `@supabase/ssr`. The middleware must call `supabase.auth.getUser()` to verify the JWT on each request. |
| **Email verification flow** | Citizens must verify email ownership before accessing government documents. Supabase Auth provides built-in email confirmation with customizable templates. |
| **Password reset flow** | Citizens who forget their password must be able to reset it via email. Supabase Auth provides `resetPasswordForEmail()` with a magic link flow. |

**Files to modify**: `AuthContext.tsx`, `useAuth.ts`, `middleware.ts`, `login/page.tsx`, `register/page.tsx`, `verify/page.tsx`

**Estimated effort**: 2-3 days

---

## Phase 12 — Real Data Integration (Priority: Critical)

> **GitHub Issues**: [#16](https://github.com/digar011/colombia-digital-wallet/issues/16), [#17](https://github.com/digar011/colombia-digital-wallet/issues/17)
> **Blocked by**: Phase 11 (real auth), Supabase credentials

| Change | Purpose |
|--------|---------|
| **Connect API routes to Supabase database** | The 21 API routes (Phase 8) currently return mock data. They must be updated to query the real Supabase database using the server client with proper RLS enforcement. |
| **Wire pages to React Query hooks** | The 12 React Query hooks (Phase 8) are ready but pages still import mock data directly. Each page must switch to using the hooks, with mock data retained as a fallback behind `NEXT_PUBLIC_ENABLE_MOCK_DATA`. |
| **Seed database with test data** | Development and QA testing require realistic data volumes across citizens, documents, vehicles, health records, and appointments. |

**Files to modify**: All 21 `route.ts` files in `src/app/api/`, all page files under `(citizen)`, `(admin)`, `(agency)`.

**Estimated effort**: 5-7 days

---

## Phase 13 — Admin Role-Based Access Control (Priority: Critical)

> **GitHub Issue**: [#18](https://github.com/digar011/colombia-digital-wallet/issues/18)
> **Blocked by**: Phase 11 (real auth)

| Change | Purpose |
|--------|---------|
| **JWT role claims** | Admin API endpoints must check the JWT's role claim before executing queries. A citizen token must be rejected by admin endpoints. |
| **Role hierarchy enforcement** | The `admin_users` table defines roles (super_admin, admin, operator, viewer) — each role must have correct access levels enforced at both middleware and API route level. |

**Estimated effort**: 1-2 days

---

## Phase 14 — RLS & Access Control Verification (Priority: High)

> **Blocked by**: Phase 11, Phase 12, Phase 13

| Change | Purpose |
|--------|---------|
| **End-to-end RLS testing with real auth tokens** | RLS policies have been defined in SQL but never tested with real Supabase Auth tokens. Policies using `auth.uid()` must be validated: citizen A must NOT see citizen B's data. Testing must cover all 12 tables. |
| **Cross-portal isolation** | Verify that agency tokens cannot access citizen data and citizen tokens cannot access agency data at the database level, not just middleware. |

**Estimated effort**: 2-3 days

---

## Phase 15 — Redis Rate Limiting (Priority: Medium)

> **GitHub Issue**: [#29](https://github.com/digar011/colombia-digital-wallet/issues/29)
> **Blocked by**: Redis/KV infrastructure

| Change | Purpose |
|--------|---------|
| **Replace in-memory rate limiter with Redis** | The current in-memory sliding-window rate limiter (`src/lib/middleware/rateLimit.ts`) resets on server restart and does not work across multiple instances. A Redis-backed solution (e.g., `@upstash/ratelimit`) provides persistent, distributed rate limiting. |

**Estimated effort**: 1 day

---

# Phase Summary Table

| Phase | Status | Priority | Description |
|-------|--------|----------|-------------|
| 1 | Completed | -- | Project scaffolding (Next.js 14 + TS + Tailwind) |
| 2 | Completed | -- | Full platform build (citizen, admin, auth, components, DB, tests, docs) |
| 3 | Completed | -- | Stability fix (env var handling, test fix) |
| 4 | Completed | -- | Agency portals, Spanish admin translations, PWA manifest |
| 5 | Completed | -- | Documentation audit (8 docs updated) |
| 6 | Completed | -- | Security headers (CSP, HSTS, X-Frame-Options, etc.) |
| 7 | Completed | -- | Zod validation, logging, CSRF, WCAG audit, E2E tests, PWA icons, performance |
| 8 | Completed | -- | 21 API routes, React Query hooks, Sentry monitoring, offline caching |
| 9 | Completed | -- | P1 hardening: SEO, error boundaries, CSP, Makefile, Biome, 223 unit tests |
| 10 | Completed | -- | P2 hardening: loading states, JSON-LD, npm audit CI, Playwright prod build |
| 11 | **Planned** | Critical | Real authentication (Supabase Auth) — requires Supabase credentials |
| 12 | **Planned** | Critical | Real data integration (connect API routes + pages to Supabase) |
| 13 | **Planned** | Critical | Admin role-based access control — requires real auth |
| 14 | **Planned** | High | RLS & access control verification — requires real auth + data |
| 15 | **Planned** | Medium | Redis rate limiting — requires Redis/KV infrastructure |

**Remaining effort for planned phases**: 11-16 days (all blocked on Supabase credentials or Redis infrastructure)

---

> **Note**: This roadmap reflects the state of the codebase as of March 2, 2026. Phases 1-10 are complete. Phases 11-14 are blocked on Supabase credentials. Phase 15 is blocked on Redis/KV infrastructure.
