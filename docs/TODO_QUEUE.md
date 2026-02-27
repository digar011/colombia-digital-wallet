# TODO Queue — Mi Colombia Digital

> **Purpose**: Ordered backlog of remaining work items for production readiness. Each item includes priority, dependencies, and estimated effort. See `PRODUCTION_ROADMAP.md` for full rationale behind each change.
>
> **Last Updated**: February 26, 2026

---

## Legend

| Priority | Meaning |
|----------|---------|
| P0 | **Blocker** — Cannot launch without this |
| P1 | **Critical** — Must have for production |
| P2 | **High** — Should have before public launch |
| P3 | **Medium** — Important but can follow shortly after launch |

| Status | Meaning |
|--------|---------|
| `TODO` | Not started |
| `IN PROGRESS` | Currently being worked on |
| `BLOCKED` | Waiting on a dependency |
| `DONE` | Completed |

---

## P0 — Blockers (Cannot launch without)

### 1. Replace mock auth with Supabase Auth
- **Status**: `TODO`
- **Dependencies**: None (Supabase project already exists)
- **Effort**: 2-3 days
- **Files to modify**:
  - `src/lib/hooks/useAuth.ts` — Replace localStorage with Supabase `signInWithPassword`, `signUp`, `signOut`
  - `src/lib/contexts/AuthContext.tsx` — Use Supabase session listener (`onAuthStateChange`)
  - `src/middleware.ts` — Replace cookie check with Supabase JWT verification via `@supabase/ssr`
  - `src/app/(auth)/login/page.tsx` — Wire form to real Supabase auth
  - `src/app/(auth)/register/page.tsx` — Wire form to real Supabase auth
  - `src/app/(auth)/verify/page.tsx` — Use Supabase email verification
- **What to do**:
  1. Update `useAuth` hook to call Supabase Auth methods instead of localStorage
  2. Update `AuthContext` to subscribe to `onAuthStateChange` for session state
  3. Update middleware to use `@supabase/ssr` `createServerClient` for JWT validation
  4. Add password reset flow (new page at `/reset-password`)
  5. Add email verification handling in `/verify` page
  6. Remove hardcoded demo accounts from production builds (keep behind env flag)

### 2. Implement API routes
- **Status**: `TODO`
- **Dependencies**: #1 (auth must work first for JWT validation)
- **Effort**: 3-5 days
- **Files to create** (in `src/app/api/`):
  - `auth/login/route.ts`
  - `auth/register/route.ts`
  - `auth/logout/route.ts`
  - `auth/refresh/route.ts`
  - `citizens/me/route.ts`
  - `documents/route.ts`
  - `documents/[id]/route.ts`
  - `documents/[id]/qr/route.ts`
  - `vehicles/route.ts`
  - `health/route.ts`
  - `health/vaccinations/route.ts`
  - `services/route.ts`
  - `appointments/route.ts`
  - `verify/route.ts` (public)
  - `admin/citizens/route.ts`
  - `admin/citizens/[id]/route.ts`
  - `admin/documents/issue/route.ts`
  - `admin/analytics/route.ts`
  - `admin/verification-logs/route.ts`
- **What to do**:
  1. Each route creates a Supabase server client and validates the JWT
  2. Citizen routes filter by `auth.uid()` (RLS handles this)
  3. Admin routes check role claim in JWT
  4. Verification endpoint is public (no auth required)
  5. Follow the contracts in `docs/en/API_REFERENCE.md`

### 3. Connect pages to real data
- **Status**: `TODO`
- **Dependencies**: #1, #2
- **Effort**: 3-4 days
- **What to do**:
  1. Create TanStack React Query hooks for each data domain (useDocuments, useVehicles, useHealth, etc.)
  2. Each hook calls the API routes or direct Supabase client
  3. Keep mock data as fallback when `NEXT_PUBLIC_ENABLE_MOCK_DATA=true`
  4. Update each page to use the new hooks instead of importing mock data directly
  5. Handle loading states, error states, and empty states
  6. Seed the database with test data for QA

---

## P1 — Critical (Must have for production)

### 4. End-to-end RLS verification
- **Status**: `BLOCKED` (waiting on #1)
- **Dependencies**: #1, #3
- **Effort**: 1-2 days
- **What to do**:
  1. Create test script that authenticates as different users and verifies data isolation
  2. Test citizen A cannot see citizen B's documents
  3. Test admin role can read all citizens
  4. Test agency staff access is properly scoped
  5. Verify the 2 SQL migrations work correctly with real Supabase auth tokens

### 5. Input validation with Zod
- **Status**: `TODO`
- **Dependencies**: None
- **Effort**: 1-2 days
- **Files to create/modify**:
  - `src/lib/validations/auth.ts` — Login, register, password reset schemas
  - `src/lib/validations/citizen.ts` — Profile update, document request schemas
  - `src/lib/validations/admin.ts` — User management, document issuance schemas
  - Update all form pages to validate with Zod before submission
- **What to do**:
  1. Install `zod` package
  2. Define schemas for all form inputs
  3. Add server-side validation in API routes
  4. Add client-side validation in form components
  5. Display validation errors in Spanish for citizen-facing forms

### 6. CSRF protection
- **Status**: `TODO`
- **Dependencies**: #2 (needs API routes)
- **Effort**: 0.5 day
- **What to do**:
  1. Implement CSRF token generation and validation for state-changing API routes
  2. Add CSRF token to forms via hidden input or header

### 7. Error monitoring (Sentry)
- **Status**: `TODO`
- **Dependencies**: None
- **Effort**: 0.5 day
- **What to do**:
  1. Install `@sentry/nextjs`
  2. Create `sentry.client.config.ts` and `sentry.server.config.ts`
  3. Add Sentry DSN to environment variables
  4. Wrap root layout with Sentry error boundary
  5. Add source maps upload to CI build

### 8. Server-side logging
- **Status**: `TODO`
- **Dependencies**: #2 (needs API routes to log)
- **Effort**: 1 day
- **What to do**:
  1. Create logger utility (`src/lib/utils/logger.ts`)
  2. Log all API route requests (method, path, user ID, status, duration)
  3. Log authentication events (login, register, logout, failed attempts)
  4. Log document access and verification events (government audit trail)

---

## P2 — High (Should have before public launch)

### 9. PWA icons and assets
- **Status**: `TODO`
- **Dependencies**: None
- **Effort**: 0.5 day
- **What to do**:
  1. Generate PWA icon set from Colombia coat of arms or app logo (192x192, 512x512, maskable, etc.)
  2. Add icons to `public/icons/`
  3. Add country flag PNGs to `public/flags/` (CO, EC, GT)
  4. Update `manifest.json` with correct icon references
  5. Add Apple touch icons and splash screens

### 10. Service worker / offline support
- **Status**: `TODO`
- **Dependencies**: #3 (needs real data to cache)
- **Effort**: 1-2 days
- **What to do**:
  1. Configure `next-pwa` in `next.config.mjs` (package already installed)
  2. Define precache strategy for core document pages
  3. Cache citizen's primary documents locally for offline viewing
  4. Show offline indicator banner when connection is lost
  5. Queue verification requests when offline, sync when back online

### 11. Expand E2E test coverage
- **Status**: `TODO`
- **Dependencies**: None (can test against mock data)
- **Effort**: 2-3 days
- **What to do**:
  1. Add tests for admin user management flow
  2. Add tests for admin document issuance
  3. Add tests for admin analytics views
  4. Add mobile-specific interaction tests
  5. Add error state and empty state tests
  6. Add accessibility tests (axe integration with Playwright)

### 12. Accessibility audit (WCAG 2.1 AA)
- **Status**: `TODO`
- **Dependencies**: None
- **Effort**: 2-3 days
- **What to do**:
  1. Run Lighthouse accessibility audit on all pages
  2. Add proper ARIA labels to all interactive elements
  3. Ensure keyboard navigation works across all flows
  4. Verify color contrast ratios meet AA standards
  5. Add skip-to-content links
  6. Test with screen reader (NVDA/VoiceOver)

---

## P3 — Medium (Can follow shortly after launch)

### 13. Rate limiting
- **Status**: `TODO`
- **Dependencies**: #2 (needs API routes)
- **Effort**: 1 day
- **What to do**:
  1. Install rate limiting package (e.g., `@upstash/ratelimit` or custom in-memory)
  2. Apply strict limits on auth endpoints (10 attempts/minute per IP)
  3. Apply moderate limits on citizen API (100 req/min)
  4. Apply higher limits on verification endpoint (1000 req/min)
  5. Return 429 with `Retry-After` header

### 14. Performance optimization
- **Status**: `TODO`
- **Dependencies**: #3 (needs real data for meaningful metrics)
- **Effort**: 1-2 days
- **What to do**:
  1. Run Lighthouse performance audit
  2. Optimize images (next/image, WebP conversion)
  3. Analyze and reduce JavaScript bundle size
  4. Add loading skeletons to replace loading spinners
  5. Verify targets in ARCHITECTURE.md (FCP < 1.5s, LCP < 2.5s, TTI < 3s)

### 15. Load testing
- **Status**: `BLOCKED` (waiting on #2, #3)
- **Dependencies**: #2, #3
- **Effort**: 1 day
- **What to do**:
  1. Set up k6 or Artillery load test scripts
  2. Test auth endpoints under concurrent load
  3. Test verification endpoint (expected high traffic from officials)
  4. Test database query performance with realistic data volume
  5. Identify and fix bottlenecks

### 16. API key management for agency integrations
- **Status**: `TODO`
- **Dependencies**: #2
- **Effort**: 2 days
- **What to do**:
  1. Design API key schema (key, agency_id, rate_limit, permissions, created_at, expires_at)
  2. Create admin UI for generating/revoking API keys
  3. Add API key validation middleware for external agency requests
  4. Add usage tracking and analytics per key

---

## Quick Reference — Dependency Chain

```
#1 Real Auth ──────┬──→ #2 API Routes ──┬──→ #3 Real Data ──┬──→ #4 RLS Verification
                   │                    │                    ├──→ #10 Service Worker
                   │                    ├──→ #6 CSRF         ├──→ #14 Performance
                   │                    ├──→ #8 Logging      └──→ #15 Load Testing
                   │                    ├──→ #13 Rate Limit
                   │                    └──→ #16 API Keys
                   │
Independent:       #5 Zod Validation
                   #7 Sentry
                   #9 PWA Assets
                   #11 E2E Tests
                   #12 Accessibility
```

---

## Completed Today (Feb 26, 2026)

| Item | Status |
|------|--------|
| Update 8 documentation files to match codebase | DONE |
| Security headers (CSP, HSTS, etc.) in `next.config.mjs` | DONE |
| CI/CD pipeline (`.github/workflows/ci.yml`) | DONE |
| CHANGELOG.md | DONE |
| PRODUCTION_ROADMAP.md | DONE |
| TODO_QUEUE.md (this file) | DONE |
