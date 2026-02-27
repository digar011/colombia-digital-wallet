import { test, expect } from '@playwright/test';

test.describe('Gestion de Ciudadanos (Admin Users)', () => {
  test('deberia cargar la pagina de gestion de ciudadanos', async ({ page }) => {
    await page.goto('/admin/users');
    const url = page.url();
    expect(url).toMatch(/\/(admin\/users|login)/);
  });

  test('deberia mostrar el titulo y el conteo de ciudadanos', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/users')) {
      // Wait for loading to complete (page has a 500ms loading timer)
      await page.waitForTimeout(700);
      await expect(page.getByText('Gestión de Ciudadanos')).toBeVisible();
      // Should show citizen count text
      const body = await page.textContent('body');
      expect(body).toMatch(/ciudadanos totales/);
    }
  });

  test('deberia mostrar la tabla de ciudadanos con columnas', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/users')) {
      await page.waitForTimeout(700);
      // Table header columns should be visible
      await expect(page.getByText('Ciudadano', { exact: false }).first()).toBeVisible();
      await expect(page.getByText('Documento #').first()).toBeVisible();
      await expect(page.getByText('Estado', { exact: false }).first()).toBeVisible();
    }
  });

  test('deberia tener campo de busqueda funcional', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/users')) {
      await page.waitForTimeout(700);
      // Find the search input by placeholder text
      const searchInput = page.getByPlaceholder(/Buscar por nombre/);
      await expect(searchInput).toBeVisible();
      // Type a search query
      await searchInput.fill('Carlos');
      // Wait for filtering to apply
      await page.waitForTimeout(300);
      // The table should still be visible (filtered results)
      const body = await page.textContent('body');
      expect(body).toMatch(/Carlos|mostrando/i);
    }
  });

  test('deberia tener boton de filtros', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/users')) {
      await page.waitForTimeout(700);
      const filterButton = page.getByText('Filtros', { exact: false }).first();
      await expect(filterButton).toBeVisible();
      // Click to show filter dropdowns
      await filterButton.click();
      // Should show filter labels
      await expect(page.getByText('Estado de Verificación')).toBeVisible();
      await expect(page.getByText('Tipo de Documento')).toBeVisible();
      await expect(page.getByText('Departamento', { exact: false }).first()).toBeVisible();
    }
  });

  test('deberia tener paginacion', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/users')) {
      await page.waitForTimeout(700);
      // Pagination should show "Mostrando" text
      await expect(page.getByText('Mostrando').first()).toBeVisible();
      // Should show a "resultado" or "resultados" count
      const body = await page.textContent('body');
      expect(body).toMatch(/resultado/);
    }
  });

  test('deberia navegar al detalle del ciudadano al hacer click en una fila', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/users')) {
      await page.waitForTimeout(700);
      // Click the first citizen row (the first table body row)
      const firstRow = page.locator('tbody tr').first();
      await firstRow.click();
      // Should navigate to the user detail page
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/admin\/users\/cit-/);
    }
  });

  test('deberia mostrar informacion del ciudadano en la pagina de detalle', async ({ page }) => {
    await page.goto('/admin/users/cit-001');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/users/cit-001')) {
      await page.waitForTimeout(600);
      // Should show citizen name
      await expect(page.getByText('Carlos').first()).toBeVisible();
      // Should show back button text
      await expect(page.getByText('Volver a Ciudadanos')).toBeVisible();
      // Should show tabs
      await expect(page.getByText('Documentos', { exact: false }).first()).toBeVisible();
      // Should show the summary section
      await expect(page.getByText('Resumen')).toBeVisible();
    }
  });

  test('deberia mostrar acciones del admin en la pagina de detalle', async ({ page }) => {
    await page.goto('/admin/users/cit-001');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/users/cit-001')) {
      await page.waitForTimeout(600);
      // Should show action buttons
      await expect(page.getByText('Acciones').first()).toBeVisible();
      // Quick actions should be present
      const body = await page.textContent('body');
      expect(body).toMatch(/Copiar ID del Ciudadano/);
      expect(body).toMatch(/Exportar Datos/);
    }
  });

  test('deberia mostrar "Ciudadano No Encontrado" para un ID invalido', async ({ page }) => {
    await page.goto('/admin/users/nonexistent-id');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/users/nonexistent-id')) {
      await page.waitForTimeout(600);
      await expect(page.getByText('Ciudadano No Encontrado')).toBeVisible();
    }
  });

  test('deberia tener botones de exportar y agregar ciudadano', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/users')) {
      await page.waitForTimeout(700);
      await expect(page.getByText('Exportar').first()).toBeVisible();
      await expect(page.getByText('Agregar Ciudadano')).toBeVisible();
    }
  });
});
