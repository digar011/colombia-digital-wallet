import { test, expect } from '@playwright/test';

test.describe('Errores de autenticacion', () => {
  test.describe('Login - validacion de campos', () => {
    test('deberia mostrar error al enviar formulario vacio', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      // Click login button without filling fields
      const loginButton = page.getByRole('button', { name: /ingresar/i });
      await loginButton.click();
      // Should show validation error
      const body = await page.textContent('body');
      expect(body).toMatch(/requerido|no valido|required/i);
    });

    test('deberia mostrar error con email invalido', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      // Fill with invalid email
      const emailInput = page.locator('input[type="email"], input[name="email"], [data-testid="email"]');
      await emailInput.fill('not-an-email');
      const passwordInput = page.locator('input[type="password"], input[name="password"], [data-testid="password"]');
      await passwordInput.fill('Test123!');
      const loginButton = page.getByRole('button', { name: /ingresar/i });
      await loginButton.click();
      const body = await page.textContent('body');
      expect(body).toMatch(/correo.*no.*valido|email.*invalid|formato.*correo/i);
    });

    test('deberia mostrar error con contrasena corta', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      const emailInput = page.locator('input[type="email"], input[name="email"], [data-testid="email"]');
      await emailInput.fill('test@example.com');
      const passwordInput = page.locator('input[type="password"], input[name="password"], [data-testid="password"]');
      await passwordInput.fill('12345');
      const loginButton = page.getByRole('button', { name: /ingresar/i });
      await loginButton.click();
      await page.waitForTimeout(1500);
      const body = await page.textContent('body');
      expect(body).toMatch(/6 caracteres|contrasena/i);
    });

    test('deberia tener enlace de contrasena olvidada', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      await expect(page.getByText(/olvidaste/i)).toBeVisible();
    });

    test('deberia poder alternar entre email y telefono', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      // Should show email/phone toggle tabs
      const phoneTab = page.getByText(/telefono|celular/i);
      if (await phoneTab.isVisible()) {
        await phoneTab.click();
        // Should now show phone input
        const phoneInput = page.locator('input[type="tel"], input[inputmode="tel"]');
        await expect(phoneInput).toBeVisible();
      }
    });
  });

  test.describe('Registro - validacion de campos', () => {
    test('deberia mostrar pagina de registro con paso 1', async ({ page }) => {
      await page.goto('/register');
      await page.waitForLoadState('networkidle');
      await expect(page.getByText(/crear cuenta|registro/i)).toBeVisible();
      // Step 1 should show personal info fields
      await expect(page.getByText(/informacion personal|datos personales/i).first()).toBeVisible();
    });

    test('deberia validar campos vacios en paso 1', async ({ page }) => {
      await page.goto('/register');
      await page.waitForLoadState('networkidle');
      // Click next without filling
      const nextButton = page.getByRole('button', { name: /siguiente/i });
      await nextButton.click();
      const body = await page.textContent('body');
      expect(body).toMatch(/requerido|no valido|required/i);
    });

    test('deberia mostrar selector de tipo de documento', async ({ page }) => {
      await page.goto('/register');
      await page.waitForLoadState('networkidle');
      // Should show document type options
      const body = await page.textContent('body');
      expect(body).toMatch(/CC|CE|TI|PP/);
    });

    test('deberia mostrar selector de genero', async ({ page }) => {
      await page.goto('/register');
      await page.waitForLoadState('networkidle');
      const body = await page.textContent('body');
      expect(body).toMatch(/masculino|femenino|otro/i);
    });
  });

  test.describe('Verificacion', () => {
    test('deberia mostrar pagina de verificacion OTP', async ({ page }) => {
      await page.goto('/verify');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/verify/);
      const body = await page.textContent('body');
      expect(body).toMatch(/verifica|codigo|OTP/i);
    });
  });
});
