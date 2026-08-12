# Resumen Backend — VeterinariaSH (para construir/mejorar el frontend Angular)

Este documento es la referencia completa de la API REST para integrar el frontend **Angular**. Incluye endpoints, payloads, roles, autenticación, errores y reglas de negocio.

---

## 1. Contexto y stack

- **Backend:** API REST **Spring Boot 4.1.0** (Java 21), servida en **`http://localhost:8080`**, contexto `/`.
- Autenticación **JWT** (Bearer), stateless, CSRF desactivado.
- **JPA/Hibernate + Flyway + MySQL 8**. El esquema lo crea Flyway; Hibernate solo valida (`ddl-auto=validate`).
- DTOs (records) + MapStruct. Los controllers nunca exponen entidades.
- Documentación OpenAPI en **Swagger UI**: `http://localhost:8080/swagger-ui/index.html` y `http://localhost:8080/v3/api-docs`.
- Tests: 29 (unitarios + integración con H2).

## 2. Cómo levantar

**Local (desarrollo):**
```bash
docker compose up -d            # solo MySQL (helper dev, puerto 3306)
./mvnw spring-boot:run          # JDK 21+
```

**Stack completo (Docker, compose padre en ../docker-compose.yml):**
```bash
cd .. && docker compose up --build
```
- Backend → `http://localhost:8080`
- Frontend → `http://localhost:80` (Nginx/Angular)
- En Docker el backend se llama `backend-spring` y la BD `db-veterinaria` (misma red). Variables inyectadas: `SPRING_DATASOURCE_URL`, `SECURITY_JWT_SECRET_KEY`, etc.

## 3. Autenticación (JWT)

### Login
`POST /api/auth/login` — público.
```json
{ "username": "admin@veterinaria.com", "password": "admin123" }
```
**Respuesta 200:**
```json
{ "message": "Login correcto", "rol": "ADMIN", "username": "admin@veterinaria.com", "token": "<jwt>" }
```
**401:**
```json
{ "timestamp": "...", "status": 401, "error": "Unauthorized", "message": "Credenciales inválidas", "path": "/api/auth/login", "fieldErrors": null }
```

### Uso del token
- Enviar en **todas** las demás peticiones: `Authorization: Bearer <token>`
- **401** si falta el token o es inválido. **403** si el rol no tiene permiso.
- Guardar en Angular: `localStorage`/`sessionStorage` + `HttpInterceptor` que inyecte el header y maneje 401 (redirigir a login).

### Usuarios seed
| Usuario | Contraseña | Rol |
|---|---|---|
| admin@veterinaria.com | admin123 | **ADMIN** |
| dr.martinez@veterinaria.com | vet123 | **VETERINARIO** |
| dra.lopez@veterinaria.com | vet123 | **VETERINARIO** |
| recepcion@veterinaria.com | emp123 | **EMPLEADO** |

> El `username` es el **email**.

### Roles
`ADMIN`, `EMPLEADO`, `VETERINARIO` (prefijo `ROLE_` en authorities).

## 4. CORS ⚠️ (importante)

El backend solo permite el origen **`http://localhost:4200`** (configurado en `SecurityConfig`):

```java
config.setAllowedOrigins(List.of("http://localhost:4200"));
```

**Si el frontend corre en otro puerto** (p. ej. `http://localhost:80` vía Nginx en Docker), las peticiones desde el navegador a `http://localhost:8080` serán **bloqueadas por CORS**.

**Recomendado para el frontend en Docker:** usar un **proxy Nginx** en el contenedor del frontend:
```nginx
location /api/ {
    proxy_pass http://backend-spring:8080;
}
```
y en Angular usar rutas relativas (`/api/...`) con base href `/`. Así las peticiones son same-origin y CORS no aplica. Alternativa: ampliar `allowedOrigins` en el backend (no recomendado en prod).

## 5. Matriz de acceso por recurso

| Recurso | ADMIN | EMPLEADO | VETERINARIO | Público |
|---|---|---|---|---|
| `/api/auth/login` | — | — | — | ✅ |
| `/swagger-ui/**`, `/v3/api-docs/**` | — | — | — | ✅ |
| `/api/dueno` | todo | CRUD (sin eliminar) | — | |
| `/api/mascota` | todo | crear/editar/listar | listar/ver | |
| `/api/cita` | todo | todo (sin estado/eliminar) | todo (estado) | |
| `/api/factura` | todo | CRUD + cambiar estado | — | |
| `/api/historial-clinico` | CRUD | — | CRUD | |
| `/api/servicio` | CRUD | listar/ver | listar/ver | |
| `/api/medicamento` | CRUD | listar/ver | listar/ver | |
| `/api/usuario` | todo | listar | listar veterinarios | |

Detalle de `@PreAuthorize` por endpoint en la sección 6.

## 6. Endpoints por recurso

### Dueño — `/api/dueno` (ADMIN, EMPLEADO)
| Método | Ruta | Roles | Body / Params | Respuesta |
|---|---|---|---|---|
| GET | `/api/dueno` | ADMIN, EMPLEADO | — | `DuenoResponse[]` |
| POST | `/api/dueno` | ADMIN, EMPLEADO | `DuenoRequest` | `DuenoResponse` (200) |
| PUT | `/api/dueno` | ADMIN, EMPLEADO | `DuenoRequest` (con `id`) | `DuenoResponse` |
| GET | `/api/dueno/{id}` | ADMIN, EMPLEADO | — | `DuenoResponse` |
| DELETE | `/api/dueno/{id}` | **ADMIN** | — | 204 |

**DuenoRequest:** `id: Long (opcional)`, `dni*`, `nombre*`, `telefono`, `direccion`, `email`
**DuenoResponse:** `id`, `dni`, `nombre`, `telefono`, `direccion`, `email`

### Mascota — `/api/mascota` (ADMIN, EMPLEADO, VETERINARIO)
| Método | Ruta | Roles | Body / Params | Respuesta |
|---|---|---|---|---|
| GET | `/api/mascota` | los 3 | — | `MascotaResponse[]` |
| POST | `/api/mascota` | ADMIN, EMPLEADO | `MascotaRequest` | `MascotaResponse` |
| PUT | `/api/mascota` | ADMIN, EMPLEADO | `MascotaRequest` (con `id`) | `MascotaResponse` |
| GET | `/api/mascota/{id}` | los 3 | — | `MascotaResponse` |
| DELETE | `/api/mascota/{id}` | **ADMIN** | — | 204 |
| GET | `/api/mascota/dueno/{duenoId}` | los 3 | — | `MascotaResponse[]` |

**MascotaRequest:** `id` (opcional), `nombre*`, `especie*`, `raza`, `fechaNacimiento (yyyy-MM-dd)`, `peso (double)`, `sexo (MACHO|HEMBRA)`, `color`, `caracteristicas`, `duenoId*`
> ⚠️ `peso` es `double` primitivo: **obligatorio** en el JSON (Jackson falla si falta).

**MascotaResponse:** `id`, `nombre`, `especie`, `raza`, `fechaNacimiento`, `peso`, `sexo`, `color`, `caracteristicas`, `dueno: {id, nombre}`

### Cita — `/api/cita` (los 3)
| Método | Ruta | Roles | Body / Params | Respuesta |
|---|---|---|---|---|
| GET | `/api/cita` | los 3 | — | `CitaResponse[]` |
| GET | `/api/cita/{id}` | los 3 | — | `CitaResponse` |
| POST | `/api/cita` | los 3 | `CitaRequest` | `CitaResponse` (201) |
| PUT | `/api/cita/{id}/estado` | ADMIN, VETERINARIO | `?estado=PROGRAMADA\|COMPLETADA\|CANCELADA` | `CitaResponse` |
| PUT | `/api/cita/{id}/cancelar` | los 3 | — | `CitaResponse` |
| DELETE | `/api/cita/{id}` | **ADMIN** | — | 204 |
| GET | `/api/cita/veterinario/{id}` | los 3 | — | `CitaResponse[]` |
| GET | `/api/cita/mascota/{id}` | los 3 | — | `CitaResponse[]` |
| GET | `/api/cita/fecha` | los 3 | `?fecha=yyyy-MM-dd` | `CitaResponse[]` |
| GET | `/api/cita/agenda` | los 3 | `?veterinarioId=&fecha=yyyy-MM-dd` | `CitaResponse[]` |
| GET | `/api/cita/pendientes` | los 3 | — | `CitaResponse[]` (PROGRAMADA) |

**CitaRequest:** `fecha (yyyy-MM-dd)`, `hora (HH:mm:ss)`, `mascotaId*`, `veterinarioId*`, `motivo`
**CitaResponse:** `id`, `fecha`, `hora`, `mascota: {id, nombre, especie, sexo}`, `veterinario: {id, username, rol}`, `motivo`, `estado`

### Factura — `/api/factura` (ADMIN, EMPLEADO)
| Método | Ruta | Roles | Body / Params | Respuesta |
|---|---|---|---|---|
| GET | `/api/factura` | ADMIN, EMPLEADO | — | `FacturaResponse[]` |
| GET | `/api/factura/{id}` | ADMIN, EMPLEADO | — | `FacturaResponse` |
| POST | `/api/factura` | ADMIN, EMPLEADO | `FacturaRequest` | `FacturaResponse` |
| PUT | `/api/factura` | ADMIN, EMPLEADO | `FacturaRequest` (con `id`) | `FacturaResponse` |
| DELETE | `/api/factura/{id}` | ADMIN, EMPLEADO | — | 204 |
| PUT | `/api/factura/{id}/estado` | ADMIN, EMPLEADO | `?estado=PAGADO\|PENDIENTE` | `FacturaResponse` |

**FacturaRequest:** `id` (opcional), `fecha (yyyy-MM-dd)`, `duenoId`, `citaId` (opcional), `metodoPago (EFECTIVO|TARJETA|TRANSFERENCIA)`, `estadoPago (PAGADO|PENDIENTE)`, `detalles: [{servicioId*, cantidad*}]`
**FacturaResponse:** `id`, `fecha`, `dueno: {id, nombre}`, `detalles: [{id, servicio: {id, nombre, precio}, precioUnitario, cantidad, subtotal}]`, `total (Double)`, `metodoPago`, `estadoPago`, `cita: {id, fecha, hora, estado}`

> El `total` lo **calcula el backend** (suma precio × cantidad de cada detalle). No se envía en el request.

### Historial clínico — `/api/historial-clinico` (ADMIN, VETERINARIO)
| Método | Ruta | Roles | Body / Params | Respuesta |
|---|---|---|---|---|
| GET | `/api/historial-clinico` | ADMIN, VETERINARIO | — | `HistorialClinicoResponse[]` |
| GET | `/api/historial-clinico/{id}` | ADMIN, VETERINARIO | — | `HistorialClinicoResponse` |
| GET | `/api/historial-clinico/mascota/{mascotaId}` | ADMIN, VETERINARIO | — | `HistorialClinicoResponse[]` |
| GET | `/api/historial-clinico/veterinario/{veterinarioId}` | ADMIN, VETERINARIO | — | `HistorialClinicoResponse[]` |
| POST | `/api/historial-clinico` | ADMIN, VETERINARIO | `HistorialClinicoRequest` | `HistorialClinicoResponse` |
| POST | `/api/historial-clinico/cita/{citaId}` | ADMIN, VETERINARIO | `HistorialClinicoRequest` | `HistorialClinicoResponse` (asocia a cita) |
| PUT | `/api/historial-clinico/{id}` | ADMIN, VETERINARIO | `HistorialClinicoRequest` | `HistorialClinicoResponse` |

**HistorialClinicoRequest:** `diagnostico*`, `tratamiento`, `observaciones`, `mascotaId*`, `veterinarioId*`
**HistorialClinicoResponse:** `id`, `mascota: {id, nombre, especie, sexo}`, `fecha`, `diagnostico`, `tratamiento`, `observaciones`, `veterinario: {id, username, rol}`, `cita: {id, fecha, hora, estado}` (null si no se registró desde cita)

### Servicio — `/api/servicio` (los 3 leen; solo ADMIN escribe)
| Método | Ruta | Roles | Body / Params | Respuesta |
|---|---|---|---|---|
| GET | `/api/servicio` | los 3 | — | `ServicioResponse[]` |
| GET | `/api/servicio/{id}` | los 3 | — | `ServicioResponse` (200 con body o 200 vacío si no existe) |
| POST | `/api/servicio` | **ADMIN** | `ServicioRequest` | `ServicioResponse` |
| PUT | `/api/servicio` | **ADMIN** | `ServicioRequest` (con `id`) | `ServicioResponse` |
| DELETE | `/api/servicio/{id}` | **ADMIN** | — | 204 |

**ServicioRequest:** `id` (opcional), `nombre*`, `precio* (Double)`
**ServicioResponse / ServicioSummary:** `id`, `nombre`, `precio`

> ⚠️ `GET /api/servicio/{id}` devuelve `Optional` (200 con `null` en body si no existe), a diferencia del resto que da 404.

### Medicamento — `/api/medicamento` (los 3 leen; solo ADMIN escribe)
| Método | Ruta | Roles | Body / Params | Respuesta |
|---|---|---|---|---|
| GET | `/api/medicamento` | los 3 | — | `MedicamentoResponse[]` |
| GET | `/api/medicamento/{id}` | los 3 | — | `MedicamentoResponse` |
| GET | `/api/medicamento/buscar` | los 3 | `?nombre=` | `MedicamentoResponse[]` |
| POST | `/api/medicamento` | **ADMIN** | `MedicamentoRequest` | `MedicamentoResponse` |
| PUT | `/api/medicamento` | **ADMIN** | `MedicamentoRequest` (con `id`) | `MedicamentoResponse` |
| DELETE | `/api/medicamento/{id}` | **ADMIN** | — | 204 |

**MedicamentoRequest:** `id` (opcional), `nombre*`, `descripcion`, `cantidadStock (int)`, `precio (double)`
**MedicamentoResponse:** `id`, `nombre`, `descripcion`, `cantidadStock`, `precio`

### Usuario — `/api/usuario`
| Método | Ruta | Roles | Body / Params | Respuesta |
|---|---|---|---|---|
| GET | `/api/usuario` | ADMIN, EMPLEADO | — | `UsuarioResponse[]` |
| GET | `/api/usuario/{id}` | **ADMIN** | — | `UsuarioResponse` |
| POST | `/api/usuario/registrar` | **ADMIN** | `UsuarioRequest` | `UsuarioResponse` |
| GET | `/api/usuario/veterinario` | los 3 | — | `UsuarioResponse[]` (solo VETERINARIO) |

**UsuarioRequest:** `username*` (email), `password*`, `rol* (ADMIN|EMPLEADO|VETERINARIO)`
**UsuarioResponse:** `id`, `username`, `rol` (nunca expone la contraseña)

## 7. Enums

| Enum | Valores |
|---|---|
| `EstadoCita` | `PROGRAMADA`, `COMPLETADA`, `CANCELADA` |
| `EstadoPago` | `PAGADO`, `PENDIENTE` |
| `MetodoPago` | `EFECTIVO`, `TARJETA`, `TRANSFERENCIA` |
| `RolUsuario` | `ADMIN`, `EMPLEADO`, `VETERINARIO` |
| `Sexo` | `MACHO`, `HEMBRA` |

## 8. Formato de errores (uniforme)

```json
{
  "timestamp": "2026-08-05T17:38:23.011455885",
  "status": 400,
  "error": "Bad Request",
  "message": "El nombre es obligatorio",
  "path": "/api/mascota",
  "fieldErrors": [ { "field": "nombre", "message": "El nombre es obligatorio" } ]
}
```

| Código | Caso |
|---|---|
| **400** | Validación de campos (`fieldErrors`), JSON malformado ("Solicitud mal formada"), enum inválido, regla de negocio (`BusinessException`) |
| **401** | Sin token / token inválido / credenciales incorrectas |
| **403** | Rol sin permiso |
| **404** | Recurso inexistente (excepto `GET /api/servicio/{id}`) |
| **405** | Método no permitido |
| **409** | Conflicto de integridad (duplicados) |
| **500** | Error interno |

Los mensajes de validación vienen en **español**.

## 9. Reglas de negocio (para UX del frontend)

- **Citas:** no se puede crear una cita si el veterinario ya tiene otra en la misma `fecha + hora` → 400 "El veterinario ya tiene una cita en esa fecha y hora". El `veterinarioId` debe ser un usuario con rol `VETERINARIO` → 400 "El usuario no es un veterinario". Al crear, el estado queda **PROGRAMADA**.
  - `PUT /{id}/estado` con `COMPLETADA`: solo se permiten atender citas **PROGRAMADA** → 400 "Solo se pueden atender citas programadas".
  - `PUT /{id}/cancelar`: no se puede cancelar una cita **COMPLETADA** → 400 "No se puede cancelar una cita atendida".
- **Historial clínico:** `POST /api/historial-clinico/cita/{citaId}` exige que la cita esté **COMPLETADA** → 400 "La cita debe estar atendida". El `diagnostico` es obligatorio.
- **Facturas:** el `total` se calcula en el backend (precio × cantidad). `servicioId` debe existir → 404.
- **Usuarios:** al registrar, la contraseña se encripta con BCrypt (no se puede almacenar en texto plano ni se devuelve).

## 10. Notas de integración Angular

1. **Interceptor HTTP**: inyecta `Authorization: Bearer <token>`; en 401 → cerrar sesión y redirigir a `/login`.
2. **Guard de rutas por rol** usando `rol` del login: ADMIN → todo; EMPLEADO → ocultar CRUD de servicios/medicamentos/historial; VETERINARIO → solo lectura de catálogos, CRUD historial, sin facturas ni gestión de usuarios.
3. **Fechas**: `LocalDate` se serializa como `yyyy-MM-dd`; `LocalTime` como `HH:mm:ss` (enviar hora con segundos). No usar timestamps.
4. **Relaciones por id**: los requests usan ids de recursos (ej. `duenoId`, `mascotaId`); primero cargar los catálogos/dueños para poblar `<select>`.
5. **Eliminaciones**: devuelven **204 No Content** (sin body).
6. **Swagger** disponible para explorar/autoprob ar: `http://localhost:8080/swagger-ui/index.html` (botón *Authorize* para el JWT).

## 11. Rutas de Swagger y utilidades

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- Docs JSON: `http://localhost:8080/v3/api-docs`
- Health: sin endpoint Actuator configurado (depende del proyecto).

---

*Generado como contexto para el desarrollo del frontend. Fuentes: controllers, DTOs, SecurityConfig y servicios de `VeterianriaSH`.*
