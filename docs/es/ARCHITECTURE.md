# Guia de Arquitectura — Mi Colombia Digital

## Arquitectura del Sistema

### Vista General de Alto Nivel

```
┌─────────────────────────────────────────────────┐
│                   CLIENTES                       │
│                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┐│
│  │ PWA          │  │ Panel Admin │  │ Verifica-││
│  │ Ciudadana    │  │ (Escritorio)│  │  dor QR  ││
│  └──────┬──────┘  └──────┬──────┘  └────┬─────┘│
└─────────┼────────────────┼───────────────┼──────┘
          │                │               │
          ▼                ▼               ▼
┌─────────────────────────────────────────────────┐
│              APLICACION NEXT.JS                  │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐│
│  │ (auth)/   │  │(citizen)/│  │   (admin)/     ││
│  │ Rutas    │  │ Rutas    │  │   Rutas        ││
│  └──────────┘  └──────────┘  └────────────────┘│
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │           Rutas API (/api/)              │   │
│  └──────────────────┬───────────────────────┘   │
└─────────────────────┼───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│                 SUPABASE                         │
│                                                  │
│  ┌──────┐  ┌──────┐  ┌────────┐  ┌──────────┐ │
│  │ Auth │  │ BD   │  │Almacen.│  │ Tiempo   │ │
│  │      │  │(PgSQL│  │(Archiv)│  │  Real    │ │
│  └──────┘  └──────┘  └────────┘  └──────────┘ │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │  Seguridad a Nivel de Fila (RLS)         │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Arquitectura de Componentes

```
App
├── CountryProvider (contexto de configuracion de pais)
│   ├── AuthProvider (contexto de autenticacion)
│   │   ├── QueryProvider (TanStack React Query)
│   │   │   ├── Layout (auth)
│   │   │   │   ├── PaginaLogin
│   │   │   │   ├── PaginaRegistro
│   │   │   │   └── PaginaVerificacion
│   │   │   ├── Layout (citizen) [Encabezado + NavInferior]
│   │   │   │   ├── PaginaPanelPrincipal
│   │   │   │   ├── PaginaDocumentos
│   │   │   │   │   ├── PaginaIdentidad (Cedula)
│   │   │   │   │   ├── PaginaVehiculos
│   │   │   │   │   ├── PaginaSalud
│   │   │   │   │   ├── PaginaTrabajo
│   │   │   │   │   └── PaginaFamilia
│   │   │   │   ├── PaginaServicios
│   │   │   │   ├── PaginaEmergencias
│   │   │   │   └── PaginaPerfil
│   │   │   └── Layout (admin) [BarraLateral + EncabezadoAdmin]
│   │   │       ├── PanelAdmin
│   │   │       ├── PaginaUsuarios
│   │   │       ├── PaginaDocumentos
│   │   │       ├── PaginaAnaliticas
│   │   │       └── PaginaConfiguracion
```

### Arquitectura de Datos

**Gobierno como Plataforma** — La billetera NO es duena de los datos ciudadanos. Las agencias gubernamentales mantienen la propiedad de los datos. La plataforma actua como capa de visualizacion y verificacion.

```
Agencia A (RNEC)  ──┐
Agencia B (RUNT)  ──┤──→ Capa API ──→ Plataforma Billetera ──→ Telefono del Ciudadano
Agencia C (DIAN)  ──┤
Agencia D (ADRES) ──┘
```

### Arquitectura Offline

```
Modo Online:
  Solicitud API → Supabase → Datos Frescos → Mostrar + Cachear Localmente

Modo Offline:
  Sin Conexion → Leer Cache Local → Mostrar Datos Cacheados
  Codigos QR: Pre-generados con firma digital, validos por 24h
```

## Arquitectura de Seguridad

### Flujo de Autenticacion

```
1. Ciudadano ingresa email + contrasena
2. Supabase Auth valida credenciales
3. Token JWT emitido (acceso + renovacion)
4. Token almacenado en cookie httpOnly
5. Solicitudes subsiguientes incluyen JWT
6. RLS de Supabase valida acceso por fila
```

### Seguridad a Nivel de Fila (RLS)

Cada tabla tiene politicas RLS asegurando que los ciudadanos solo pueden acceder a sus propios datos:

```sql
-- Los ciudadanos solo pueden leer su propio registro
CREATE POLICY "citizens_select_own"
ON public.citizens FOR SELECT
USING (auth.uid() = id);
```

### Verificacion de Codigo QR

```
Generacion:
  Datos del Documento + Marca de Tiempo + Firma Digital → Datos QR → Imagen QR

Verificacion:
  Funcionario escanea QR → Decodificar datos → Verificar firma → Revisar vigencia → Mostrar resultado
```

## Decisiones Tecnologicas

| Decision | Eleccion | Justificacion |
|----------|----------|---------------|
| PWA vs Nativo | PWA | Iteracion mas rapida, sin app store, pruebas con Playwright |
| Next.js vs React SPA | Next.js | SEO, SSR, rutas API, grupos de rutas |
| Supabase vs API propia | Supabase | Auth integrado, RLS, tiempo real, configuracion rapida |
| TailwindCSS vs CSS-in-JS | TailwindCSS | Rendimiento, consistencia, facil tematizacion |
| Zustand vs Redux | Zustand | Mas simple, menos boilerplate, suficiente para necesidades |
| Mock-first | Si | Capacidad de demo sin dependencia de backend |

## Objetivos de Rendimiento

| Metrica | Objetivo |
|---------|----------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3s |
| Cumulative Layout Shift | < 0.1 |
| Carga de Documento Offline | < 500ms |
| Generacion de Codigo QR | < 200ms |
