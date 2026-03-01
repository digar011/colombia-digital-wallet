# CLAUDE.md -- Mi Colombia Digital

## Project

**Name:** Mi Colombia Digital (colombia-digital-wallet)
**Type:** Citizen Digital Wallet -- Progressive Web App (PWA)
**Description:** Centralizes Colombian government documents and services into a single mobile-first web application. White-label, multi-country framework supporting Colombia, Ecuador, and Guatemala.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** TailwindCSS 3 with dark mode (`class` strategy)
- **State Management:** Zustand (global state), TanStack React Query (server state)
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Real-time)
- **Validation:** Zod (with Spanish error messages for citizen forms)
- **PWA:** next-pwa (offline support, installable)
- **QR Codes:** react-qr-code
- **Icons:** Lucide React
- **Testing:** Playwright (E2E, 3 browser projects)
- **CI/CD:** GitHub Actions
- **Deployment:** Vercel (recommended)

## Project Structure

```
src/
  app/
    (auth)/           # Login, register, verify pages
    (citizen)/        # Citizen-facing app (Spanish UI)
    (admin)/          # Government admin dashboard
    (agency)/         # Agency staff portal (multi-country)
    api/              # API routes (planned, not yet implemented)
  components/
    ui/               # Reusable components (Button, Card, Input, Modal, etc.)
    documents/        # Document cards (DocumentCard, VehicleCard, HealthCard)
    cards/            # Dashboard cards (StatCard, QuickActionCard)
    layout/           # Navigation (Header, BottomNav, Sidebar, AgencySidebar)
    admin/            # Admin-specific components
    auth/             # Auth form components
  config/
    countries/        # Country JSON configs (colombia.json, ecuador.json, guatemala.json)
    index.ts          # Config loader
  lib/
    supabase/         # Supabase clients (client.ts, server.ts, middleware.ts)
    contexts/         # React contexts (AuthContext, CountryContext, AdminRoleContext)
    hooks/            # Custom hooks (useAuth)
    providers/        # QueryProvider (TanStack React Query)
    types/            # TypeScript types (database.ts)
    mock/             # Mock data (citizenData, adminData, agencyData, ticketData)
    validations/      # Zod schemas (auth, citizen, admin)
    utils/            # Utilities (cn.ts, logger.ts, csrf.ts)
    middleware/       # Rate limiter (rateLimit.ts)
  middleware.ts       # Root middleware (route protection, auth redirects)
supabase/
  migrations/         # SQL migrations (001_initial_schema, 002_rls_policies)
tests/
  e2e/                # Playwright tests organized by feature area
    auth/             # Authentication tests
    citizen/          # Citizen app tests
    admin/            # Admin dashboard tests
    agency/           # Agency portal tests
    config/           # Multi-country switching tests
docs/
  en/                 # English documentation (ONBOARDING, ARCHITECTURE, API_REFERENCE, TESTING)
  es/                 # Spanish documentation (same structure)
  PRODUCTION_ROADMAP.md
  TODO_QUEUE.md
```

## Setup

```bash
npm install
cp .env.local.example .env.local   # Configure environment variables
npm run dev                        # Start dev server at http://localhost:3000
npx playwright install             # Install test browsers (first time)
```

The app runs in mock mode by default -- no Supabase connection required. Set `NEXT_PUBLIC_ENABLE_MOCK_DATA=false` and provide Supabase credentials for real data.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin ops | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_DEFAULT_COUNTRY` | No | Default country code (`CO`, `EC`, `GT`). Default: `CO` |
| `NEXT_PUBLIC_APP_URL` | No | App URL. Default: `http://localhost:3000` |
| `NEXT_PUBLIC_ENABLE_MOCK_DATA` | No | Enable mock data mode. Default: `true` |
| `NEXT_PUBLIC_ENABLE_OFFLINE_MODE` | No | Enable offline/PWA mode. Default: `true` |
| `NEXT_PUBLIC_ENABLE_BIOMETRIC_AUTH` | No | Enable biometric auth. Default: `false` |

## Scripts

```bash
npm run dev              # Development server (port 3000)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # ESLint
npm run test:e2e         # Playwright E2E tests (all 3 browser projects)
npm run test:e2e:ui      # Playwright with interactive UI
npm run test:e2e:headed  # Playwright with visible browser
```

## Tests

- **Framework:** Playwright
- **Location:** `tests/e2e/`
- **Projects:** chromium-desktop, mobile-chrome (Pixel 5), mobile-safari (iPhone 12)
- **Config:** `playwright.config.ts`
- **Run all:** `npm run test:e2e`
- **Run specific:** `npx playwright test tests/e2e/auth/`
- **Report:** `npx playwright show-report`
- Tests run against `http://localhost:3000` with auto-start dev server.
- Tests use mock data -- no Supabase connection required.

## Deployment

- **Platform:** Vercel (recommended)
- **CI:** GitHub Actions (`.github/workflows/ci.yml`) runs build, lint, and Playwright tests on push/PR to main.
- **Branch:** `main` is the production branch.

## Project-Specific Rules

### Language in Code vs UI

- All citizen-facing UI text MUST be in Spanish (labels, buttons, messages, placeholders, ARIA labels, error messages).
- All code (variable names, comments, function names, type names) MUST be in English.
- Documentation exists in both English (`docs/en/`) and Spanish (`docs/es/`).

### Component Conventions

- Use `'use client'` directive only when the component uses hooks or state.
- Use the `cn()` utility from `@/lib/utils/cn` for conditional TailwindCSS classes.
- Use `@/` path alias for imports (maps to `src/`).
- Mobile-first responsive design. Always test on mobile viewports.
- Dark mode support via `dark:` prefix on all visual components.

### Mock Data

- Mock data files are in `src/lib/mock/` and follow the same TypeScript types as the database schema.
- The app automatically falls back to mock data when Supabase credentials are not configured.
- Keep mock data as a fallback behind `NEXT_PUBLIC_ENABLE_MOCK_DATA` flag -- do not remove it.

### Multi-Country

- Country configuration files are in `src/config/countries/`. Each country is a single JSON file.
- Use `useCountry()` hook from `@/lib/contexts/CountryContext` to access country-specific data.
- In production, each deployment is fixed to a single country. The `CountrySwitcher` is for admin/demo mode only.

### Database and Security

- All database tables have Row-Level Security (RLS) enabled. RLS policies use `auth.uid()` to enforce data isolation.
- Never reference `auth.users` table from RLS policies -- regular users cannot query it. Use `auth.jwt()` only.
- Citizen routes are protected by `auth-token` cookie. Agency routes use a separate `agency-token` cookie.
- API routes skip middleware auth checks and validate tokens server-side.
- The `SUPABASE_SERVICE_ROLE_KEY` must NEVER be exposed to the client.

### Test Conventions

- Test files use `.spec.ts` extension.
- Tests are organized by feature area under `tests/e2e/`.
- Use `data-testid` attributes for reliable element selection.
- Citizen UI assertions use Spanish text (e.g., `getByText('Panel Principal')`).
- Each test should work in isolation -- do not depend on test execution order.
- Test against both desktop and mobile viewports.

### Commits and Changelog

- Follow Conventional Commits format (`feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`).
- Update `CHANGELOG.md` following Keep a Changelog format for user-facing changes.
