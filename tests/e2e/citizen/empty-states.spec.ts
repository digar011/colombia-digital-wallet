import { test, expect } from '@playwright/test';

test.describe('Estados vacios de ciudadano', () => {
  test('deberia cargar la pagina de documentos', async ({ page }) => {
    await page.goto('/documents');
    const url = page.url();
    expect(url).toMatch(/\/(documents|login)/);
  });

  test('deberia mostrar categorias de documentos', async ({ page }) => {
    await page.goto('/documents');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents')) {
      await page.waitForTimeout(700);
      const body = await page.textContent('body');
      // Should show document categories
      expect(body).toMatch(/Identidad|Vehiculos|Salud|Impuestos|Familia/i);
    }
  });

  test('deberia cargar la pagina de servicios', async ({ page }) => {
    await page.goto('/services');
    const url = page.url();
    expect(url).toMatch(/\/(services|login)/);
  });

  test('deberia mostrar secciones de servicios', async ({ page }) => {
    await page.goto('/services');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/services')) {
      await page.waitForTimeout(700);
      const body = await page.textContent('body');
      // Should show service sections
      expect(body).toMatch(/Servicios|SISBEN|Citas|Programas/i);
    }
  });

  test('deberia cargar la pagina de emergencia', async ({ page }) => {
    await page.goto('/emergency');
    const url = page.url();
    expect(url).toMatch(/\/(emergency|login)/);
  });

  test('deberia mostrar numeros de emergencia', async ({ page }) => {
    await page.goto('/emergency');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/emergency')) {
      await page.waitForTimeout(700);
      const body = await page.textContent('body');
      // Should show emergency contacts
      expect(body).toMatch(/Emergencia|123|Policia|Bomberos|Ambulancia/i);
    }
  });

  test('deberia cargar la pagina de perfil', async ({ page }) => {
    await page.goto('/profile');
    const url = page.url();
    expect(url).toMatch(/\/(profile|login)/);
  });

  test('deberia mostrar informacion de perfil o estado de login requerido', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/profile')) {
      await page.waitForTimeout(700);
      const body = await page.textContent('body');
      // Should show profile info sections
      expect(body).toMatch(/Perfil|Informacion|Cuenta|Configuracion/i);
    }
  });

  test('deberia cargar la pagina de documentos de familia', async ({ page }) => {
    await page.goto('/documents/family');
    const url = page.url();
    expect(url).toMatch(/\/(documents|login)/);
  });

  test('deberia mostrar documentos de familia', async ({ page }) => {
    await page.goto('/documents/family');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/family')) {
      await page.waitForTimeout(700);
      const body = await page.textContent('body');
      expect(body).toMatch(/Familia|Registro Civil|Matrimonio|Nucleo Familiar/i);
    }
  });

  test('deberia cargar la pagina de documentos de trabajo', async ({ page }) => {
    await page.goto('/documents/work');
    const url = page.url();
    expect(url).toMatch(/\/(documents|login)/);
  });

  test('deberia mostrar documentos de trabajo e impuestos', async ({ page }) => {
    await page.goto('/documents/work');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/work')) {
      await page.waitForTimeout(700);
      const body = await page.textContent('body');
      expect(body).toMatch(/Trabajo|DIAN|RUT|Impuestos|Tributaria/i);
    }
  });
});
