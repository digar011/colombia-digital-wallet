# Guia de Pruebas — Mi Colombia Digital

## Vista General

El proyecto usa **Playwright** para pruebas de extremo a extremo (E2E). Las pruebas cubren flujos de autenticacion, visualizacion de documentos ciudadanos, operaciones del panel de administracion y configuracion multi-pais.

## Configuracion

### Instalar Playwright

```bash
# Instalar Playwright y navegadores
npx playwright install
```

### Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm run test:e2e

# Ejecutar archivo de prueba especifico
npx playwright test tests/e2e/auth/auth.spec.ts

# Ejecutar pruebas en directorio especifico
npx playwright test tests/e2e/citizen/

# Ejecutar con modo UI (interactivo)
npx playwright test --ui

# Ejecutar en modo debug
npx playwright test --debug

# Ejecutar con navegador visible
npx playwright test --headed

# Generar reporte HTML
npx playwright test --reporter=html
npx playwright show-report
```

## Estructura de Pruebas

```
tests/
└── e2e/
    ├── auth/
    │   └── auth.spec.ts           # Flujos de login, registro, logout, verificacion
    ├── citizen/
    │   ├── dashboard.spec.ts      # Renderizado del panel, navegacion
    │   ├── documents.spec.ts      # Visualizacion de documentos, interacciones con tarjetas
    │   ├── identity.spec.ts       # Pruebas especificas de Cedula Digital
    │   ├── vehicles.spec.ts       # Tarjetas de vehiculos, estado SOAT
    │   ├── health.spec.ts         # Registros de salud, vacunaciones
    │   ├── services.spec.ts       # Programas sociales, citas
    │   ├── emergency.spec.ts      # Contactos de emergencia, botones de llamada
    │   └── profile.spec.ts        # Pagina de perfil, configuracion
    ├── admin/
    │   ├── dashboard.spec.ts      # Estadisticas del panel admin
    │   ├── users.spec.ts          # Gestion de ciudadanos
    │   ├── documents.spec.ts      # Emision de documentos
    │   └── analytics.spec.ts      # Vistas de analiticas
    └── config/
        └── country-switch.spec.ts # Cambio de pais multi-pais
```

## Escribir Pruebas

### Patron Basico de Prueba

```typescript
import { test, expect } from '@playwright/test';

test.describe('Area Funcional', () => {
  test.beforeEach(async ({ page }) => {
    // Configuracion comun (ej: login, navegacion)
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'demo@micolombiadigital.gov.co');
    await page.fill('[data-testid="password"]', 'demo123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
  });

  test('deberia mostrar contenido esperado', async ({ page }) => {
    await expect(page.getByText('Panel Principal')).toBeVisible();
  });

  test('deberia navegar correctamente', async ({ page }) => {
    await page.click('[data-testid="nav-documents"]');
    await expect(page).toHaveURL('/documents');
  });
});
```

### IDs de Prueba en Datos

Usar atributos `data-testid` para seleccion confiable de elementos:

```tsx
<button data-testid="login-button">Ingresar</button>
<input data-testid="email" type="email" />
```

### Aserciones Comunes

```typescript
// Visibilidad
await expect(page.getByText('texto')).toBeVisible();
await expect(page.getByTestId('elemento')).toBeHidden();

// URL
await expect(page).toHaveURL('/ruta-esperada');

// Cantidad
await expect(page.getByTestId('tarjeta')).toHaveCount(5);

// Contenido de texto
await expect(page.getByTestId('nombre')).toHaveText('Juan Rodriguez');

// Atributo
await expect(page.getByTestId('insignia')).toHaveAttribute('data-status', 'active');
```

## Configuracion de Pruebas

La configuracion de Playwright esta en `playwright.config.ts`:

- **URL Base**: `http://localhost:3000`
- **Navegadores**: Chromium, Firefox, WebKit
- **Movil**: Viewports de iPhone 12, Pixel 5
- **Timeouts**: 30s por prueba, 5s por accion
- **Reintentos**: 1 en CI, 0 localmente
- **Capturas de pantalla**: Solo en fallas
- **Video**: Solo en fallas

## Mejores Practicas

1. **Probar comportamiento visible al usuario**, no detalles de implementacion
2. **Usar data-testid** para seleccion de elementos (estable entre refactorizaciones)
3. **Mantener pruebas independientes** — cada prueba debe funcionar aisladamente
4. **Usar page objects** para interacciones comunes (login, navegacion)
5. **Probar viewports moviles** — esta es una app mobile-first
6. **Aserciones en espanol** — la UI ciudadana esta en espanol
7. **Mockear APIs externas** — no depender de Supabase para pruebas E2E

## Integracion CI/CD

Las pruebas se ejecutan automaticamente en pull requests via GitHub Actions:

```yaml
- name: Ejecutar pruebas Playwright
  run: npx playwright test
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_KEY }}
```
