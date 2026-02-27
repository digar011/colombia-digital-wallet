import { test, expect } from '@playwright/test';

test.describe('Analitica del Admin (Admin Analytics)', () => {
  test('deberia cargar la pagina de analitica', async ({ page }) => {
    await page.goto('/admin/analytics');
    const url = page.url();
    expect(url).toMatch(/\/(admin\/analytics|login)/);
  });

  test('deberia mostrar el titulo de analitica', async ({ page }) => {
    await page.goto('/admin/analytics');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/analytics')) {
      await page.waitForTimeout(800);
      const heading = page.getByText('Analítica', { exact: false }).first();
      await expect(heading).toBeVisible();
    }
  });

  test('deberia mostrar las tarjetas KPI', async ({ page }) => {
    await page.goto('/admin/analytics');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/analytics')) {
      await page.waitForTimeout(800);
      // Should display the four KPI cards
      await expect(page.getByText('Registros')).toBeVisible();
      await expect(page.getByText('Verificaciones')).toBeVisible();
      await expect(page.getByText('Documentos Emitidos')).toBeVisible();
      await expect(page.getByText('Usuarios Activos Promedio')).toBeVisible();
    }
  });

  test('las tarjetas KPI deberian mostrar tendencias con porcentaje', async ({ page }) => {
    await page.goto('/admin/analytics');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/analytics')) {
      await page.waitForTimeout(800);
      // Each KPI card should show "vs periodo anterior" trend text
      const trendTexts = page.getByText('vs periodo anterior');
      const count = await trendTexts.count();
      expect(count).toBeGreaterThanOrEqual(4);
    }
  });

  test('las tarjetas KPI deberian ser clickeables y navegar', async ({ page }) => {
    await page.goto('/admin/analytics');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/analytics')) {
      await page.waitForTimeout(800);
      // Click the "Registros" KPI card (should navigate to /admin/users)
      const registrosCard = page.getByText('Registros').first();
      await registrosCard.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/admin\/users/);
    }
  });

  test('deberia tener selector de rango de fechas', async ({ page }) => {
    await page.goto('/admin/analytics');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/analytics')) {
      await page.waitForTimeout(800);
      // Date range buttons should be visible
      await expect(page.getByText('7 Días')).toBeVisible();
      await expect(page.getByText('14 Días')).toBeVisible();
      await expect(page.getByText('30 Días')).toBeVisible();
    }
  });

  test('deberia cambiar el rango de fechas al hacer click', async ({ page }) => {
    await page.goto('/admin/analytics');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/analytics')) {
      await page.waitForTimeout(800);
      // Click 7 days button
      await page.getByText('7 Días').click();
      await page.waitForTimeout(300);
      // The chart description should update
      const body = await page.textContent('body');
      expect(body).toMatch(/últimos 7 días/);
    }
  });

  test('deberia mostrar graficos de tendencias de registro', async ({ page }) => {
    await page.goto('/admin/analytics');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/analytics')) {
      await page.waitForTimeout(800);
      await expect(page.getByText('Tendencias de Registro')).toBeVisible();
      await expect(page.getByText('Usuarios Activos')).toBeVisible();
    }
  });

  test('deberia mostrar la seccion de distribucion geografica', async ({ page }) => {
    await page.goto('/admin/analytics');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/analytics')) {
      await page.waitForTimeout(800);
      await expect(page.getByText('Distribución Geográfica')).toBeVisible();
      // Should have Department/City toggle
      await expect(page.getByText('Departamento', { exact: true }).first()).toBeVisible();
    }
  });

  test('deberia mostrar desglose por tipo de documento', async ({ page }) => {
    await page.goto('/admin/analytics');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/analytics')) {
      await page.waitForTimeout(800);
      await expect(page.getByText('Desglose por Tipo de Documento')).toBeVisible();
    }
  });

  test('deberia mostrar tasas de exito de verificacion', async ({ page }) => {
    await page.goto('/admin/analytics');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/analytics')) {
      await page.waitForTimeout(800);
      await expect(page.getByText('Tasas de Éxito de Verificación')).toBeVisible();
      // Should show overall success rate
      const body = await page.textContent('body');
      expect(body).toMatch(/Tasa de Éxito General/);
    }
  });

  test('deberia mostrar la seccion de uso de API', async ({ page }) => {
    await page.goto('/admin/analytics');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/analytics')) {
      await page.waitForTimeout(800);
      await expect(page.getByText('Uso de API')).toBeVisible();
      // Should show API stats
      const body = await page.textContent('body');
      expect(body).toMatch(/Tiempo de respuesta promedio/);
      expect(body).toMatch(/Tasa de error/);
    }
  });

  test('deberia mostrar la seccion de exportar reportes', async ({ page }) => {
    await page.goto('/admin/analytics');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/analytics')) {
      await page.waitForTimeout(800);
      await expect(page.getByText('Exportar Reportes')).toBeVisible();
      await expect(page.getByText('Exportar CSV')).toBeVisible();
      await expect(page.getByText('Exportar PDF')).toBeVisible();
      await expect(page.getByText('Reporte Completo')).toBeVisible();
    }
  });
});
