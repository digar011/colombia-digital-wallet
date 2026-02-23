# Developer Onboarding Guide — Mi Colombia Digital

Welcome to the Mi Colombia Digital project! This guide will walk you through everything you need to get started as a developer on the team.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Development Environment Setup](#development-environment-setup)
3. [Architecture Overview](#architecture-overview)
4. [Running the Project](#running-the-project)
5. [Project Conventions](#project-conventions)
6. [Working with Mock Data](#working-with-mock-data)
7. [Multi-Country System](#multi-country-system)
8. [Database & Supabase](#database--supabase)
9. [Testing Guide](#testing-guide)
10. [Deployment](#deployment)
11. [Common Tasks](#common-tasks)
12. [Troubleshooting](#troubleshooting)

---

## 1. Project Overview

**Mi Colombia Digital** is a Citizen Digital Wallet — a PWA (Progressive Web App) that allows Colombian citizens to carry their government documents digitally on their phone. It is modeled after Argentina's miArgentina platform.

### What We're Building

- A **citizen-facing mobile web app** (Spanish UI) where users view their digital documents
- A **government admin dashboard** for managing citizens and issuing documents
- A **multi-country framework** so the same platform can be deployed in Ecuador, Guatemala, etc.
- An **offline-capable** system where core documents work without internet

### Who Uses It

| User Type | What They Do |
|-----------|-------------|
| **Citizens** | View digital ID, vehicle registration, health cards, QR verification |
| **Government Officials** | Scan QR codes to verify citizen documents |
| **Admin Operators** | Issue documents, manage citizens, view analytics |

---

## 2. Development Environment Setup

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ (20 LTS recommended) | JavaScript runtime |
| npm | 9+ | Package manager |
| Git | Latest | Version control |
| VS Code | Latest (recommended) | Code editor |
| Supabase CLI | Latest (optional) | Database management |

### Recommended VS Code Extensions

- **ESLint** — Code linting
- **Tailwind CSS IntelliSense** — TailwindCSS autocomplete
- **TypeScript Importer** — Auto-import TypeScript modules
- **Prettier** — Code formatting
- **ES7+ React Snippets** — React component snippets

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/digar011/colombia-digital-wallet.git
cd colombia-digital-wallet

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials (or leave defaults for mock mode)

# 4. Install Playwright browsers (for testing)
npx playwright install

# 5. Start the development server
npm run dev

# 6. Open in browser
# http://localhost:3000
```

---

## 3. Architecture Overview

### Tech Stack

```
Frontend:     Next.js 14 (App Router) + TypeScript + TailwindCSS
State:        Zustand (global) + TanStack React Query (server)
Backend:      Supabase (PostgreSQL + Auth + Storage + Real-time)
Testing:      Playwright (E2E)
PWA:          next-pwa (offline, installable)
```

### Route Groups

The app uses Next.js route groups to separate layouts:

```
(auth)/     → Login, Register, Verify — minimal layout
(citizen)/  → Citizen app — bottom nav + header
(admin)/    → Admin dashboard — sidebar + top bar
```

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/app/` | Pages and API routes (Next.js App Router) |
| `src/components/ui/` | Reusable UI components (Button, Card, Input, etc.) |
| `src/components/documents/` | Document card components (Cedula, Vehicle, Health) |
| `src/components/layout/` | Layout components (BottomNav, Header, Sidebar) |
| `src/config/countries/` | Country-specific JSON configurations |
| `src/lib/contexts/` | React Context providers (Auth, Country) |
| `src/lib/mock/` | Mock data for development |
| `src/lib/supabase/` | Supabase client configuration |
| `supabase/migrations/` | SQL database migrations |
| `tests/e2e/` | Playwright E2E test files |

### Data Flow

```
User Action → React Component → Hook/Context → Supabase Client → Database
                                     ↓ (dev mode)
                                 Mock Data (no backend needed)
```

---

## 4. Running the Project

### Development Mode

```bash
npm run dev
```

Opens at `http://localhost:3000`. Hot-reload is enabled.

### Production Build

```bash
npm run build
npm run start
```

### Demo Login

When running locally without Supabase, use mock mode:
- **Email**: `demo@micolombiadigital.gov.co`
- **Password**: `demo123`

---

## 5. Project Conventions

### Language

- **Citizen-facing UI**: All text in **Spanish** (labels, buttons, messages, placeholders)
- **Code**: English (variable names, comments, function names)
- **Documentation**: Separate English (`docs/en/`) and Spanish (`docs/es/`) versions
- **Admin dashboard**: Primarily English interface with Spanish citizen data

### File Naming

```
Components:  PascalCase.tsx     (e.g., DocumentCard.tsx)
Pages:       page.tsx           (Next.js convention)
Hooks:       useXxx.ts          (e.g., useAuth.ts)
Contexts:    XxxContext.tsx      (e.g., AuthContext.tsx)
Utils:       camelCase.ts       (e.g., formatDate.ts)
Types:       camelCase.ts       (e.g., database.ts)
Tests:       xxx.spec.ts        (e.g., auth.spec.ts)
```

### Component Structure

```tsx
'use client'; // Only if component uses hooks/state

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface MyComponentProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

export function MyComponent({ title, variant = 'primary' }: MyComponentProps) {
  // Component logic here
  return (
    <div className={cn('base-classes', variant === 'primary' && 'primary-classes')}>
      {title}
    </div>
  );
}
```

### Styling

- Use **TailwindCSS** for all styling
- Use `cn()` utility for conditional classes
- Mobile-first responsive design (`sm:`, `md:`, `lg:` breakpoints)
- Dark mode support via `dark:` prefix
- Use country config colors for branding via CSS variables or context

### Git Workflow

```
main          ← production-ready code
├── develop   ← integration branch
│   ├── feature/xxx   ← new features
│   ├── fix/xxx       ← bug fixes
│   └── docs/xxx      ← documentation updates
```

---

## 6. Working with Mock Data

Mock data is defined in `src/lib/mock/citizenData.ts` and `src/lib/mock/adminData.ts`.

### Mock Citizen

The primary mock citizen is:
- **Name**: Juan Carlos Rodriguez Martinez
- **Document**: CC 1234567890
- **City**: Bogota, Cundinamarca
- **Has**: Cedula, Driver's License, Passport, RUT, 2 vehicles, EPS, vaccinations, family members

### Adding Mock Data

Edit the relevant mock file and add your data. Mock data follows the same TypeScript types as the database schema.

### Switching to Real Data

When Supabase is configured (`.env.local` has valid credentials), the app automatically uses real data. Mock data is the fallback when no backend is available.

---

## 7. Multi-Country System

### How It Works

Each country has a JSON config file in `src/config/countries/`:
- `colombia.json` — Colors, documents, agencies, emergency numbers
- `ecuador.json` — Ecuador-specific configuration
- `guatemala.json` — Guatemala-specific configuration

### Country Context

```tsx
import { useCountry } from '@/lib/contexts/CountryContext';

function MyComponent() {
  const { countryId, colors, countryName, flag } = useCountry();
  // Use country-specific data
}
```

### Switching Countries

The `CountrySwitcher` component (in admin/demo mode) updates the country context and persists the selection in localStorage.

---

## 8. Database & Supabase

### Local Development

For local development, mock data is used by default. To use a real Supabase instance:

1. Create a project at [supabase.com](https://supabase.com)
2. Copy the URL and anon key to `.env.local`
3. Run migrations: `npx supabase db push`

### Migrations

SQL migration files are in `supabase/migrations/`:
- `001_initial_schema.sql` — All tables and indexes
- `002_rls_policies.sql` — Row Level Security policies

### Key Tables

Refer to the [README.md](../../README.md#database-schema) for the full table list.

---

## 9. Testing Guide

### Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific suite
npx playwright test tests/e2e/auth/
npx playwright test tests/e2e/citizen/
npx playwright test tests/e2e/admin/

# Interactive UI mode
npx playwright test --ui

# Debug mode
npx playwright test --debug
```

### Writing Tests

Tests are in `tests/e2e/` organized by feature area:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/path');
    await expect(page.getByText('Expected Text')).toBeVisible();
  });
});
```

### Test Naming Convention

```
auth.spec.ts           — Authentication flows
citizen-dashboard.spec.ts — Citizen dashboard
citizen-documents.spec.ts — Document viewing
admin-dashboard.spec.ts   — Admin dashboard
```

---

## 10. Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin only | Supabase service role key |
| `NEXT_PUBLIC_DEFAULT_COUNTRY` | No | Default country code (CO) |

---

## 11. Common Tasks

### Add a new document type

1. Add type to `src/config/countries/colombia.json` → `documents`
2. Add TypeScript type in `src/lib/types/database.ts`
3. Create card component in `src/components/documents/`
4. Add page in `src/app/(citizen)/documents/`
5. Add mock data in `src/lib/mock/citizenData.ts`
6. Write Playwright test in `tests/e2e/citizen/`

### Add a new country

1. Create `src/config/countries/[code].json`
2. Add to `src/config/index.ts`
3. Add flag asset to `public/flags/`
4. Test with country switcher

### Modify the database schema

1. Create new migration file in `supabase/migrations/`
2. Update TypeScript types in `src/lib/types/database.ts`
3. Update mock data if needed
4. Run `npx supabase db push`

---

## 12. Troubleshooting

### Common Issues

**"Module not found" errors**
```bash
npm install  # Reinstall dependencies
```

**Port 3000 already in use**
```bash
npx kill-port 3000  # Kill the process using port 3000
# Or use a different port:
npm run dev -- -p 3001
```

**Supabase connection failing**
- Check `.env.local` has correct values
- Ensure Supabase project is running
- The app falls back to mock data automatically

**Playwright tests failing**
```bash
npx playwright install  # Install/update browsers
npm run build           # Ensure production build works
```

---

## Need Help?

- Check the [English docs](../en/) or [Spanish docs](../es/)
- Contact Diego Garnica: diego.j.garnica@gmail.com
- Open an issue on GitHub
