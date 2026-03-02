# Onboarding Guide -- Mi Colombia Digital

Welcome to Mi Colombia Digital, a Citizen Digital Wallet platform for Colombia. This guide will get you up and running as a new developer on the team.

> Detailed onboarding documentation is also available in [English](docs/en/ONBOARDING.md) and [Spanish](docs/es/ONBOARDING.md).

---

## 1. Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ (20 LTS recommended) | JavaScript runtime |
| npm | 9+ | Package manager |
| Git | Latest | Version control |
| VS Code | Latest (recommended) | Code editor |
| Supabase CLI | Latest (optional) | Database management |

### Recommended VS Code Extensions

- ESLint
- Tailwind CSS IntelliSense
- TypeScript Importer
- Prettier
- ES7+ React Snippets

---

## 2. First-Time Setup

```bash
# 1. Clone the repository
git clone https://github.com/digar011/colombia-digital-wallet.git
cd colombia-digital-wallet

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials, or leave defaults for mock mode

# 4. Install Playwright browsers (for testing)
npx playwright install

# 5. Start the development server
npm run dev

# 6. Open http://localhost:3000 in your browser
```

### Demo Mode

The app runs fully in mock mode without any Supabase connection. Mock data loads automatically when no backend is configured.

**Demo credentials:**
- Email: `demo@micolombiadigital.gov.co`
- Password: `demo123`

**Test admin credentials:**
- Email: `admin123@test.gov.co`
- Password: `Test123!`

---

## 3. Architecture Overview

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, TailwindCSS |
| State | Zustand (global), TanStack React Query (server) |
| Backend | Supabase (PostgreSQL, Auth, Storage, Real-time) |
| PWA | next-pwa (offline support, installable) |
| Testing | Playwright (E2E) |
| CI/CD | GitHub Actions |
| Deployment | Vercel (recommended) |

### Route Groups

The app uses Next.js App Router route groups to separate layouts:

| Group | Purpose | Layout |
|-------|---------|--------|
| `(auth)/` | Login, Register, Verify | Minimal layout |
| `(citizen)/` | Citizen-facing app (Spanish UI) | Header + BottomNav |
| `(admin)/` | Government admin dashboard | Sidebar + AdminHeader |
| `(agency)/` | Agency staff portal | AgencySidebar + AgencyHeader |

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/app/` | Pages and API routes (Next.js App Router) |
| `src/components/ui/` | Reusable UI components (Button, Card, Input, etc.) |
| `src/components/documents/` | Document card components (Cedula, Vehicle, Health) |
| `src/components/layout/` | Layout components (BottomNav, Header, Sidebar, AgencySidebar) |
| `src/config/countries/` | Country-specific JSON configurations (CO, EC, GT) |
| `src/lib/contexts/` | React contexts (Auth, Country, AdminRole) |
| `src/lib/hooks/` | Custom React hooks (useAuth) |
| `src/lib/mock/` | Mock data for development (citizenData, adminData, agencyData, ticketData) |
| `src/lib/supabase/` | Supabase client configuration (client.ts, server.ts, middleware.ts) |
| `src/lib/validations/` | Zod validation schemas (auth, citizen, admin) |
| `src/lib/utils/` | Utility functions (cn.ts, logger.ts, csrf.ts) |
| `src/lib/middleware/` | Rate limiter middleware |
| `supabase/migrations/` | SQL database migrations |
| `tests/e2e/` | Playwright E2E test files |
| `docs/en/` | English documentation |
| `docs/es/` | Spanish documentation |

---

## 4. Key Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| PWA over Native App | PWA | Faster iteration, no app store dependency, Playwright testing |
| Next.js App Router | App Router | Server components, route groups for layout separation |
| Supabase over Custom API | Supabase | Built-in auth, RLS, real-time, fast setup |
| TailwindCSS over CSS-in-JS | TailwindCSS | Performance, consistency, easy theming |
| Zustand over Redux | Zustand | Simpler, less boilerplate, sufficient for needs |
| Mock-first development | Yes | Full UI functional without backend for demos and stakeholder review |
| Spanish-first citizen UI | Yes | Colombian users are native Spanish speakers |
| White-label config per country | JSON files | Single config per country enables rapid multi-country expansion |

---

## 5. Conventions

### Language

- **Citizen-facing UI**: All text in Spanish (labels, buttons, messages, placeholders)
- **Code**: English (variable names, comments, function names)
- **Documentation**: Separate English (`docs/en/`) and Spanish (`docs/es/`) versions

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase.tsx | `DocumentCard.tsx` |
| Pages | page.tsx | Next.js convention |
| Hooks | useXxx.ts | `useAuth.ts` |
| Contexts | XxxContext.tsx | `AuthContext.tsx` |
| Utils | camelCase.ts | `formatDate.ts` |
| Types | camelCase.ts | `database.ts` |
| Tests | xxx.spec.ts | `auth.spec.ts` |

### Styling

- Use TailwindCSS for all styling
- Use `cn()` utility from `@/lib/utils/cn` for conditional classes
- Mobile-first responsive design (`sm:`, `md:`, `lg:` breakpoints)
- Dark mode support via `dark:` prefix
- Use country config colors for branding

### Git Workflow

```
main          -- production-ready code
  feature/xxx -- new features
  fix/xxx     -- bug fixes
  docs/xxx    -- documentation updates
```

---

## 6. Multi-Country System

Each country has a JSON config file in `src/config/countries/`:
- `colombia.json` -- Colors, documents, agencies, emergency numbers, social programs
- `ecuador.json` -- Ecuador-specific configuration
- `guatemala.json` -- Guatemala-specific configuration

To add a new country:
1. Create `src/config/countries/[country-code].json`
2. Register it in `src/config/index.ts`
3. Add country flag to `public/flags/`
4. Test with the `CountrySwitcher` component

---

## 7. Database

### Migrations

SQL migration files are in `supabase/migrations/`:
- `001_initial_schema.sql` -- 12 tables and indexes
- `002_rls_policies.sql` -- Row Level Security policies for all tables

### Key Tables

`citizens`, `digital_documents`, `vehicles`, `health_records`, `vaccinations`, `family_members`, `citizen_services`, `work_tax_records`, `appointments`, `verification_logs`, `admin_users`, `notifications`

All tables have Row-Level Security (RLS) enabled.

---

## 8. Testing

```bash
npm run test:e2e              # Run all E2E tests
npm run test:e2e:ui           # Run with Playwright UI mode
npm run test:e2e:headed       # Run with visible browser
npx playwright test tests/e2e/auth/      # Run specific suite
npx playwright show-report    # View HTML report
```

Tests run on 3 Playwright projects: chromium-desktop, mobile-chrome (Pixel 5), mobile-safari (iPhone 12).

---

## 9. Common Tasks

### Add a new document type

1. Add type to `src/config/countries/colombia.json` under `documents`
2. Add TypeScript type in `src/lib/types/database.ts`
3. Create card component in `src/components/documents/`
4. Add page in `src/app/(citizen)/documents/`
5. Add mock data in `src/lib/mock/citizenData.ts`
6. Write Playwright test in `tests/e2e/citizen/`

### Modify the database schema

1. Create new migration file in `supabase/migrations/`
2. Update TypeScript types in `src/lib/types/database.ts`
3. Update mock data if needed
4. Run `npx supabase db push`

---

## 10. Troubleshooting

**"Module not found" errors** -- Run `npm install` to reinstall dependencies.

**Port 3000 already in use** -- Kill the process (`npx kill-port 3000`) or use a different port (`npm run dev -- -p 3001`).

**Supabase connection failing** -- Check `.env.local` has correct values. The app automatically falls back to mock data when no backend is configured.

**Playwright tests failing** -- Run `npx playwright install` to install/update browsers, then `npm run build` to verify the production build works.

---

## Need Help?

- Check the [English docs](docs/en/) or [Spanish docs](docs/es/)
- Review `docs/PRODUCTION_ROADMAP.md` for full change history and rationale
- Review `docs/TODO_QUEUE.md` for the current backlog
- Contact Diego Garnica: diego.j.garnica@gmail.com
- Open an issue on GitHub
