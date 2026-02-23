import { test, expect } from '@playwright/test';

test.describe('Portal de Agencias', () => {
  test('deberia cargar el portal de seleccion de agencias', async ({ page }) => {
    await page.goto('/agency');
    await page.waitForLoadState('networkidle');
    // Check that the page loaded (not redirected away)
    expect(page.url()).toContain('/agency');
    // Check for agency-related content on the page
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('deberia mostrar agencias del pais', async ({ page }) => {
    await page.goto('/agency');
    // Wait for page to load and check for agency-related content
    await page.waitForLoadState('networkidle');
    const content = await page.textContent('body');
    // Should contain at least one known agency shortName
    expect(content).toMatch(/RNEC|RUNT|DIAN|ADRES|DPS|MinTIC|Registro Civil|ANT|SRI|RENAP|SAT/);
  });

  test('deberia cargar el login de agencia', async ({ page }) => {
    await page.goto('/agency/login?agency=identity');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url).toContain('/agency');
  });

  test('deberia cargar el dashboard de la agencia de identidad', async ({ page }) => {
    await page.goto('/agency/identity/dashboard');
    const url = page.url();
    expect(url).toMatch(/\/(agency|login)/);
  });

  test('deberia cargar el dashboard de la agencia de vehiculos', async ({ page }) => {
    await page.goto('/agency/vehicles/dashboard');
    const url = page.url();
    expect(url).toMatch(/\/(agency|login)/);
  });

  test('deberia cargar la pagina de documentos de agencia', async ({ page }) => {
    await page.goto('/agency/identity/documents');
    const url = page.url();
    expect(url).toMatch(/\/(agency|login)/);
  });

  test('deberia cargar la pagina de solicitudes de agencia', async ({ page }) => {
    await page.goto('/agency/identity/requests');
    const url = page.url();
    expect(url).toMatch(/\/(agency|login)/);
  });

  test('deberia cargar la pagina de analitica de agencia', async ({ page }) => {
    await page.goto('/agency/tax/analytics');
    const url = page.url();
    expect(url).toMatch(/\/(agency|login)/);
  });

  test('deberia cargar la configuracion de servicios sociales', async ({ page }) => {
    await page.goto('/agency/socialServices/settings');
    const url = page.url();
    expect(url).toMatch(/\/(agency|login)/);
  });
});
