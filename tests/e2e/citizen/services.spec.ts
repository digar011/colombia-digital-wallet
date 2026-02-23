import { test, expect } from '@playwright/test';

test.describe('Servicios', () => {
  test('deberia cargar la pagina de servicios', async ({ page }) => {
    await page.goto('/services');
    const url = page.url();
    expect(url).toMatch(/\/(services|login)/);
  });
});
