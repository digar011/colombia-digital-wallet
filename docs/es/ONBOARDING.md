# Guia de Incorporacion para Desarrolladores — Mi Colombia Digital

Bienvenido al proyecto Mi Colombia Digital! Esta guia te llevara paso a paso por todo lo que necesitas para comenzar como desarrollador en el equipo.

## Tabla de Contenidos

1. [Descripcion del Proyecto](#descripcion-del-proyecto)
2. [Configuracion del Entorno de Desarrollo](#configuracion-del-entorno-de-desarrollo)
3. [Arquitectura General](#arquitectura-general)
4. [Ejecutar el Proyecto](#ejecutar-el-proyecto)
5. [Convenciones del Proyecto](#convenciones-del-proyecto)
6. [Datos de Prueba (Mock Data)](#datos-de-prueba-mock-data)
7. [Sistema Multi-Pais](#sistema-multi-pais)
8. [Portal de Agencias](#portal-de-agencias)
9. [Base de Datos y Supabase](#base-de-datos-y-supabase)
10. [Guia de Pruebas (Testing)](#guia-de-pruebas-testing)
11. [Despliegue](#despliegue)
12. [Monitoreo de Errores con Sentry](#monitoreo-de-errores-con-sentry)
13. [Tareas Comunes](#tareas-comunes)
14. [Solucion de Problemas](#solucion-de-problemas)

---

## 1. Descripcion del Proyecto

**Mi Colombia Digital** es una Billetera Digital Ciudadana — una PWA (Aplicacion Web Progresiva) que permite a los ciudadanos colombianos llevar sus documentos gubernamentales de forma digital en su telefono. Esta modelada a partir de la exitosa plataforma miArgentina.

### Que Estamos Construyendo

- Una **aplicacion movil web para ciudadanos** (interfaz en espanol) donde los usuarios ven sus documentos digitales
- Un **panel de administracion gubernamental** para gestionar ciudadanos y emitir documentos
- Un **portal de agencias** para que los funcionarios de agencias gubernamentales gestionen documentos, ciudadanos y solicitudes de verificacion
- Un **framework multi-pais** para que la misma plataforma se pueda desplegar en Ecuador, Guatemala, etc.
- Un **sistema con capacidad offline** donde los documentos esenciales funcionan sin internet

### Quien Lo Usa

| Tipo de Usuario | Que Hace |
|-----------------|----------|
| **Ciudadanos** | Ver cedula digital, registro vehicular, carnet de salud, verificacion QR |
| **Funcionarios** | Escanear codigos QR para verificar documentos ciudadanos |
| **Funcionarios de Agencia** | Gestionar documentos de la agencia, consultar ciudadanos, manejar solicitudes de verificacion |
| **Operadores Admin** | Emitir documentos, gestionar ciudadanos, ver analiticas |

---

## 2. Configuracion del Entorno de Desarrollo

### Prerrequisitos

| Herramienta | Version | Proposito |
|-------------|---------|-----------|
| Node.js | 18+ (20 LTS recomendado) | Entorno de ejecucion JavaScript |
| npm | 9+ | Gestor de paquetes |
| Git | Ultima version | Control de versiones |
| VS Code | Ultima version (recomendado) | Editor de codigo |
| Supabase CLI | Ultima version (opcional) | Gestion de base de datos |

### Extensiones Recomendadas para VS Code

- **ESLint** — Analisis de codigo
- **Tailwind CSS IntelliSense** — Autocompletado de TailwindCSS
- **TypeScript Importer** — Importacion automatica de modulos TypeScript
- **Prettier** — Formateo de codigo
- **ES7+ React Snippets** — Snippets para componentes React

### Configuracion Paso a Paso

```bash
# 1. Clonar el repositorio
git clone https://github.com/digar011/colombia-digital-wallet.git
cd colombia-digital-wallet

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Supabase (o dejar los valores por defecto para modo mock)

# 4. Instalar navegadores de Playwright (para pruebas)
npx playwright install

# 5. Iniciar el servidor de desarrollo
npm run dev

# 6. Abrir en el navegador
# http://localhost:3000
```

---

## 3. Arquitectura General

### Stack Tecnologico

```
Frontend:     Next.js 14 (App Router) + TypeScript + TailwindCSS
Estado:       Zustand (global) + TanStack React Query (servidor)
Backend:      Supabase (PostgreSQL + Auth + Storage + Tiempo Real)
Pruebas:      Playwright (E2E)
PWA:          next-pwa (offline, instalable)
```

### Grupos de Rutas

La app usa grupos de rutas de Next.js para separar layouts:

```
(auth)/     → Login, Registro, Verificacion — layout minimo
(citizen)/  → App ciudadana — barra de navegacion inferior + encabezado
(admin)/    → Panel de administracion — barra lateral + barra superior
(agency)/   → Portal de agencias — AgencySidebar + AgencyHeader
```

### Directorios Clave

| Directorio | Proposito |
|------------|-----------|
| `src/app/` | Paginas y rutas API (Next.js App Router) |
| `src/components/ui/` | Componentes UI reutilizables (Button, Card, Input, etc.) |
| `src/components/documents/` | Componentes de tarjetas de documentos (Cedula, Vehiculo, Salud) |
| `src/components/layout/` | Componentes de layout (BottomNav, Header, Sidebar, AgencySidebar, AgencyHeader) |
| `src/config/countries/` | Configuraciones JSON por pais |
| `src/lib/providers/` | Proveedor de React Query (QueryProvider) |
| `src/lib/contexts/` | Proveedores de Context React (Auth, Country, AdminRole) |
| `src/lib/mock/` | Datos de prueba para desarrollo (citizenData, adminData, agencyData, ticketData) |
| `src/lib/supabase/` | Configuracion del cliente Supabase |
| `supabase/migrations/` | Migraciones SQL de base de datos |
| `tests/e2e/` | Archivos de pruebas E2E con Playwright |

### Flujo de Datos

```
Accion del Usuario → Componente React → Hook/Context → Cliente Supabase → Base de Datos
                                              ↓ (modo dev)
                                          Datos Mock (sin backend necesario)
```

---

## 4. Ejecutar el Proyecto

### Modo Desarrollo

```bash
npm run dev
```

Se abre en `http://localhost:3000`. La recarga en caliente esta habilitada.

### Build de Produccion

```bash
npm run build
npm run start
```

### Login de Demo

Cuando se ejecuta localmente sin Supabase, usar modo mock:
- **Email**: `demo@micolombiadigital.gov.co`
- **Contrasena**: `demo123`

---

## 5. Convenciones del Proyecto

### Idioma

- **UI para ciudadanos**: Todo el texto en **espanol** (etiquetas, botones, mensajes, placeholders)
- **Codigo**: Ingles (nombres de variables, comentarios, nombres de funciones)
- **Documentacion**: Versiones separadas en ingles (`docs/en/`) y espanol (`docs/es/`)
- **Panel de administracion**: Interfaz principalmente en ingles con datos ciudadanos en espanol

### Nombrado de Archivos

```
Componentes:  PascalCase.tsx     (ej: DocumentCard.tsx)
Paginas:      page.tsx           (convencion Next.js)
Hooks:        useXxx.ts          (ej: useAuth.ts)
Contexts:     XxxContext.tsx      (ej: AuthContext.tsx)
Utilidades:   camelCase.ts       (ej: formatDate.ts)
Tipos:        camelCase.ts       (ej: database.ts)
Pruebas:      xxx.spec.ts        (ej: auth.spec.ts)
```

### Estructura de Componentes

```tsx
'use client'; // Solo si el componente usa hooks/estado

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface MiComponenteProps {
  titulo: string;
  variante?: 'primary' | 'secondary';
}

export function MiComponente({ titulo, variante = 'primary' }: MiComponenteProps) {
  return (
    <div className={cn('clases-base', variante === 'primary' && 'clases-primario')}>
      {titulo}
    </div>
  );
}
```

### Estilos

- Usar **TailwindCSS** para todos los estilos
- Usar utilidad `cn()` para clases condicionales
- Diseno responsivo mobile-first (`sm:`, `md:`, `lg:`)
- Soporte de modo oscuro con prefijo `dark:`
- Usar colores del config de pais para la marca

### Flujo de Trabajo Git

```
main          ← codigo listo para produccion
├── develop   ← rama de integracion
│   ├── feature/xxx   ← nuevas funcionalidades
│   ├── fix/xxx       ← correcciones de errores
│   └── docs/xxx      ← actualizaciones de documentacion
```

---

## 6. Datos de Prueba (Mock Data)

Los datos de prueba estan definidos en `src/lib/mock/`:
- `citizenData.ts` — Perfiles ciudadanos, documentos, vehiculos, salud, vacunas, citas, notificaciones
- `adminData.ts` — Datos del panel admin, analiticas, registros de actividad, estado del sistema
- `agencyData.ts` — Personal de agencia, documentos, solicitudes de verificacion, analiticas (3 paises)
- `ticketData.ts` — Tickets de soporte

### Ciudadano de Prueba

El ciudadano principal de prueba es:
- **Nombre**: Juan Carlos Rodriguez Martinez
- **Documento**: CC 1234567890
- **Ciudad**: Bogota, Cundinamarca
- **Tiene**: Cedula, Licencia de Conduccion, Pasaporte, RUT, 2 vehiculos, EPS, vacunas, familiares

### Agregar Datos de Prueba

Editar el archivo mock correspondiente y agregar los datos. Los datos mock siguen los mismos tipos TypeScript que el esquema de base de datos.

### Cambiar a Datos Reales

Cuando Supabase esta configurado (`.env.local` tiene credenciales validas), la app automaticamente usa datos reales. Los datos mock son el respaldo cuando no hay backend disponible.

---

## 7. Sistema Multi-Pais

### Como Funciona

Cada pais tiene un archivo de configuracion JSON en `src/config/countries/`:
- `colombia.json` — Colores, documentos, agencias, numeros de emergencia
- `ecuador.json` — Configuracion especifica de Ecuador
- `guatemala.json` — Configuracion especifica de Guatemala

### Contexto de Pais

```tsx
import { useCountry } from '@/lib/contexts/CountryContext';

function MiComponente() {
  const { countryId, colors, countryName, flag } = useCountry();
  // Usar datos especificos del pais
}
```

### Cambiar de Pais

El componente `CountrySwitcher` (en modo admin/demo) actualiza el contexto de pais y persiste la seleccion en localStorage.

---

## 8. Portal de Agencias

El Portal de Agencias es una interfaz dedicada para los funcionarios de agencias gubernamentales. Soporta 3 paises (Colombia, Ecuador, Guatemala) con 6 agencias por pais.

### Acceder al Portal de Agencias

Navegar a `/agency` para ver el portal de seleccion de agencias, que muestra 6 tarjetas de agencias. Cada tarjeta representa una agencia gubernamental (ej: RNEC, RUNT, DIAN). Los funcionarios inician sesion en `/agency/login` con sus credenciales institucionales (email `.gov.co`).

### Rutas de Agencia

| Ruta | Descripcion |
|------|-------------|
| `/agency` | Portal de seleccion de agencias (6 tarjetas) |
| `/agency/login` | Inicio de sesion con email institucional |
| `/agency/[agencyKey]/dashboard` | Panel de la agencia con metricas clave |
| `/agency/[agencyKey]/documents` | Gestion de documentos (emitidos por la agencia) |
| `/agency/[agencyKey]/citizens` | Consulta y busqueda de ciudadanos |
| `/agency/[agencyKey]/requests` | Solicitudes de verificacion (aprobar/rechazar) |
| `/agency/[agencyKey]/analytics` | Analiticas especificas de la agencia |
| `/agency/[agencyKey]/settings` | Configuracion de la agencia |

**Claves de Agencia:** `identity`, `vehicles`, `tax`, `health`, `socialServices`, `technology`

### Agencias Soportadas por Pais

| Pais | Agencias |
|------|----------|
| **Colombia** | RNEC (Identidad), RUNT (Vehiculos), DIAN (Tributario), ADRES (Salud), DPS (Servicios Sociales), MinTIC (Tecnologia) |
| **Ecuador** | Registro Civil, ANT, SRI, IESS, MIES, MINTEL |
| **Guatemala** | RENAP, SAT-Vehiculos, SAT, IGSS, MIDES, CIV |

### Funcionalidades del Portal de Agencias

- **Selector en barra lateral** — Cambiar entre agencias sin cerrar sesion
- **Gestion de documentos** — Ver, emitir y revocar documentos del dominio de la agencia
- **Consulta de ciudadanos** — Buscar ciudadanos por numero de cedula, nombre u otros identificadores
- **Solicitudes de verificacion** — Cola de solicitudes pendientes que los funcionarios pueden aprobar o rechazar
- **Panel de analiticas** — Metricas especificas de la agencia (documentos emitidos, verificaciones, tendencias)
- **Configuracion** — Configurar parametros de la agencia, notificaciones y acceso de funcionarios

### Archivos Clave

| Archivo | Proposito |
|---------|-----------|
| `src/app/(agency)/layout.tsx` | Layout de agencia con AgencySidebar y AgencyHeader |
| `src/app/(agency)/agency/page.tsx` | Portal de seleccion de agencias |
| `src/app/(agency)/agency/login/page.tsx` | Pagina de inicio de sesion para funcionarios |
| `src/app/(agency)/agency/[agencyKey]/page.tsx` | Raiz de agencia (redirige al dashboard) |
| `src/app/(agency)/agency/[agencyKey]/dashboard/page.tsx` | Panel de la agencia |
| `src/app/(agency)/agency/[agencyKey]/documents/page.tsx` | Gestion de documentos |
| `src/app/(agency)/agency/[agencyKey]/citizens/page.tsx` | Consulta de ciudadanos |
| `src/app/(agency)/agency/[agencyKey]/requests/page.tsx` | Solicitudes de verificacion |
| `src/app/(agency)/agency/[agencyKey]/analytics/page.tsx` | Analiticas |
| `src/app/(agency)/agency/[agencyKey]/settings/page.tsx` | Configuracion |
| `src/components/layout/AgencySidebar.tsx` | Barra lateral de agencia con selector desplegable |
| `src/components/layout/AgencyHeader.tsx` | Barra de encabezado de agencia |
| `src/lib/mock/agencyData.ts` | Datos mock para todas las agencias en 3 paises |
| `tests/e2e/agency/agency.spec.ts` | Pruebas E2E del portal de agencias |

---

## 9. Base de Datos y Supabase

### Desarrollo Local

Para desarrollo local, se usan datos mock por defecto. Para usar una instancia real de Supabase:

1. Crear un proyecto en [supabase.com](https://supabase.com)
2. Copiar la URL y la clave anonima a `.env.local`
3. Ejecutar migraciones: `npx supabase db push`

### Migraciones

Los archivos de migracion SQL estan en `supabase/migrations/`:
- `001_initial_schema.sql` — Todas las tablas e indices
- `002_rls_policies.sql` — Politicas de Seguridad a Nivel de Fila (RLS)

### Tablas Principales

| Tabla | Descripcion |
|-------|-------------|
| `citizens` | Perfiles ciudadanos (extiende auth.users) |
| `digital_documents` | Registros de documentos digitales con datos QR |
| `vehicles` | Registro vehicular (RUNT) |
| `health_records` | Afiliacion EPS, SISBEN |
| `vaccinations` | Registros de vacunacion |
| `family_members` | Familiares vinculados |
| `citizen_services` | Inscripcion en programas sociales |
| `work_tax_records` | RUT, empleo, pension |
| `appointments` | Citas de servicios gubernamentales |
| `verification_logs` | Historial de verificacion por QR |
| `admin_users` | Cuentas de administradores gubernamentales |
| `notifications` | Notificaciones al ciudadano |

---

## 10. Guia de Pruebas (Testing)

### Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas E2E
npm run test:e2e

# Ejecutar suite especifica
npx playwright test tests/e2e/auth/
npx playwright test tests/e2e/citizen/
npx playwright test tests/e2e/admin/
npx playwright test tests/e2e/agency/

# Modo UI interactivo
npx playwright test --ui

# Modo debug
npx playwright test --debug
```

### Escribir Pruebas

Las pruebas estan en `tests/e2e/` organizadas por area funcional:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Nombre de la Funcionalidad', () => {
  test('deberia hacer algo', async ({ page }) => {
    await page.goto('/ruta');
    await expect(page.getByText('Texto Esperado')).toBeVisible();
  });
});
```

### Convencion de Nombres de Pruebas

```
auth/auth.spec.ts              — Flujos de autenticacion (login, registro, verificacion)
citizen/dashboard.spec.ts      — Panel del ciudadano
citizen/documents.spec.ts      — Visualizacion de documentos
citizen/profile.spec.ts        — Gestion de perfil
citizen/emergency.spec.ts      — Contactos de emergencia
citizen/services.spec.ts       — Servicios sociales
admin/admin-dashboard.spec.ts  — Panel de administracion
agency/agency.spec.ts          — Portal de agencias
config/country-switch.spec.ts  — Cambio de pais multi-pais
```

---

## 11. Despliegue

### Vercel (Recomendado)

1. Hacer push del codigo a GitHub
2. Conectar el repositorio a Vercel
3. Configurar variables de entorno en el panel de Vercel
4. Desplegar

### Variables de Entorno

| Variable | Requerida | Descripcion |
|----------|-----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Si | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Si | Clave anonima de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo admin | Clave de rol de servicio Supabase |
| `NEXT_PUBLIC_DEFAULT_COUNTRY` | No | Codigo de pais por defecto (`CO`) |
| `NEXT_PUBLIC_APP_URL` | No | URL de la app (`http://localhost:3000`) |
| `NEXT_PUBLIC_ENABLE_MOCK_DATA` | No | Habilitar modo de datos mock (`true`) |
| `NEXT_PUBLIC_ENABLE_OFFLINE_MODE` | No | Habilitar modo offline/PWA (`true`) |
| `NEXT_PUBLIC_ENABLE_BIOMETRIC_AUTH` | No | Habilitar auth biometrica (`false`) |
| `NEXT_PUBLIC_SENTRY_DSN` | Produccion | DSN de Sentry para monitoreo de errores |
| `SENTRY_ORG` | CI | Slug de la organizacion en Sentry (carga de source maps) |
| `SENTRY_PROJECT` | CI | Slug del proyecto en Sentry (carga de source maps) |
| `SENTRY_AUTH_TOKEN` | CI | Token de autenticacion de Sentry (carga de source maps) |

---

## 12. Monitoreo de Errores con Sentry

El proyecto usa [Sentry](https://sentry.io) a traves de `@sentry/nextjs` para capturar errores en tiempo de ejecucion en los runtimes de cliente, servidor y edge. Sentry esta configurado en tres archivos en la raiz del proyecto:

- `sentry.client.config.ts` -- Rastreo de errores del lado del navegador con replay de sesion
- `sentry.server.config.ts` -- Rastreo de errores del lado del servidor (Node.js)
- `sentry.edge.config.ts` -- Rastreo de errores en el runtime edge

Sentry esta **habilitado solo en produccion** (`NODE_ENV === 'production'`). En desarrollo, los errores se registran en la consola como de costumbre.

### Configuracion de Sentry

1. **Crear un proyecto en Sentry** en [sentry.io](https://sentry.io):
   - Registrarse o iniciar sesion en tu cuenta de Sentry
   - Crear un nuevo proyecto y seleccionar **Next.js** como plataforma
   - Anotar el **slug de la organizacion** y el **slug del proyecto** de la URL (ej: `https://sentry.io/organizations/{org}/projects/{project}/`)

2. **Copiar el DSN** desde **Project Settings > Client Keys (DSN)**:
   - El DSN tiene el formato `https://abc123@o456.ingest.sentry.io/789`

3. **Agregar variables de entorno** a `.env.local`:
   ```bash
   # Requerido para monitoreo de errores en produccion
   NEXT_PUBLIC_SENTRY_DSN=https://tu-dsn@o123.ingest.sentry.io/456

   # Requerido para carga de source maps en CI
   SENTRY_ORG=tu-slug-organizacion
   SENTRY_PROJECT=tu-slug-proyecto
   SENTRY_AUTH_TOKEN=sntrys_tu-token-aqui
   ```

4. **Generar un token de autenticacion** (para carga de source maps en CI):
   - Ir a **Settings > Auth Tokens** en Sentry
   - Crear un token con los permisos `project:releases` y `org:read`
   - Agregar `SENTRY_AUTH_TOKEN` a las variables de entorno de CI (ej: secretos de Vercel o GitHub Actions)

### Como Funciona

| Funcionalidad | Detalles |
|----------------|---------|
| **Captura de errores** | Las excepciones no manejadas se envian automaticamente a Sentry en produccion |
| **Rastreo de rendimiento** | Se muestrea el 10% de las transacciones en produccion (`tracesSampleRate: 0.1`) |
| **Replay de sesion** | 10% de sesiones grabadas; 100% de sesiones con errores (`replaysOnErrorSampleRate: 1.0`) |
| **Source maps** | Se cargan automaticamente durante los builds de CI cuando `SENTRY_AUTH_TOKEN` esta configurado y `CI=true` |
| **Error boundary global** | `global-error.tsx` captura errores de renderizado React, reporta a Sentry y muestra una UI de reintento en espanol |

### Carga de Source Maps

Los source maps se cargan a Sentry **solo en entornos de CI** (cuando la variable de entorno `CI` esta configurada). Esto se controla en `next.config.mjs`:

```javascript
disableServerWebpackPlugin: !process.env.CI,
disableClientWebpackPlugin: !process.env.CI,
```

Para despliegues en Vercel, `CI=true` se configura automaticamente. Para GitHub Actions, agrega `SENTRY_AUTH_TOKEN` a los secretos del repositorio.

### Configuracion de CSP

La Content-Security-Policy en `next.config.mjs` ya permite conexiones a Sentry:

```
connect-src 'self' ... https://*.sentry.io https://*.ingest.sentry.io
```

No se necesitan cambios adicionales en el CSP.

---

## 13. Tareas Comunes

### Agregar un nuevo tipo de documento

1. Agregar tipo a `src/config/countries/colombia.json` → `documents`
2. Agregar tipo TypeScript en `src/lib/types/database.ts`
3. Crear componente de tarjeta en `src/components/documents/`
4. Agregar pagina en `src/app/(citizen)/documents/`
5. Agregar datos mock en `src/lib/mock/citizenData.ts`
6. Escribir prueba Playwright en `tests/e2e/citizen/`

### Agregar un nuevo pais

1. Crear `src/config/countries/[codigo].json`
2. Agregar en `src/config/index.ts`
3. Agregar bandera en `public/flags/`
4. Probar con el selector de pais

### Modificar el esquema de base de datos

1. Crear nuevo archivo de migracion en `supabase/migrations/`
2. Actualizar tipos TypeScript en `src/lib/types/database.ts`
3. Actualizar datos mock si es necesario
4. Ejecutar `npx supabase db push`

---

## 14. Solucion de Problemas

### Problemas Comunes

**Errores de "Module not found"**
```bash
npm install  # Reinstalar dependencias
```

**Puerto 3000 ya en uso**
```bash
npx kill-port 3000  # Matar el proceso usando el puerto 3000
# O usar un puerto diferente:
npm run dev -- -p 3001
```

**Falla la conexion a Supabase**
- Verificar que `.env.local` tiene valores correctos
- Asegurar que el proyecto Supabase esta corriendo
- La app cae automaticamente a datos mock

**Pruebas de Playwright fallando**
```bash
npx playwright install  # Instalar/actualizar navegadores
npm run build           # Asegurar que el build de produccion funciona
```

---

## Necesitas Ayuda?

- Revisar la [documentacion en ingles](../en/) o [documentacion en espanol](../es/)
- Contactar a Diego Garnica: diego.j.garnica@gmail.com
- Abrir un issue en GitHub
