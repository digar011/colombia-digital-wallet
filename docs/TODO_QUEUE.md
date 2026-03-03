# TODO Queue — Mi Colombia Digital

> **Purpose**: Ordered backlog of remaining work items for production readiness. Each item includes priority, dependencies, and estimated effort. See `PRODUCTION_ROADMAP.md` for full rationale behind each change.
>
> **Last Updated**: March 2, 2026

---

## Legend

| Priority | Meaning |
|----------|---------|
| P0 | **Blocker** — Cannot launch without this |
| P2 | **Medium** — Important but can follow shortly after launch |

| Status | Meaning |
|--------|---------|
| `TODO` | Not started |
| `BLOCKED` | Waiting on a dependency |
| `DONE` | Completed |

---

## P0 — Blockers (Require Supabase credentials)

### 1. Replace mock auth with Supabase Auth
- **Status**: `BLOCKED` (requires Supabase credentials)
- **GitHub Issue**: [#15](https://github.com/digar011/colombia-digital-wallet/issues/15)
- **Effort**: 2-3 days
- **Files to modify**:
  - `src/lib/hooks/useAuth.ts` — Replace localStorage with Supabase `signInWithPassword`, `signUp`, `signOut`
  - `src/lib/contexts/AuthContext.tsx` — Use Supabase session listener (`onAuthStateChange`)
  - `src/middleware.ts` — Replace cookie check with Supabase JWT verification via `@supabase/ssr`
  - `src/app/(auth)/login/page.tsx` — Wire form to real Supabase auth
  - `src/app/(auth)/register/page.tsx` — Wire form to real Supabase auth
  - `src/app/(auth)/verify/page.tsx` — Use Supabase email verification

### 2. Connect API routes to Supabase database
- **Status**: `BLOCKED` (waiting on #1)
- **GitHub Issue**: [#16](https://github.com/digar011/colombia-digital-wallet/issues/16)
- **Effort**: 3-5 days
- **What to do**:
  1. Update all 21 API routes to query real Supabase database instead of returning mock data
  2. Citizen routes filter by `auth.uid()` (RLS handles this)
  3. Admin routes check role claim in JWT
  4. Verification endpoint remains public (no auth required)
  5. Seed the database with test data for QA

### 3. Wire pages to React Query hooks
- **Status**: `BLOCKED` (waiting on #1, #2)
- **GitHub Issue**: [#17](https://github.com/digar011/colombia-digital-wallet/issues/17)
- **Effort**: 2-3 days
- **What to do**:
  1. Update each citizen/admin/agency page to use React Query hooks instead of importing mock data directly
  2. Keep mock data as fallback when `NEXT_PUBLIC_ENABLE_MOCK_DATA=true`
  3. Loading states already exist (PR #46) — verify integration

### 4. Add admin role-based access control
- **Status**: `BLOCKED` (waiting on #1)
- **GitHub Issue**: [#18](https://github.com/digar011/colombia-digital-wallet/issues/18)
- **Effort**: 1-2 days
- **What to do**:
  1. Admin API endpoints check JWT role claims before executing queries
  2. Citizen tokens rejected by admin endpoints
  3. Role hierarchy: super_admin, admin, operator, viewer

### 5. Fix npm audit vulnerabilities
- **Status**: `TODO`
- **GitHub Issue**: [#19](https://github.com/digar011/colombia-digital-wallet/issues/19)
- **Effort**: 0.5-1 day
- **What to do**:
  1. Run `npm audit --audit-level=high` and fix reported vulnerabilities
  2. Update affected packages or apply overrides where needed

---

## P2 — Medium

### 6. Replace in-memory rate limiter with Redis
- **Status**: `BLOCKED` (requires Redis/KV infrastructure)
- **GitHub Issue**: [#29](https://github.com/digar011/colombia-digital-wallet/issues/29)
- **Effort**: 1 day
- **What to do**:
  1. Replace `src/lib/middleware/rateLimit.ts` in-memory store with Redis-backed solution
  2. Use `@upstash/ratelimit` or similar for distributed rate limiting
  3. Maintain the 4 existing rate limit tiers (auth, citizen, admin, verification)

---

## Backlog (Require running infrastructure)

- End-to-end RLS verification with real Supabase Auth tokens — requires Supabase + real auth
- Load testing with k6 or Artillery (10,000 concurrent) — requires running infrastructure
- API key management for external agency integrations — requires real API keys

---

## Quick Reference — Dependency Chain

```
#1 Real Auth ──────┬──→ #2 API → Supabase ──→ #3 Wire Pages to Hooks
                   ├──→ #4 Admin RBAC
                   └──→ RLS Verification (backlog)

Independent:       #5 npm audit
                   #6 Redis rate limiter (infra-dependent)
```

---

## Completed

### Production Hardening: P2 Items (March 2, 2026)
| Item | PR | Issue | Status |
|------|-----|-------|--------|
| Add loading.tsx and Suspense boundaries for all routes | #46 | #30 | DONE |
| Add structured data (JSON-LD) for public pages | #45 | #31 | DONE |
| Add npm audit to CI pipeline | #43 | #32 | DONE |
| Configure Playwright for production build | #44 | #33 | DONE |

### Production Hardening: P1 Items (March 2, 2026)
| Item | PR | Issue | Status |
|------|-----|-------|--------|
| Add robots.txt and sitemap.xml via Next.js metadata API | #37 | #20 | DONE |
| Add route-level error.tsx boundaries | #38 | #21 | DONE |
| Remove hardcoded mock API key from agency settings | #34 | #22 | DONE |
| Add aria-live regions for dynamic content | #39 | #23 | DONE |
| Harden CSP: remove unsafe-eval from script-src | #42 | #24 | DONE |
| Add Makefile with standardized commands | #35 | #25 | DONE |
| Configure Biome code formatter (v2.4.4) | #41 | #26 | DONE |
| Add 223 unit tests with Jest (98%+ coverage) | #40 | #27 | DONE |
| Document Sentry DSN setup | #36 | #28 | DONE |

### API Routes, React Query, Sentry, Offline Caching (March 2, 2026)
| Item | PR | Status |
|------|-----|--------|
| 21 API routes with mock data (auth, citizen, admin, verify) | #11 | DONE |
| Zod validation on all API routes (server-side) | #11 | DONE |
| CSRF protection on all state-changing routes | #11 | DONE |
| Structured logging in all API routes | #11 | DONE |
| Rate limiting on all API routes (4 tiers) | #11 | DONE |
| React Query hooks for all 17 API endpoints | #12 | DONE |
| Type-safe API client (fetchApi) | #12 | DONE |
| Sentry error monitoring (client, server, edge) | #9 | DONE |
| Global error boundary with Spanish UI | #9 | DONE |
| Runtime caching strategies (next-pwa) | #10 | DONE |
| Offline fallback page (/offline) | #10 | DONE |
| useOfflineStatus hook + OfflineBanner | #10 | DONE |

### Validation, Logging, Security, A11y, Tests, PWA, Performance (March 1, 2026)
| Item | PR | Status |
|------|-----|--------|
| Zod validation on citizen and admin forms | #2 | DONE |
| Structured logging in middleware and auth hook | #3 | DONE |
| API response helpers (apiHelpers.ts) | #3 | DONE |
| CSRF token endpoint + useCsrf hook | #4 | DONE |
| WCAG 2.1 AA accessibility audit | #5 | DONE |
| 30 new E2E tests (136 total) | #6 | DONE |
| Production PWA icons (12 PNGs) | #7 | DONE |
| Performance: dynamic import QR, next/image avatars | #8 | DONE |
| Fix build error: create AdminRoleContext.tsx | -- | DONE |

### Standardization (February 28, 2026)
| Item | Status |
|------|--------|
| ONBOARDING.md, PRODUCT.md, TODO.md, .env.example, CLAUDE.md | DONE |

### Documentation and Security Audit (February 26, 2026)
| Item | Status |
|------|--------|
| Update 8 documentation files, security headers, CI/CD, CHANGELOG, PRODUCTION_ROADMAP, TODO_QUEUE, Zod, logger, rate limiter, CSRF, PWA icons, flags, skeletons, a11y, 78 E2E tests | DONE |
