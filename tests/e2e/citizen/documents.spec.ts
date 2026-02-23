import { test, expect } from '@playwright/test';

test.describe('Documentos del Ciudadano', () => {
  test('deberia cargar la pagina de documentos', async ({ page }) => {
    await page.goto('/documents');
    const url = page.url();
    expect(url).toMatch(/\/(documents|login)/);
  });

  test('deberia cargar la pagina de identidad', async ({ page }) => {
    await page.goto('/documents/identity');
    const url = page.url();
    expect(url).toMatch(/\/(documents\/identity|login)/);
  });

  test('deberia cargar la pagina de vehiculos', async ({ page }) => {
    await page.goto('/documents/vehicles');
    const url = page.url();
    expect(url).toMatch(/\/(documents\/vehicles|login)/);
  });

  test('deberia cargar la pagina de salud', async ({ page }) => {
    await page.goto('/documents/health');
    const url = page.url();
    expect(url).toMatch(/\/(documents\/health|login)/);
  });

  test('deberia cargar la pagina de trabajo', async ({ page }) => {
    await page.goto('/documents/work');
    const url = page.url();
    expect(url).toMatch(/\/(documents\/work|login)/);
  });

  test('deberia cargar la pagina de familia', async ({ page }) => {
    await page.goto('/documents/family');
    const url = page.url();
    expect(url).toMatch(/\/(documents\/family|login)/);
  });
});
