import { test, expect } from '@playwright/test';

test.describe('Configuracion Multi-Pais', () => {
  test('deberia cargar la pagina principal', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Colombia|Digital/i);
  });
});
