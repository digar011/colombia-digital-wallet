import { test, expect } from '@playwright/test';

test.describe('Salud del Ciudadano', () => {
  test('deberia cargar la pagina de salud', async ({ page }) => {
    await page.goto('/documents/health');
    const url = page.url();
    expect(url).toMatch(/\/(documents\/health|login)/);
  });

  test('deberia mostrar el titulo "Salud"', async ({ page }) => {
    await page.goto('/documents/health');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/health')) {
      await page.waitForTimeout(600);
      await expect(page.getByText('Salud').first()).toBeVisible();
      // Should show subtitle
      const body = await page.textContent('body');
      expect(body).toMatch(/Afiliacion, vacunas y SISBEN/);
    }
  });

  test('deberia mostrar la tarjeta de afiliacion EPS', async ({ page }) => {
    await page.goto('/documents/health');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/health')) {
      await page.waitForTimeout(600);
      // Should show EPS affiliation card
      await expect(page.getByText('Afiliacion EPS')).toBeVisible();
      // Should show EPS status as Active
      await expect(page.getByText('Activo').first()).toBeVisible();
    }
  });

  test('deberia mostrar detalles de la afiliacion EPS', async ({ page }) => {
    await page.goto('/documents/health');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/health')) {
      await page.waitForTimeout(600);
      // Should show regime and category
      await expect(page.getByText('Regimen')).toBeVisible();
      await expect(page.getByText('Categoria')).toBeVisible();
      // Should show affiliation number
      await expect(page.getByText('No. Afiliacion')).toBeVisible();
      // Should show assigned IPS
      await expect(page.getByText('IPS Asignada')).toBeVisible();
    }
  });

  test('deberia mostrar la seccion de SISBEN IV', async ({ page }) => {
    await page.goto('/documents/health');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/health')) {
      await page.waitForTimeout(600);
      await expect(page.getByText('SISBEN IV')).toBeVisible();
      // Should show score, group, and subgroup
      await expect(page.getByText('Puntaje')).toBeVisible();
      await expect(page.getByText('Grupo', { exact: true }).first()).toBeVisible();
      await expect(page.getByText('Subgrupo')).toBeVisible();
    }
  });

  test('deberia mostrar los datos medicos', async ({ page }) => {
    await page.goto('/documents/health');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/health')) {
      await page.waitForTimeout(600);
      await expect(page.getByText('Datos Medicos')).toBeVisible();
      // Should show blood type
      await expect(page.getByText('Grupo Sanguineo').first()).toBeVisible();
    }
  });

  test('deberia mostrar alergias si las hay', async ({ page }) => {
    await page.goto('/documents/health');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/health')) {
      await page.waitForTimeout(600);
      const body = await page.textContent('body');
      // Should show allergies section
      expect(body).toMatch(/Alergias/);
    }
  });

  test('deberia mostrar el historial de vacunacion', async ({ page }) => {
    await page.goto('/documents/health');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/health')) {
      await page.waitForTimeout(600);
      await expect(page.getByText('Historial de Vacunacion')).toBeVisible();
      // Should show vaccination count badge
      const body = await page.textContent('body');
      expect(body).toMatch(/vacunas/);
    }
  });

  test('deberia mostrar registros de vacunacion con estado "Aplicada"', async ({ page }) => {
    await page.goto('/documents/health');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/health')) {
      await page.waitForTimeout(600);
      // Each displayed vaccination should have an "Aplicada" badge
      const aplicadaBadges = page.getByText('Aplicada');
      const count = await aplicadaBadges.count();
      expect(count).toBeGreaterThanOrEqual(1);
    }
  });

  test('deberia tener boton para ver todas las vacunas', async ({ page }) => {
    await page.goto('/documents/health');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/health')) {
      await page.waitForTimeout(600);
      // If there are more than 3 vaccinations, a "Ver todas" button should appear
      const body = await page.textContent('body');
      if (body && body.includes('Ver todas')) {
        const showAllButton = page.getByText(/Ver todas/);
        await expect(showAllButton).toBeVisible();
        // Click to expand
        await showAllButton.click();
        await page.waitForTimeout(300);
        // Button should change to "Mostrar menos"
        await expect(page.getByText('Mostrar menos')).toBeVisible();
      }
    }
  });

  test('deberia expandir detalles de vacunacion al hacer click', async ({ page }) => {
    await page.goto('/documents/health');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/health')) {
      await page.waitForTimeout(600);
      // Click the first vaccination row to expand it
      const firstVaxRow = page.getByText('Aplicada').first();
      await firstVaxRow.click();
      await page.waitForTimeout(400);
      // Expanded details should show lot and location info
      const body = await page.textContent('body');
      expect(body).toMatch(/Lote|Administrado por|Lugar/);
    }
  });

  test('deberia mostrar la nota del PAI', async ({ page }) => {
    await page.goto('/documents/health');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/health')) {
      await page.waitForTimeout(600);
      const body = await page.textContent('body');
      expect(body).toMatch(/Programa Ampliado de Inmunizaciones/);
    }
  });
});
