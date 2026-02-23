# Architecture Guide — Mi Colombia Digital

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────┐
│                   CLIENTS                        │
│                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┐│
│  │ Citizen PWA  │  │ Admin Panel │  │ Verify   ││
│  │ (Mobile Web) │  │ (Desktop)   │  │ (Scanner)││
│  └──────┬──────┘  └──────┬──────┘  └────┬─────┘│
└─────────┼────────────────┼───────────────┼──────┘
          │                │               │
          ▼                ▼               ▼
┌─────────────────────────────────────────────────┐
│              NEXT.JS APPLICATION                 │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐│
│  │ (auth)/   │  │(citizen)/│  │   (admin)/     ││
│  │ Routes    │  │ Routes   │  │   Routes       ││
│  └──────────┘  └──────────┘  └────────────────┘│
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │           API Routes (/api/)             │   │
│  └──────────────────┬───────────────────────┘   │
└─────────────────────┼───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│                 SUPABASE                         │
│                                                  │
│  ┌──────┐  ┌──────┐  ┌────────┐  ┌──────────┐ │
│  │ Auth │  │ DB   │  │Storage │  │ Realtime │ │
│  │      │  │(PgSQL│  │(Files) │  │(WebSocket│ │
│  └──────┘  └──────┘  └────────┘  └──────────┘ │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │       Row-Level Security (RLS)            │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Component Architecture

```
App
├── CountryProvider (country config context)
│   ├── AuthProvider (authentication context)
│   │   ├── QueryProvider (TanStack React Query)
│   │   │   ├── (auth) Layout
│   │   │   │   ├── LoginPage
│   │   │   │   ├── RegisterPage
│   │   │   │   └── VerifyPage
│   │   │   ├── (citizen) Layout [Header + BottomNav]
│   │   │   │   ├── DashboardPage
│   │   │   │   ├── DocumentsPage
│   │   │   │   │   ├── IdentityPage (Cedula)
│   │   │   │   │   ├── VehiclesPage
│   │   │   │   │   ├── HealthPage
│   │   │   │   │   ├── WorkPage
│   │   │   │   │   └── FamilyPage
│   │   │   │   ├── ServicesPage
│   │   │   │   ├── EmergencyPage
│   │   │   │   └── ProfilePage
│   │   │   └── (admin) Layout [Sidebar + AdminHeader]
│   │   │       ├── AdminDashboard
│   │   │       ├── UsersPage
│   │   │       ├── DocumentsPage
│   │   │       ├── AnalyticsPage
│   │   │       └── SettingsPage
```

### Data Architecture

**Government as a Platform** — The wallet platform does NOT own citizen data. Government agencies retain data ownership. The platform acts as a display and verification layer.

```
Agency A (RNEC)  ──┐
Agency B (RUNT)  ──┤──→ API Layer ──→ Wallet Platform ──→ Citizen's Phone
Agency C (DIAN)  ──┤
Agency D (ADRES) ──┘
```

### Offline Architecture

```
Online Mode:
  API Request → Supabase → Fresh Data → Display + Cache Locally

Offline Mode:
  No Connection → Read Local Cache → Display Cached Data
  QR Codes: Pre-generated with digital signature, valid for 24h
```

## Security Architecture

### Authentication Flow

```
1. Citizen enters email + password
2. Supabase Auth validates credentials
3. JWT token issued (access + refresh)
4. Token stored in httpOnly cookie
5. Subsequent requests include JWT
6. Supabase RLS validates access per-row
```

### Row-Level Security

Every table has RLS policies ensuring citizens can only access their own data:

```sql
-- Citizens can only read their own record
CREATE POLICY "citizens_select_own"
ON public.citizens FOR SELECT
USING (auth.uid() = id);
```

### QR Code Verification

```
Generation:
  Document Data + Timestamp + Digital Signature → QR Code Data → QR Image

Verification:
  Official scans QR → Decode data → Verify signature → Check expiry → Show result
```

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| PWA vs Native | PWA | Faster iteration, no app store, Playwright testing |
| Next.js vs React SPA | Next.js | SEO, SSR, API routes, route groups |
| Supabase vs Custom API | Supabase | Built-in auth, RLS, real-time, fast setup |
| TailwindCSS vs CSS-in-JS | TailwindCSS | Performance, consistency, easy theming |
| Zustand vs Redux | Zustand | Simpler, less boilerplate, sufficient for needs |
| Mock-first | Yes | Demo capability without backend dependency |

## Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3s |
| Cumulative Layout Shift | < 0.1 |
| Offline Document Load | < 500ms |
| QR Code Generation | < 200ms |
