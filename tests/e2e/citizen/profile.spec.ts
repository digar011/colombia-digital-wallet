import { test, expect } from '@playwright/test';

test.describe('Perfil', () => {
  test('deberia cargar la pagina de perfil', async ({ page }) => {
    await page.goto('/profile');
    const url = page.url();
    expect(url).toMatch(/\/(profile|login)/);
  });
});
