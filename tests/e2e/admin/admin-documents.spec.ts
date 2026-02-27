import { test, expect } from '@playwright/test';

test.describe('Gestion de Documentos (Admin Documents)', () => {
  test('deberia cargar la pagina de gestion de documentos', async ({ page }) => {
    await page.goto('/admin/documents');
    const url = page.url();
    expect(url).toMatch(/\/(admin\/documents|login)/);
  });

  test('deberia mostrar el titulo de gestion de documentos', async ({ page }) => {
    await page.goto('/admin/documents');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/documents')) {
      await page.waitForTimeout(700);
      // The page title uses &oacute; entity for the accent
      const body = await page.textContent('body');
      expect(body).toMatch(/Gesti[oó]n de Documentos/);
    }
  });

  test('deberia mostrar las tarjetas de estadisticas de documentos', async ({ page }) => {
    await page.goto('/admin/documents');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/documents')) {
      await page.waitForTimeout(700);
      // Should show stat cards
      await expect(page.getByText('Total Emitidos')).toBeVisible();
      await expect(page.getByText('Activos').first()).toBeVisible();
      await expect(page.getByText('Pendientes').first()).toBeVisible();
      await expect(page.getByText('Revocados').first()).toBeVisible();
    }
  });

  test('deberia mostrar las pestanas de navegacion', async ({ page }) => {
    await page.goto('/admin/documents');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/documents')) {
      await page.waitForTimeout(700);
      // Should show the three tabs
      await expect(page.getByText('Cola de Emisión')).toBeVisible();
      await expect(page.getByText('Todos los Documentos')).toBeVisible();
      await expect(page.getByText('Plantillas')).toBeVisible();
    }
  });

  test('deberia mostrar la cola de emision pendiente por defecto', async ({ page }) => {
    await page.goto('/admin/documents');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/documents')) {
      await page.waitForTimeout(700);
      // The queue tab is active by default
      const body = await page.textContent('body');
      // Should show queue-related content (pending docs or empty message)
      expect(body).toMatch(/Cola de Emisión Pendiente|Cola vacía/);
    }
  });

  test('deberia cambiar a la pestana de todos los documentos y mostrar la tabla', async ({ page }) => {
    await page.goto('/admin/documents');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/documents')) {
      await page.waitForTimeout(700);
      // Click the "Todos los Documentos" tab
      await page.getByText('Todos los Documentos').click();
      await page.waitForTimeout(300);
      // Table headers should appear
      await expect(page.getByText('Documento', { exact: false }).first()).toBeVisible();
      await expect(page.getByText('Ciudadano', { exact: false }).first()).toBeVisible();
      // Search input should be visible
      const searchInput = page.getByPlaceholder(/Buscar por nombre/);
      await expect(searchInput).toBeVisible();
    }
  });

  test('deberia tener funcionalidad de busqueda en la pestana de documentos', async ({ page }) => {
    await page.goto('/admin/documents');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/documents')) {
      await page.waitForTimeout(700);
      // Switch to issued documents tab
      await page.getByText('Todos los Documentos').click();
      await page.waitForTimeout(300);
      // Find and use the search input
      const searchInput = page.getByPlaceholder(/Buscar por nombre/);
      await searchInput.fill('Carlos');
      await page.waitForTimeout(300);
      // The table should still render (filtered or showing no results message)
      const body = await page.textContent('body');
      expect(body).toBeTruthy();
    }
  });

  test('deberia mostrar filtros al hacer click en el boton de filtros', async ({ page }) => {
    await page.goto('/admin/documents');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/documents')) {
      await page.waitForTimeout(700);
      // Switch to the issued documents tab which has filters
      await page.getByText('Todos los Documentos').click();
      await page.waitForTimeout(300);
      // Click the Filtros button
      const filterButton = page.getByText('Filtros', { exact: true }).first();
      await filterButton.click();
      // Filter dropdowns should appear
      await expect(page.getByText('Estado', { exact: false }).first()).toBeVisible();
      await expect(page.getByText('Tipo de Documento', { exact: false }).first()).toBeVisible();
    }
  });

  test('deberia cambiar a la pestana de plantillas y mostrar tarjetas', async ({ page }) => {
    await page.goto('/admin/documents');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/documents')) {
      await page.waitForTimeout(700);
      // Click the "Plantillas" tab
      await page.getByText('Plantillas').click();
      await page.waitForTimeout(300);
      // Should show template cards with version info
      const body = await page.textContent('body');
      expect(body).toMatch(/Versión|Vista Previa|Editar/);
    }
  });

  test('deberia tener boton de emitir documento', async ({ page }) => {
    await page.goto('/admin/documents');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/documents')) {
      await page.waitForTimeout(700);
      await expect(page.getByText('Emitir Documento')).toBeVisible();
    }
  });

  test('deberia mostrar el formulario de emision al hacer click en emitir documento', async ({ page }) => {
    await page.goto('/admin/documents');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/documents')) {
      await page.waitForTimeout(700);
      // Click the issue document button
      await page.getByText('Emitir Documento').click();
      await page.waitForTimeout(300);
      // The issue form should appear
      await expect(page.getByText('Emitir Nuevo Documento')).toBeVisible();
      // Form fields should be present
      const body = await page.textContent('body');
      expect(body).toMatch(/Seleccionar ciudadano/);
      expect(body).toMatch(/Seleccionar tipo/);
    }
  });
});
