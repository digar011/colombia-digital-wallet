# TODO -- Mi Colombia Digital

> Task queue for the Mi Colombia Digital platform.
> For detailed descriptions, dependencies, and file-level instructions, see `docs/TODO_QUEUE.md`.
> For full rationale behind each change, see `docs/PRODUCTION_ROADMAP.md`.
>
> Last Updated: 2026-03-01

---

## Queue

### P0 -- Blockers

- [ ] Replace mock auth with Supabase Auth (useAuth, AuthContext, middleware, login/register/verify pages) — **requires real Supabase credentials**

### P1 -- Critical

- [ ] End-to-end RLS verification with real Supabase Auth tokens across all 12 tables — **requires real Supabase**

### P3 -- Medium

- [ ] Load testing with k6 or Artillery (target: 10,000 concurrent users) — **requires running infrastructure**
- [ ] API key management for external agency integrations — **requires real API keys**

---

## In Progress

(none currently)

---

## Completed

### API Routes, React Query, Sentry, Offline Caching (2026-03-02)
- [x] Implement 21 API routes with mock data (auth, citizens, admin, verify) — PR #11
- [x] Wire Zod validation into all API routes (server-side) — PR #11
- [x] Integrate CSRF protection into all state-changing routes — PR #11
- [x] Wire structured logging (logApiRequest, logAuthEvent, logDocumentAccess) into all routes — PR #11
- [x] Apply rate limiting (authLimiter, citizenApiLimiter, adminLimiter, verificationLimiter) to all routes — PR #11
- [x] Create React Query hooks for all 17 API endpoints with query key factories and cache invalidation — PR #12
- [x] Create type-safe API client utility (fetchApi) with standardized error handling — PR #12
- [x] Set up Sentry error monitoring with @sentry/nextjs (client, server, edge configs) — PR #9
- [x] Add global error boundary with Spanish UI — PR #9
- [x] Enhance service worker with runtime caching strategies (NetworkFirst, CacheFirst, StaleWhileRevalidate) — PR #10
- [x] Create offline fallback page (/offline) with Spanish UI — PR #10
- [x] Add useOfflineStatus hook and OfflineBanner component — PR #10

### Validation, Logging, Security, A11y, Tests, PWA, Performance (2026-03-01)
- [x] Wire Zod validation into citizen and admin forms (profile, booking, documents, users, status) — PR #2
- [x] Wire structured logging into middleware and auth hook (`logAuthEvent`) — PR #3
- [x] Create API response helpers (`apiHelpers.ts`) for future route standardization — PR #3
- [x] CSRF token endpoint (`/api/csrf`) with rate limiting + `useCsrf` client hook — PR #4
- [x] WCAG 2.1 AA accessibility audit: layout zoom, Button/Input/Modal/LoadingSpinner/EmptyState/AdminHeader/Dashboard a11y fixes — PR #5
- [x] Expand E2E test coverage: 30 new tests (auth errors, admin settings, citizen empty states) — 136 total test cases — PR #6
- [x] Generate production PWA icons: 12 PNGs from SVG via sharp, updated manifest.json with maskable entry — PR #7
- [x] Performance optimization: dynamic import react-qr-code, convert img to next/image in headers — PR #8
- [x] Fix pre-existing build error: create missing `AdminRoleContext.tsx`

### Standardization (2026-02-28)
- [x] Create `ONBOARDING.md` at project root
- [x] Create `PRODUCT.md` with product overview and feature specs
- [x] Create `TODO.md` with task queue
- [x] Create `.env.example` with all required environment variables
- [x] Create `CLAUDE.md` with project-level standards

### Documentation and Security Audit (2026-02-26)
- [x] Update all 8 documentation files (4 English + 4 Spanish) to match codebase
- [x] Add security headers in `next.config.mjs` (CSP, HSTS, X-Frame-Options, etc.)
- [x] Set up GitHub Actions CI/CD pipeline (`.github/workflows/ci.yml`)
- [x] Create `CHANGELOG.md` with full project history
- [x] Create `docs/PRODUCTION_ROADMAP.md` with completed and planned phases
- [x] Create `docs/TODO_QUEUE.md` with prioritized backlog
- [x] Add Zod validation schemas (`src/lib/validations/`)
- [x] Add logger utility (`src/lib/utils/logger.ts`)
- [x] Add rate limiter (`src/lib/middleware/rateLimit.ts`)
- [x] Add CSRF protection utility (`src/lib/utils/csrf.ts`)
- [x] Add PWA icon SVGs (`public/icons/`)
- [x] Add country flag SVGs (`public/flags/`)
- [x] Add skeleton loading components and loading states
- [x] Add accessibility improvements (skip-to-content, focus trapping, ARIA labels)
- [x] Add 78 new E2E tests (admin users, admin documents, admin analytics, citizen identity, citizen vehicles, citizen health, mobile navigation)

### Agency Portal (2026-02-23)
- [x] Build complete agency portal with 6 agencies per country across 3 countries
- [x] Agency login with institutional `.gov.co` email auth
- [x] AgencySidebar and AgencyHeader layout components
- [x] Translate all admin pages to Spanish (305+ strings)
- [x] Add age-based identity documents (Tarjeta de Identidad for minors)
- [x] PWA `manifest.json`
- [x] 9 agency E2E tests

### Core Platform (2026-02-22)
- [x] Next.js 14 project scaffolding with TypeScript, TailwindCSS, ESLint
- [x] 8 citizen modules (Identity, Vehicles, Health, Work, Family, Services, Emergency, Profile)
- [x] Government admin dashboard (users, documents, analytics, tickets, settings)
- [x] Authentication flows (login, register, verify) with mock auth
- [x] 11 reusable UI components + document/card/layout components
- [x] Multi-country configuration (Colombia, Ecuador, Guatemala)
- [x] Supabase integration (client, server, middleware)
- [x] Database schema (12 tables) with RLS policies
- [x] Playwright E2E test suite
- [x] Bilingual documentation (English + Spanish)
