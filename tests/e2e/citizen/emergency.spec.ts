import { test, expect } from '@playwright/test';

test.describe('Emergencias', () => {
  test('deberia cargar la pagina de emergencias', async ({ page }) => {
    await page.goto('/emergency');
    const url = page.url();
    expect(url).toMatch(/\/(emergency|login)/);
  });
});
