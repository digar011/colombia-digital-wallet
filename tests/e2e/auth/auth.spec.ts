import { test, expect } from '@playwright/test';

test.describe('Autenticacion', () => {
  test('deberia mostrar la pagina de login', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/login/);
    await expect(page.getByText('Mi Colombia Digital')).toBeVisible();
  });

  test('deberia tener campos de email y contrasena', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"], input[name="email"], [data-testid="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"], [data-testid="password"]')).toBeVisible();
  });

  test('deberia tener enlace a registro', async ({ page }) => {
    await page.goto('/login');
    const registerLink = page.getByText(/[Rr]eg[ií]str/);
    await expect(registerLink).toBeVisible();
  });

  test('deberia mostrar la pagina de registro', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveURL(/register/);
  });

  test('deberia mostrar la pagina de verificacion', async ({ page }) => {
    await page.goto('/verify');
    await expect(page).toHaveURL(/verify/);
  });
});
