# Changelog

All notable changes to the Colombia Digital Wallet (Mi Colombia Digital) project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased] - 2026-03-01

### Added
- **Zod validation wired into citizen and admin forms**: Profile edit form with `updateProfileSchema`, appointment booking form with `appointmentBookingSchema`, admin document issuance with `issueDocumentSchema`, admin user search with `searchCitizensSchema`, admin user status change with `updateCitizenStatusSchema`.
- **Profile edit mode**: Inline editing for phone, email, address, city, and department with real-time Zod validation and Spanish error messages.
- **Appointment booking form**: Service type selector, date/time pickers, and notes field with full validation replacing the placeholder alert.
- **Admin document issuance validation**: Form-level validation on citizen ID and document type with inline error display.
- **Admin user status change form**: Status selector and reason field with min-length validation for audit trail.
- **AdminRoleContext**: Missing context file created (`src/lib/contexts/AdminRoleContext.tsx`) to fix pre-existing build error.
- **Structured logging in middleware**: Route protection decisions (redirects, blocks, allows) now logged via `logger.info`/`logger.debug` with pathname and action metadata.
- **Auth event logging**: `logAuthEvent()` wired into `useAuth` hook for login, register, logout, and failed login events with structured metadata.
- **API response helpers** (`src/lib/utils/apiHelpers.ts`): Standardized `createApiResponse()`, `createErrorResponse()`, `ApiErrors` factory, and `withAuth()` wrapper for future API routes.
- **CSRF token endpoint** (`src/app/api/csrf/route.ts`): GET `/api/csrf` issues tokens via double-submit cookie pattern, rate limited by `authLimiter` (10 req/min per IP).
- **useCsrf hook** (`src/lib/hooks/useCsrf.ts`): Client-side hook that auto-fetches CSRF token on mount and provides `refreshToken` for on-demand refresh.
- **30 new E2E tests** across 3 files (136 total test cases, 408 across 3 browser projects):
  - `tests/e2e/auth/auth-errors.spec.ts` (10 tests): Login validation errors (empty form, invalid email, short password), phone/email toggle, register step validation, OTP page.
  - `tests/e2e/admin/admin-settings.spec.ts` (8 tests): Settings page rendering, tab navigation (System, API Keys, Roles, Audit Log), save/cancel buttons.
  - `tests/e2e/citizen/empty-states.spec.ts` (12 tests): Documents categories, services sections, emergency contacts, profile info, family documents, work/tax documents.
- **Production PWA icons**: 12 PNG icons generated from SVG source via `sharp`:
  - Standard PWA sizes: 72, 96, 128, 144, 152, 192, 384, 512px
  - Apple touch icon: 180x180
  - Favicons: 16x16, 32x32
  - Maskable variant: 512x512 with Colombia blue safe-area padding
- **Icon generation script** (`scripts/generate-pwa-icons.mjs`): Reproducible PNG generation from SVG source.
- Updated `manifest.json` to reference PNG icons as primary with separate maskable entry.

### Fixed
- **WCAG 2.1 AA accessibility audit**: Comprehensive accessibility improvements across all UI components and pages.
  - `layout.tsx`: Allow user zoom (`userScalable: true`, `maximumScale: 5`) — fixes WCAG 1.4.4 Resize Text.
  - `Button.tsx`: Add `aria-busy` when loading, `aria-hidden` on decorative icons.
  - `Input.tsx`: Fix right icon keyboard access (`tabIndex={0}` + `onKeyDown`), `aria-hidden` on decorative left icon.
  - `Modal.tsx`: Use `useId()` for unique `aria-labelledby`/`aria-describedby` IDs — prevents conflicts with multiple modals.
  - `LoadingSpinner.tsx`: Add `role="status"` and `aria-label` for screen reader announcements.
  - `EmptyState.tsx`: Add `aria-hidden` on decorative icon container.
  - `AdminHeader.tsx`: Add `aria-label` on search input, `aria-expanded`/`aria-haspopup` on user menu, `aria-pressed` on role toggle, `role="menu"`/`role="menuitem"` on dropdown, `aria-hidden` on breadcrumb separators.
  - `Dashboard page`: Add `role="status"` on loading state, `aria-label` on notification bell and stat buttons, visible focus rings on interactive cards.
  - `Citizen layout`: Remove redundant `role="main"` (implicit on `<main>`).

## [0.4.0] - 2026-02-26

### Added
- Security headers in `next.config.mjs`: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-DNS-Prefetch-Control.
- GitHub Actions CI/CD pipeline (`.github/workflows/ci.yml`): automated build, lint, and Playwright tests on push/PR to main.
- `CHANGELOG.md` — Full project history in Keep a Changelog format.
- `docs/PRODUCTION_ROADMAP.md` — Complete record of all changes (completed + planned) with rationale for each.
- `docs/TODO_QUEUE.md` — Prioritized backlog of remaining work items with dependencies and effort estimates.
- **Zod validation** (`src/lib/validations/`): auth, citizen, and admin schemas with Spanish error messages. Wired into login and register forms.
- **Logger utility** (`src/lib/utils/logger.ts`): Structured JSON logging with `logApiRequest`, `logAuthEvent`, `logDocumentAccess` audit trail functions.
- **Rate limiter** (`src/lib/middleware/rateLimit.ts`): In-memory sliding-window rate limiter with 4 pre-configured tiers (auth, citizen, verification, admin).
- **CSRF protection** (`src/lib/utils/csrf.ts`): Double-submit cookie pattern with constant-time token comparison, ready for API route integration.
- **PWA icons** (`public/icons/`): 8 SVG icons with Colombian tricolor shield design at standard PWA sizes.
- **Country flags** (`public/flags/`): SVG flags for Colombia, Ecuador, Guatemala.
- **next-pwa configuration**: Service worker registration with development mode disabled.
- **Skeleton loading components** (`src/components/ui/Skeleton.tsx`, `SkeletonCard.tsx`, `SkeletonTable.tsx`): Animated placeholder components with dark mode support.
- **Loading states**: 6 `loading.tsx` files across citizen, admin, and agency route groups for automatic Next.js Suspense boundaries.
- **Accessibility improvements**: Skip-to-content link, focus trapping in modals, `aria-current="page"` on active nav items, `aria-invalid`/`aria-describedby` on inputs, Spanish ARIA labels throughout.
- **78 new E2E tests** across 7 files: admin users (11), admin documents (11), admin analytics (13), citizen identity (11), citizen vehicles (10), citizen health (12), mobile navigation (10).
- `docs/TODO_QUEUE.md` — Ordered backlog of 16 remaining work items with priorities, dependencies, effort, and specific file-level instructions.

### Changed
- Updated all 8 documentation files (4 English + 4 Spanish) to accurately reflect the current codebase:
  - README.md: Fixed project structure (added `services/book`, `admin/tickets`, `admin/users/[id]`), added `lib/providers`, updated environment variables table.
  - ONBOARDING.md (EN + ES): Fixed key directories, mock data listing, environment variables, and test file structure.
  - ARCHITECTURE.md (EN + ES): Added agency portal to system diagrams and component tree, fixed API layer description.
  - API_REFERENCE.md (EN + ES): Added notice that API endpoints are planned and not yet implemented.
  - TESTING.md (EN + ES): Fixed test structure to match actual files, corrected Playwright project configuration.

## [0.3.0] - 2026-02-23

### Added
- Complete agency portal system with 6 agencies per country (Identity, Vehicles, Tax, Health, Social Services, Technology).
- 6 agency pages: dashboard, documents, citizens, requests, analytics, and settings.
- Agency login with institutional `.gov.co` email authentication.
- AgencySidebar and AgencyHeader layout components with dedicated agency layout and separate auth flow.
- `agencyData.ts` mock data covering all 3 supported countries (~1,800 lines).
- Age-based identity documents: Tarjeta de Identidad for minors, Cedula de Ciudadania for adults.
- Test admin account (`admin123@test.gov.co` / `Test123!`).
- PWA `manifest.json` for progressive web app support.
- 9 new Playwright E2E tests for the agency portal (84 total tests passing).

### Changed
- Updated middleware to handle separate citizen and agency authentication flows.
- Translated all admin pages to Spanish (305+ strings).
- Admin analytics KPI cards are now clickable with navigation to detail views.
- Updated README and onboarding documentation to cover agency portal features.

## [0.2.0] - 2026-02-22

### Fixed
- Root page no longer crashes when Supabase environment variables are missing.
- Supabase server client throws a clear error message instead of silently using `undefined` credentials.
- Dashboard navigation test handles login redirect gracefully.

### Changed
- All 19 Playwright E2E tests now pass without requiring a live Supabase connection.

## [0.1.0] - 2026-02-22

### Added
- Full platform built on Next.js 14 with TypeScript, TailwindCSS, and TanStack React Query.
- 8 citizen modules: Identity (Cedula), Vehicles (RUNT), Health (EPS/ADRES), Work & Tax (DIAN), Family, Services (SISBEN), Emergency, and Profile.
- Government admin dashboard with pages for users, documents, analytics, settings, and user detail view.
- Authentication flows: login, register, and verify pages with mock-based localStorage auth.
- 11 UI components: Avatar, Badge, Button, Card, EmptyState, Input, LoadingSpinner, Modal, QRCode, Tabs, and barrel index.
- 4 document components: DocumentCard, DocumentViewer, HealthCard, VehicleCard.
- 2 card components: QuickActionCard, StatCard.
- 5 layout components: AdminHeader, BottomNav, CountrySwitcher, Header, Sidebar.
- Multi-country configuration: `colombia.json`, `ecuador.json`, `guatemala.json` with a shared config loader.
- AuthContext and CountryContext for global state management.
- QueryProvider wrapping TanStack React Query.
- Supabase integration: `client.ts`, `server.ts`, `middleware.ts`.
- Database type definitions (`database.ts`) covering 12 tables (878 lines).
- Mock data: `citizenData.ts` and `adminData.ts`.
- Utility: `cn.ts` using clsx + tailwind-merge.
- Database migrations: `001_initial_schema.sql` (12 tables) and `002_rls_policies.sql` (row-level security for all tables).
- Root middleware for route protection.
- Playwright configuration with 8 E2E test files covering auth, dashboard, documents, profile, emergency, services, admin, and country switching.
- Full documentation suite: README plus 4 English and 4 Spanish guides (Onboarding, Architecture, API Reference, Testing).
- `.env.local.example` with all required environment variable placeholders.
- Colombian flag colors theming, dark mode support, and PWA-ready architecture.
- Custom CSS animations in `globals.css`.

## [0.0.0] - 2026-02-22

### Added
- Scaffolded Next.js 14 project using Create Next App with TypeScript, TailwindCSS, and ESLint.
- Default template files: layout, page, global styles, Geist fonts, favicon, and configuration files.
