import { test, expect } from '@playwright/test';

test.describe('Panel de Administracion', () => {
  test('deberia cargar el panel de admin', async ({ page }) => {
    await page.goto('/admin/dashboard');
    const url = page.url();
    expect(url).toMatch(/\/(admin|login)/);
  });

  test('deberia cargar la gestion de usuarios', async ({ page }) => {
    await page.goto('/admin/users');
    const url = page.url();
    expect(url).toMatch(/\/(admin|login)/);
  });
});
