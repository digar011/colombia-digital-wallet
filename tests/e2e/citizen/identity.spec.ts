import { test, expect } from '@playwright/test';

test.describe('Documento de Identidad (Cedula Digital)', () => {
  test('deberia cargar la pagina de identidad', async ({ page }) => {
    await page.goto('/documents/identity');
    const url = page.url();
    expect(url).toMatch(/\/(documents\/identity|login)/);
  });

  test('deberia mostrar el titulo del documento de identidad', async ({ page }) => {
    await page.goto('/documents/identity');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/identity')) {
      await page.waitForTimeout(700);
      // Should show "Cedula de Ciudadania" or "Tarjeta de Identidad" depending on age
      const body = await page.textContent('body');
      expect(body).toMatch(/Cedula de Ciudadania|Tarjeta de Identidad/);
    }
  });

  test('deberia mostrar la cedula digital con datos del ciudadano', async ({ page }) => {
    await page.goto('/documents/identity');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/identity')) {
      await page.waitForTimeout(700);
      // The card should display "Republica de Colombia"
      await expect(page.getByText('Republica de Colombia').first()).toBeVisible();
      // Should show the DIGITAL badge
      await expect(page.getByText('DIGITAL').first()).toBeVisible();
    }
  });

  test('deberia mostrar el badge de vigente', async ({ page }) => {
    await page.goto('/documents/identity');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/identity')) {
      await page.waitForTimeout(700);
      await expect(page.getByText('Vigente')).toBeVisible();
    }
  });

  test('deberia tener boton de voltear la tarjeta', async ({ page }) => {
    await page.goto('/documents/identity');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/identity')) {
      await page.waitForTimeout(700);
      // Should show "Ver respaldo" button
      const flipButton = page.getByText('Ver respaldo');
      await expect(flipButton).toBeVisible();
    }
  });

  test('deberia voltear la tarjeta y mostrar el respaldo con QR', async ({ page }) => {
    await page.goto('/documents/identity');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/identity')) {
      await page.waitForTimeout(700);
      // Click the flip button
      await page.getByText('Ver respaldo').click();
      await page.waitForTimeout(800); // Wait for flip animation
      // Back of the card should show QR verification text
      await expect(page.getByText('QR VERIFICACION')).toBeVisible();
      // Should show "RESPALDO" text
      await expect(page.getByText('RESPALDO')).toBeVisible();
      // Flip button text should change to "Ver frente"
      await expect(page.getByText('Ver frente').first()).toBeVisible();
    }
  });

  test('deberia tener boton de pantalla completa', async ({ page }) => {
    await page.goto('/documents/identity');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/identity')) {
      await page.waitForTimeout(700);
      await expect(page.getByText('Pantalla completa')).toBeVisible();
    }
  });

  test('deberia mostrar la seccion de informacion personal', async ({ page }) => {
    await page.goto('/documents/identity');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/identity')) {
      await page.waitForTimeout(700);
      await expect(page.getByText('Informacion Personal')).toBeVisible();
      // Should show personal info fields
      await expect(page.getByText('Nombre Completo')).toBeVisible();
      await expect(page.getByText('Numero de Documento')).toBeVisible();
      await expect(page.getByText('Fecha de Nacimiento')).toBeVisible();
      await expect(page.getByText('Lugar de Nacimiento')).toBeVisible();
    }
  });

  test('deberia mostrar el estado de verificacion del documento', async ({ page }) => {
    await page.goto('/documents/identity');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/identity')) {
      await page.waitForTimeout(700);
      await expect(page.getByText('Documento Verificado')).toBeVisible();
      await expect(page.getByText('Validado con la Registraduria Nacional')).toBeVisible();
    }
  });

  test('deberia mostrar los datos del documento', async ({ page }) => {
    await page.goto('/documents/identity');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/identity')) {
      await page.waitForTimeout(700);
      await expect(page.getByText('Datos del Documento')).toBeVisible();
      await expect(page.getByText('Autoridad Emisora')).toBeVisible();
      await expect(page.getByText('Registraduria Nacional del Estado Civil')).toBeVisible();
    }
  });

  test('deberia mostrar la seccion de proteccion biometrica', async ({ page }) => {
    await page.goto('/documents/identity');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/documents/identity')) {
      await page.waitForTimeout(700);
      await expect(page.getByText('Proteccion Biometrica')).toBeVisible();
      await expect(page.getByText('huella digital', { exact: false })).toBeVisible();
    }
  });
});
