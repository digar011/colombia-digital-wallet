# TODO -- Mi Colombia Digital

> Task queue for the Mi Colombia Digital platform.
> For detailed descriptions, dependencies, and file-level instructions, see `docs/TODO_QUEUE.md`.
> For full rationale behind each change, see `docs/PRODUCTION_ROADMAP.md`.
>
> Last Updated: 2026-02-28

---

## Queue

### P0 -- Blockers

- [ ] Replace mock auth with Supabase Auth (useAuth, AuthContext, middleware, login/register/verify pages)
- [ ] Implement API routes for all endpoints documented in `docs/en/API_REFERENCE.md`
- [ ] Connect all citizen/admin/agency pages to real data via TanStack React Query hooks

### P1 -- Critical

- [ ] End-to-end RLS verification with real Supabase Auth tokens across all 12 tables
- [ ] Wire Zod validation schemas into all API routes (server-side) and form components (client-side)
- [ ] Integrate CSRF protection into state-changing API routes
- [ ] Set up Sentry error monitoring (`@sentry/nextjs`)
- [ ] Implement structured server-side logging in API routes (audit trail for document access)

### P2 -- High

- [ ] Generate production PWA icons (replace placeholder SVGs with proper app logo assets)
- [ ] Implement service worker with `next-pwa` for offline document caching
- [ ] Expand E2E test coverage (admin flows, error states, accessibility tests with axe)
- [ ] WCAG 2.1 AA accessibility audit (Lighthouse, screen reader testing, keyboard navigation)

### P3 -- Medium

- [ ] Rate limiting on auth and verification endpoints (apply `src/lib/middleware/rateLimit.ts` to API routes)
- [ ] Performance optimization (Lighthouse audit, bundle analysis, image optimization)
- [ ] Load testing with k6 or Artillery (target: 10,000 concurrent users)
- [ ] API key management for external agency integrations

---

## In Progress

(none currently)

---

## Completed

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
