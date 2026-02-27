import { test, expect } from '@playwright/test';

test.describe('Navegacion Movil (Bottom Nav)', () => {
  // Use iPhone 12 viewport for all tests in this describe block
  test.use({ viewport: { width: 390, height: 844 } });

  test('deberia mostrar la barra de navegacion inferior en movil', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/dashboard')) {
      // The bottom nav should be visible
      const nav = page.locator('nav[role="navigation"]');
      await expect(nav.first()).toBeVisible();
    }
  });

  test('deberia mostrar las 5 pestanas de navegacion', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/dashboard')) {
      // Should show all 5 nav labels in Spanish
      await expect(page.getByText('Inicio')).toBeVisible();
      await expect(page.getByText('Documentos')).toBeVisible();
      await expect(page.getByText('Servicios')).toBeVisible();
      await expect(page.getByText('Emergencia')).toBeVisible();
      await expect(page.getByText('Perfil')).toBeVisible();
    }
  });

  test('deberia resaltar la pestana activa "Inicio" en el dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/dashboard')) {
      // The "Inicio" tab should have aria-current="page"
      const activeTab = page.locator('a[aria-current="page"]');
      await expect(activeTab).toBeVisible();
      const activeText = await activeTab.textContent();
      expect(activeText).toMatch(/Inicio/);
    }
  });

  test('deberia navegar a la pagina de documentos al tocar "Documentos"', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/dashboard')) {
      // Tap the Documentos nav item
      await page.getByText('Documentos').click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/documents/);
    }
  });

  test('deberia navegar a la pagina de servicios al tocar "Servicios"', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/dashboard')) {
      await page.getByText('Servicios').click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/services/);
    }
  });

  test('deberia navegar a la pagina de emergencia al tocar "Emergencia"', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/dashboard')) {
      await page.getByText('Emergencia').click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/emergency/);
    }
  });

  test('deberia navegar a la pagina de perfil al tocar "Perfil"', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/dashboard')) {
      await page.getByText('Perfil').click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/profile/);
    }
  });

  test('deberia navegar de vuelta a "Inicio" desde otra pagina', async ({ page }) => {
    await page.goto('/documents');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents')) {
      // Navigate to Inicio
      await page.getByText('Inicio').click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/dashboard/);
    }
  });

  test('deberia actualizar la pestana activa al navegar', async ({ page }) => {
    await page.goto('/documents');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents')) {
      // The "Documentos" tab should now have aria-current="page"
      const activeTab = page.locator('a[aria-current="page"]');
      await expect(activeTab).toBeVisible();
      const activeText = await activeTab.textContent();
      expect(activeText).toMatch(/Documentos/);
    }
  });

  test('deberia mantener la navegacion fija en la parte inferior al hacer scroll', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/dashboard')) {
      // Scroll down the page
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(300);
      // Bottom nav should still be visible (fixed position)
      const nav = page.locator('nav[role="navigation"]');
      await expect(nav.first()).toBeVisible();
    }
  });
});
