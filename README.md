# Mi Colombia Digital - Billetera Digital Ciudadana

A comprehensive **Citizen Digital Wallet Platform** for Colombia, built as a white-label, multi-country framework. Modeled after Argentina's successful miArgentina platform (21M+ users), adapted for Colombia's government systems.

> **Note**: The citizen-facing app is entirely in **Spanish** for Colombian users. Documentation is available in both English and Spanish.

## Overview

Mi Colombia Digital centralizes a citizen's government documents and services into a single Progressive Web App (PWA). Instead of carrying multiple physical documents and visiting different government offices, citizens access everything from their smartphone — even offline.

### Key Features

- **Cedula Digital** — View, share, and verify your Cedula de Ciudadania digitally
- **Vehiculos (RUNT)** — Vehicle registration, SOAT, technomechanical certificates
- **Salud (ADRES/EPS)** — EPS affiliation, vaccination records, SISBEN score
- **Trabajo y Tributario (DIAN)** — RUT, employment certificates, pension/ARL info
- **Familia** — Linked family members, children's Tarjeta de Identidad
- **Programas Sociales** — SISBEN, Familias en Accion, Ingreso Solidario status
- **Emergencias** — One-tap calling for 123, police, fire, ambulance
- **Verificacion QR** — Scannable QR codes for document verification by officials
- **Modo Sin Conexion** — Core documents available without internet connection
- **Soporte Multi-Pais** — White-label config for Colombia, Ecuador, Guatemala

### Admin Dashboard

Government administrators can:
- Issue and manage digital documents
- Verify citizen identities
- View analytics and registration trends
- Manage citizen accounts and services
- Configure system settings

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, TypeScript, TailwindCSS |
| **State** | Zustand, TanStack React Query |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, Real-time) |
| **PWA** | next-pwa (offline support, installable) |
| **QR Codes** | react-qr-code |
| **Icons** | Lucide React |
| **Testing** | Playwright (E2E) |
| **Deployment** | Vercel (recommended) |

## Project Structure

```
colombia-digital-wallet/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login, register, verify pages
│   │   ├── (citizen)/           # Citizen-facing app (Spanish UI)
│   │   │   ├── dashboard/       # Panel principal
│   │   │   ├── documents/       # Documentos
│   │   │   │   ├── identity/    # Cedula Digital
│   │   │   │   ├── vehicles/    # Vehiculos RUNT
│   │   │   │   ├── health/      # Salud / EPS
│   │   │   │   ├── work/        # Trabajo / DIAN
│   │   │   │   └── family/      # Familia
│   │   │   ├── services/        # Programas sociales
│   │   │   ├── emergency/       # Emergencias
│   │   │   └── profile/         # Perfil
│   │   ├── (admin)/             # Government admin dashboard
│   │   │   └── admin/
│   │   │       ├── dashboard/
│   │   │       ├── users/
│   │   │       ├── documents/
│   │   │       ├── analytics/
│   │   │       └── settings/
│   │   └── api/                 # API routes
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   ├── layout/              # Layout (nav, header, sidebar)
│   │   ├── documents/           # Document card components
│   │   ├── cards/               # Dashboard cards
│   │   ├── admin/               # Admin components
│   │   └── auth/                # Auth form components
│   ├── config/
│   │   ├── countries/           # Country JSON configs (CO, EC, GT)
│   │   └── index.ts             # Config loader
│   └── lib/
│       ├── supabase/            # Supabase client setup
│       ├── hooks/               # Custom React hooks
│       ├── contexts/            # React contexts (Auth, Country)
│       ├── utils/               # Utility functions
│       ├── types/               # TypeScript types
│       └── mock/                # Mock data for development
├── supabase/
│   └── migrations/              # Database migrations (SQL)
├── tests/
│   └── e2e/                     # Playwright E2E tests
│       ├── auth/
│       ├── citizen/
│       └── admin/
├── docs/
│   ├── en/                      # English documentation
│   └── es/                      # Spanish documentation
└── public/
    ├── icons/                   # PWA icons
    ├── images/                  # Static images
    └── flags/                   # Country flags
```

## Quick Start

### Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **npm** 9+
- **Git**
- A **Supabase** project (free tier works for development)

### Installation

```bash
# Clone the repository
git clone https://github.com/digar011/colombia-digital-wallet.git
cd colombia-digital-wallet

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Run database migrations (if using Supabase CLI)
npx supabase db push

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Demo Mode

The app includes mock data for development and demos. No Supabase connection is required to explore the UI — mock data is loaded automatically when no backend is configured.

**Demo credentials:**
- Email: `demo@micolombiadigital.gov.co`
- Password: `demo123`

## Available Scripts

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Run Playwright tests with UI mode
```

## Multi-Country Configuration

The platform supports multiple countries through JSON configuration files:

- **Colors** — National flag colors for branding
- **Documents** — Document types, formats, issuing authorities
- **Agencies** — Government agencies
- **Emergency Numbers** — Country-specific emergency contacts
- **Social Programs** — Available government programs
- **Health System** — Healthcare system details

### Adding a New Country

1. Create `src/config/countries/[country-code].json`
2. Register it in `src/config/index.ts`
3. Add country flag to `public/flags/`
4. Run `npm run build` to verify

## Database Schema

| Table | Description |
|-------|------------|
| `citizens` | Citizen profiles (extends auth.users) |
| `digital_documents` | Digital document records with QR data |
| `vehicles` | Vehicle registration (RUNT) |
| `health_records` | EPS affiliation, SISBEN |
| `vaccinations` | Vaccination records |
| `family_members` | Linked family members |
| `citizen_services` | Social program enrollments |
| `work_tax_records` | RUT, employment, pension info |
| `appointments` | Government service appointments |
| `verification_logs` | QR scan verification history |
| `admin_users` | Government admin accounts |
| `notifications` | Citizen notifications |

All tables have Row-Level Security (RLS) enabled.

## Testing

```bash
# Install Playwright browsers (first time)
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run specific test suites
npx playwright test tests/e2e/auth/
npx playwright test tests/e2e/citizen/
npx playwright test tests/e2e/admin/

# Run with UI mode
npx playwright test --ui

# Generate test report
npx playwright show-report
```

## Documentation

| Language | Path | Description |
|----------|------|-------------|
| English | [`docs/en/`](docs/en/) | Full English documentation |
| Spanish | [`docs/es/`](docs/es/) | Documentacion completa en espanol |
| Onboarding (EN) | [`docs/en/ONBOARDING.md`](docs/en/ONBOARDING.md) | Developer onboarding guide |
| Onboarding (ES) | [`docs/es/ONBOARDING.md`](docs/es/ONBOARDING.md) | Guia de incorporacion para desarrolladores |

## Architecture Decisions

- **PWA over Native App** — Enables Playwright testing, faster iteration, no app store dependency
- **Next.js App Router** — Server components for performance, route groups for layout separation
- **Supabase** — PostgreSQL with built-in auth, RLS, real-time, and storage
- **Mock-First Development** — Full UI functional without backend for demos
- **White-Label Config** — Single JSON per country enables rapid expansion
- **Spanish-First UI** — All citizen-facing content in Spanish; admin interface bilingual

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
# Set environment variables in Vercel dashboard
```

## License

Proprietary — Codexium / Goldyon. All rights reserved.

## Contact

- **Team**: Codexium / Goldyon
- **Lead**: Diego Garnica
- **Email**: diego.j.garnica@gmail.com
