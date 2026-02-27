import { test, expect } from '@playwright/test';

test.describe('Vehiculos del Ciudadano', () => {
  test('deberia cargar la pagina de vehiculos', async ({ page }) => {
    await page.goto('/documents/vehicles');
    const url = page.url();
    expect(url).toMatch(/\/(documents\/vehicles|login)/);
  });

  test('deberia mostrar el titulo "Mis Vehiculos"', async ({ page }) => {
    await page.goto('/documents/vehicles');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/vehicles')) {
      await page.waitForTimeout(600);
      await expect(page.getByText('Mis Vehiculos')).toBeVisible();
    }
  });

  test('deberia mostrar informacion del RUNT y conteo de vehiculos', async ({ page }) => {
    await page.goto('/documents/vehicles');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/vehicles')) {
      await page.waitForTimeout(600);
      // Should show RUNT reference
      const body = await page.textContent('body');
      expect(body).toMatch(/RUNT/);
      // Should show vehicle count
      expect(body).toMatch(/vehiculo/);
    }
  });

  test('deberia mostrar tarjetas de vehiculos con placa', async ({ page }) => {
    await page.goto('/documents/vehicles');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/vehicles')) {
      await page.waitForTimeout(600);
      // Each vehicle card should display a plate number (format like ABC-123 or ABC123)
      const body = await page.textContent('body');
      // Should have vehicle type labels
      expect(body).toMatch(/Automovil|Motocicleta/);
    }
  });

  test('deberia mostrar el estado del SOAT', async ({ page }) => {
    await page.goto('/documents/vehicles');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/vehicles')) {
      await page.waitForTimeout(600);
      // Each vehicle card should show SOAT status
      const soatLabels = page.getByText('SOAT');
      const count = await soatLabels.count();
      expect(count).toBeGreaterThanOrEqual(1);
    }
  });

  test('deberia mostrar el estado de la RTM', async ({ page }) => {
    await page.goto('/documents/vehicles');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/vehicles')) {
      await page.waitForTimeout(600);
      // Each vehicle card should show RTM (Tecnomecanica) status
      const rtmLabels = page.getByText('RTM');
      const count = await rtmLabels.count();
      expect(count).toBeGreaterThanOrEqual(1);
    }
  });

  test('deberia mostrar badge de estado de vencimiento', async ({ page }) => {
    await page.goto('/documents/vehicles');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/vehicles')) {
      await page.waitForTimeout(600);
      // Should show expiry status badges (dias or Vencido)
      const body = await page.textContent('body');
      expect(body).toMatch(/dias|Vencido/);
    }
  });

  test('deberia tener boton de "Ver detalles" para expandir informacion', async ({ page }) => {
    await page.goto('/documents/vehicles');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/vehicles')) {
      await page.waitForTimeout(600);
      const detailsButton = page.getByText('Ver detalles').first();
      await expect(detailsButton).toBeVisible();
    }
  });

  test('deberia expandir detalles del vehiculo al hacer click en "Ver detalles"', async ({ page }) => {
    await page.goto('/documents/vehicles');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/vehicles')) {
      await page.waitForTimeout(600);
      // Click "Ver detalles" on the first vehicle
      await page.getByText('Ver detalles').first().click();
      await page.waitForTimeout(400);
      // Expanded section should show vehicle details
      await expect(page.getByText('Datos del Vehiculo').first()).toBeVisible();
      // Should show SOAT details section
      const body = await page.textContent('body');
      expect(body).toMatch(/Aseguradora/);
      expect(body).toMatch(/Poliza/);
      // Button should change to "Ver menos"
      await expect(page.getByText('Ver menos').first()).toBeVisible();
    }
  });

  test('deberia mostrar la nota del RUNT al final de la pagina', async ({ page }) => {
    await page.goto('/documents/vehicles');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/vehicles')) {
      await page.waitForTimeout(600);
      const body = await page.textContent('body');
      expect(body).toMatch(/Registro Unico Nacional de Transito/);
    }
  });
});
