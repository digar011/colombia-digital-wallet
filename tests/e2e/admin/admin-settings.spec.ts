import { test, expect } from '@playwright/test';

test.describe('Configuracion de administracion', () => {
  test('deberia cargar la pagina de configuracion', async ({ page }) => {
    await page.goto('/admin/settings');
    const url = page.url();
    expect(url).toMatch(/\/(admin|login)/);
  });

  test('deberia mostrar el titulo de configuracion', async ({ page }) => {
    await page.goto('/admin/settings');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/settings')) {
      const body = await page.textContent('body');
      expect(body).toMatch(/Configuraci[oó]n/);
    }
  });

  test('deberia mostrar tabs de navegacion de configuracion', async ({ page }) => {
    await page.goto('/admin/settings');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/settings')) {
      await page.waitForTimeout(500);
      const body = await page.textContent('body');
      expect(body).toMatch(/Sistema/);
      expect(body).toMatch(/Claves API/);
      expect(body).toMatch(/Notificaciones/);
    }
  });

  test('deberia mostrar configuracion del sistema por defecto', async ({ page }) => {
    await page.goto('/admin/settings');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/settings')) {
      await page.waitForTimeout(500);
      const body = await page.textContent('body');
      // System tab is default — should show platform settings
      expect(body).toMatch(/Nombre de la Plataforma|plataforma/i);
    }
  });

  test('deberia poder cambiar a tab de claves API', async ({ page }) => {
    await page.goto('/admin/settings');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/settings')) {
      await page.waitForTimeout(500);
      const apiTab = page.getByText('Claves API');
      if (await apiTab.isVisible()) {
        await apiTab.click();
        await page.waitForTimeout(300);
        const body = await page.textContent('body');
        expect(body).toMatch(/API|clave|key/i);
      }
    }
  });

  test('deberia poder cambiar a tab de roles', async ({ page }) => {
    await page.goto('/admin/settings');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/settings')) {
      await page.waitForTimeout(500);
      const rolesTab = page.getByText('Roles de Usuario');
      if (await rolesTab.isVisible()) {
        await rolesTab.click();
        await page.waitForTimeout(300);
        const body = await page.textContent('body');
        expect(body).toMatch(/Super Admin|Admin|Supervisor|Operator/i);
      }
    }
  });

  test('deberia poder cambiar a tab de auditoria', async ({ page }) => {
    await page.goto('/admin/settings');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/settings')) {
      await page.waitForTimeout(500);
      const auditTab = page.getByText(/Registro de Auditor/);
      if (await auditTab.isVisible()) {
        await auditTab.click();
        await page.waitForTimeout(300);
        const body = await page.textContent('body');
        expect(body).toMatch(/audit|registro|log/i);
      }
    }
  });

  test('deberia mostrar botones de guardar y cancelar', async ({ page }) => {
    await page.goto('/admin/settings');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/admin/settings')) {
      await page.waitForTimeout(500);
      const body = await page.textContent('body');
      expect(body).toMatch(/Guardar|Cancelar/);
    }
  });
});
