# Testing Guide — Mi Colombia Digital

## Overview

The project uses **Playwright** for end-to-end (E2E) testing. Tests cover authentication flows, citizen document viewing, admin dashboard operations, and multi-country configuration.

## Setup

### Install Playwright

```bash
# Install Playwright and browsers
npx playwright install
```

### Run Tests

```bash
# Run all tests
npm run test:e2e

# Run specific test file
npx playwright test tests/e2e/auth/auth.spec.ts

# Run tests in a specific directory
npx playwright test tests/e2e/citizen/

# Run with UI mode (interactive)
npx playwright test --ui

# Run in debug mode
npx playwright test --debug

# Run headed (see the browser)
npx playwright test --headed

# Generate HTML report
npx playwright test --reporter=html
npx playwright show-report
```

## Test Structure

```
tests/
└── e2e/
    ├── auth/
    │   └── auth.spec.ts              # Login, register, verify flows
    ├── citizen/
    │   ├── dashboard.spec.ts         # Dashboard rendering, navigation
    │   ├── documents.spec.ts         # Document viewing, card interactions
    │   ├── services.spec.ts          # Social programs, appointments
    │   ├── emergency.spec.ts         # Emergency contacts, call buttons
    │   └── profile.spec.ts           # Profile page, settings
    ├── admin/
    │   └── admin-dashboard.spec.ts   # Admin dashboard stats and management
    ├── agency/
    │   └── agency.spec.ts            # Agency portal selection, login, navigation
    └── config/
        └── country-switch.spec.ts    # Multi-country switching
```

## Writing Tests

### Basic Test Pattern

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Area', () => {
  test.beforeEach(async ({ page }) => {
    // Common setup (e.g., login, navigate)
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'demo@micolombiadigital.gov.co');
    await page.fill('[data-testid="password"]', 'demo123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
  });

  test('should display expected content', async ({ page }) => {
    await expect(page.getByText('Panel Principal')).toBeVisible();
  });

  test('should navigate correctly', async ({ page }) => {
    await page.click('[data-testid="nav-documents"]');
    await expect(page).toHaveURL('/documents');
  });
});
```

### Test Data IDs

Use `data-testid` attributes for reliable element selection:

```tsx
<button data-testid="login-button">Ingresar</button>
<input data-testid="email" type="email" />
```

### Common Assertions

```typescript
// Visibility
await expect(page.getByText('text')).toBeVisible();
await expect(page.getByTestId('element')).toBeHidden();

// URL
await expect(page).toHaveURL('/expected-path');

// Count
await expect(page.getByTestId('card')).toHaveCount(5);

// Text content
await expect(page.getByTestId('name')).toHaveText('Juan Rodriguez');

// Attribute
await expect(page.getByTestId('badge')).toHaveAttribute('data-status', 'active');
```

## Test Configuration

The Playwright configuration is in `playwright.config.ts`:

- **Base URL**: `http://localhost:3000`
- **Projects**: chromium-desktop, mobile-chrome (Pixel 5), mobile-safari (iPhone 12)
- **Timeouts**: 30s per test, 5s per action
- **Retries**: 1 on CI, 0 locally
- **Screenshots**: On failure only
- **Video**: On failure only

## Best Practices

1. **Test user-visible behavior**, not implementation details
2. **Use data-testid** for element selection (stable across refactors)
3. **Keep tests independent** — each test should work in isolation
4. **Use page objects** for common interactions (login, navigation)
5. **Test mobile viewports** — this is a mobile-first app
6. **Spanish text assertions** — citizen UI is in Spanish
7. **Mock external APIs** — don't depend on Supabase for E2E tests

## CI/CD Integration

Tests run automatically on pull requests via GitHub Actions:

```yaml
- name: Run Playwright tests
  run: npx playwright test
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_KEY }}
```
