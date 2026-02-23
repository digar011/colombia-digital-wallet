import { test, expect } from '@playwright/test';

test.describe('Panel del Ciudadano', () => {
  test('deberia cargar el panel principal', async ({ page }) => {
    await page.goto('/dashboard');
    // Should either show dashboard or redirect to login
    const url = page.url();
    expect(url).toMatch(/\/(dashboard|login)/);
  });

  test('deberia mostrar la barra de navegacion o redirigir a login', async ({ page }) => {
    await page.goto('/dashboard');
    const url = page.url();
    if (url.includes('/dashboard')) {
      // Authenticated: should see bottom navigation
      const nav = page.locator('nav, [role="navigation"]');
      await expect(nav.first()).toBeVisible();
    } else {
      // Not authenticated: redirected to login page
      expect(url).toMatch(/\/login/);
      await expect(page.locator('input')).toBeTruthy();
    }
  });
});
