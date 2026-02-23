# Referencia de API — Mi Colombia Digital

## Vista General

La plataforma Mi Colombia Digital expone endpoints REST API a traves de rutas API de Next.js. Todos los endpoints requieren autenticacion a menos que se indique lo contrario.

## URL Base

```
Desarrollo: http://localhost:3000/api
Produccion: https://tu-dominio.com/api
```

## Autenticacion

Todos los endpoints autenticados requieren un token JWT de Supabase valido en el encabezado `Authorization`:

```
Authorization: Bearer <jwt_token>
```

---

## Endpoints

### Autenticacion

#### POST /api/auth/login
Autenticar un ciudadano y recibir un token de sesion.

**Cuerpo de Solicitud:**
```json
{
  "email": "ciudadano@ejemplo.com",
  "password": "contrasenaSegura"
}
```

**Respuesta (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "ciudadano@ejemplo.com"
  },
  "session": {
    "access_token": "jwt...",
    "refresh_token": "token..."
  }
}
```

#### POST /api/auth/register
Registrar una nueva cuenta de ciudadano.

**Cuerpo de Solicitud:**
```json
{
  "email": "ciudadano@ejemplo.com",
  "password": "contrasenaSegura",
  "document_type": "CC",
  "document_number": "1234567890",
  "first_name": "Juan",
  "last_name": "Rodriguez",
  "date_of_birth": "1990-03-15",
  "phone": "+573001234567"
}
```

#### POST /api/auth/logout
Finalizar la sesion actual.

#### POST /api/auth/refresh
Renovar un token de acceso expirado.

---

### Ciudadanos

#### GET /api/citizens/me
Obtener el perfil del ciudadano autenticado.

**Respuesta (200):**
```json
{
  "id": "uuid",
  "document_type": "CC",
  "document_number": "1234567890",
  "first_name": "Juan",
  "last_name": "Rodriguez",
  "date_of_birth": "1990-03-15",
  "verification_status": "verified",
  "country_id": "CO"
}
```

#### PATCH /api/citizens/me
Actualizar el perfil del ciudadano autenticado.

---

### Documentos

#### GET /api/documents
Obtener todos los documentos del ciudadano autenticado.

**Parametros de Consulta:**
| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| `type` | string | Filtrar por tipo de documento (CC, CE, LC, PP, RUT) |
| `status` | string | Filtrar por estado (active, expired, suspended) |

**Respuesta (200):**
```json
{
  "documents": [
    {
      "id": "uuid",
      "document_type": "CC",
      "document_number": "1234567890",
      "issuing_authority": "Registraduria Nacional",
      "status": "active",
      "qr_code_data": "...",
      "issue_date": "2020-01-15",
      "expiry_date": "2030-01-15"
    }
  ]
}
```

#### GET /api/documents/:id
Obtener un documento especifico por ID.

#### GET /api/documents/:id/qr
Generar un codigo QR actualizado para un documento.

**Respuesta (200):**
```json
{
  "qr_data": "cadena_codificada...",
  "generated_at": "2026-02-22T10:00:00Z",
  "expires_at": "2026-02-23T10:00:00Z",
  "signature": "firma_digital..."
}
```

---

### Vehiculos

#### GET /api/vehicles
Obtener todos los vehiculos del ciudadano autenticado.

#### GET /api/vehicles/:id
Obtener un vehiculo especifico por ID.

---

### Salud

#### GET /api/health
Obtener registros de salud del ciudadano autenticado.

#### GET /api/health/vaccinations
Obtener registros de vacunacion.

---

### Servicios

#### GET /api/services
Obtener inscripciones en programas sociales del ciudadano.

#### GET /api/appointments
Obtener citas proximas.

#### POST /api/appointments
Agendar una nueva cita.

---

### Verificacion (Publica)

#### POST /api/verify
Verificar un codigo QR (usado por funcionarios). No requiere autenticacion.

**Cuerpo de Solicitud:**
```json
{
  "qr_data": "cadena_codificada...",
  "verification_method": "qr_scan"
}
```

**Respuesta (200):**
```json
{
  "valid": true,
  "document_type": "CC",
  "citizen_name": "Juan Carlos Rodriguez",
  "document_number": "123****890",
  "status": "active",
  "verified_at": "2026-02-22T10:00:00Z"
}
```

---

### Endpoints de Administracion

Todos los endpoints admin requieren un token JWT admin con el rol apropiado.

#### GET /api/admin/citizens
Listar todos los ciudadanos (paginado).

**Parametros de Consulta:**
| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| `page` | number | Numero de pagina (por defecto: 1) |
| `limit` | number | Elementos por pagina (por defecto: 20) |
| `search` | string | Buscar por nombre o numero de documento |
| `status` | string | Filtrar por estado de verificacion |

#### GET /api/admin/citizens/:id
Obtener detalles completos de un ciudadano (vista admin).

#### POST /api/admin/documents/issue
Emitir un nuevo documento digital a un ciudadano.

#### GET /api/admin/analytics
Obtener datos analiticos de la plataforma.

#### GET /api/admin/verification-logs
Obtener historial de verificaciones.

---

## Respuestas de Error

Todos los errores siguen este formato:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token invalido o expirado"
  }
}
```

### Codigos de Error

| Codigo | Estado HTTP | Descripcion |
|--------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Autenticacion faltante o invalida |
| `FORBIDDEN` | 403 | Permisos insuficientes |
| `NOT_FOUND` | 404 | Recurso no encontrado |
| `VALIDATION_ERROR` | 422 | Cuerpo de solicitud invalido |
| `RATE_LIMITED` | 429 | Demasiadas solicitudes |
| `SERVER_ERROR` | 500 | Error interno del servidor |

## Limites de Tasa

- **Ciudadanos**: 100 solicitudes/minuto
- **Admin**: 500 solicitudes/minuto
- **Verificacion**: 1000 solicitudes/minuto (mas alto para funcionarios)
