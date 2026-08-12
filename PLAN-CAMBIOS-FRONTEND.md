# Plan de Cambios — Frontend (Veterniar-FR)

Adaptar el frontend Angular a la estructura del backend descrita en `resumen-backend.md` y añadir las funcionalidades nuevas que expone la API.

**Backend de referencia:** `http://localhost:8080/api/*` (JWT Bearer, errores uniformes en español).

---

## 1. Estado actual vs. estructura del backend (diagnóstico)

| Área | Problema actual | Impacto |
|---|---|---|
| Services | URLs/métodos de algunos servicios no coinciden con el backend (cita, factura-estado, medicamento, usuario-delete) | 404/405 en producción |
| Payloads | Se envían objetos anidados (`dueno: {…}`, `mascota: {…}`) donde el backend espera **ids** (`duenoId`, `mascotaId`, `servicioId`) | 400/creación rota |
| Models | Faltan campos de respuesta del backend (`cita` en factura/historial, `precioUnitario`, `estado` en CitaResponse) | UI muestra datos `undefined` |
| Cita | `CitaRequest` no tiene `dueno` ni `estado`; se envía `estado` manualmente y el backend siempre crea `PROGRAMADA` | Payload inválido |
| Cita | La hora debe viajar como `HH:mm:ss`; el `<input type="time">` envía `HH:mm` | 400 (parse falla) |
| Cita | `PUT /api/cita/{id}` NO existe en el backend | Botón "actualizar cita" fallaría |
| Factura | `updateEstado` envía el estado en el body, pero el backend lo espera como query param `?estado=` | 400/405 |
| Medicamento | `update` usa `PUT /api/medicamento/{id}`, el backend espera `PUT /api/medicamento` (id en body) | 405 |
| Usuario | `delete` usa `/api/usuario/delete/{id}`, endpoint **inexistente** | 404 |
| Usuario | La página pública "Registrarse" no puede funcionar: el backend solo permite crear usuarios como **ADMIN** (`POST /api/usuario/registrar`) | Bug conceptual |
| Seguridad | Solo hay `authGuard` de "hay token". No hay guards por rol ni ocultamiento de menú según rol (la matriz del backend define permisos por recurso) | 403 con mala UX |
| Interceptor | Inyecta token pero no maneja **401** (redirigir a login) | Sesión expirada sin aviso |
| Errores | Los mensajes de error son hardcodeados; el backend devuelve `{ message, fieldErrors }` en español | UX pobre |
| Registro | `RegisterComponent` usa rol `'USER'` que no existe en el backend (`ADMIN|EMPLEADO|VETERINARIO`) | Validación 400 |

---

## 2. Cambios en los Services (alinear con la API)

> Extraer la URL base a una constante/env para no repetir `http://localhost:8080` (ver sección 7).

### `src/app/services/cita.service.ts`
- `update(id, cita)` → **eliminar** (el backend no tiene `PUT /api/cita`).
- Añadir:
  - `cambiarEstado(id: number, estado: string)` → `PUT ${url}/${id}/estado?estado=${estado}`
  - `cancelar(id: number)` → `PUT ${url}/${id}/cancelar`
  - `getPendientes()` → `GET ${url}/pendientes`
  - `getPorVeterinario(id)` → `GET ${url}/veterinario/${id}`
  - `getPorMascota(id)` → `GET ${url}/mascota/${id}`
  - `getPorFecha(fecha: string)` → `GET ${url}/fecha?fecha=${fecha}`
  - `getAgenda(veterinarioId, fecha)` → `GET ${url}/agenda?veterinarioId=&fecha=`

### `src/app/services/factura.service.ts`
- `updateEstado(id, factura)` → `cambiarEstado(id, estado)` con query param:
  `PUT ${url}/${id}/estado?estado=${estado}` (solo `PAGADO|PENDIENTE`).
- `update(id, factura)` puede quedarse como `PUT ${url}` (el id va en el body).

### `src/app/services/medicamento.service.ts`
- `update(medicamento)` → `PUT ${url}` (sin id en la ruta, id en el body).
- Añadir `buscarPorNombre(nombre)` → `GET ${url}/buscar?nombre=${nombre}`.

### `src/app/services/usuario.service.ts`
- **Eliminar** `delete()` (no existe en el backend) y quitar el botón eliminar de la UI.
- Añadir `getOne(id)` → `GET ${url}/${id}` (solo ADMIN).

### Sin cambios de método (revisar payload en componentes):
`dueno.service.ts`, `mascota.service.ts`, `servicio.service.ts` (PUT con id en body).

---

## 3. Cambios en los Models (mapear DTOs de respuesta)

### `src/app/models/cita.model.ts`
```ts
export interface Cita {
    id?: number;
    fecha?: string;          // yyyy-MM-dd
    hora?: string;           // HH:mm:ss
    mascota?: { id: number; nombre: string; especie: string; sexo: string };
    veterinario?: { id: number; username: string; rol: string };
    motivo?: string;
    estado?: 'PROGRAMADA' | 'COMPLETADA' | 'CANCELADA';
}
```
> Eliminar `dueno` (no viene en `CitaResponse`).

### `src/app/models/mascota.models.ts` — MascotaResponse
`dueno` → `{ id: number; nombre: string }` (ya compatible). Agregar **MascotaRequest**:
```ts
export interface MascotaRequest { id?: number; nombre: string; especie: string; raza?: string; fechaNacimiento?: string; peso: number; sexo?: 'MACHO'|'HEMBRA'; color?: string; caracteristicas?: string; duenoId: number; }
```

### `src/app/models/detalle-factura.model.ts`
```ts
export interface DetalleFactura {
    id?: number;
    servicio?: { id: number; nombre: string; precio: number };
    precioUnitario?: number;
    cantidad?: number;
    subtotal?: number;
}
```

### `src/app/models/factura.model.ts`
Añadir `cita?: { id: number; fecha: string; hora: string; estado: string }` y eliminar `total` de los requests (lo calcula el backend). Crear **FacturaRequest**:
```ts
export interface DetalleFacturaRequest { servicioId: number; cantidad: number; }
export interface FacturaRequest { id?: number; fecha: string; duenoId: number; citaId?: number; metodoPago: 'EFECTIVO'|'TARJETA'|'TRANSFERENCIA'; estadoPago: 'PAGADO'|'PENDIENTE'; detalles: DetalleFacturaRequest[]; }
```

### `src/app/models/historial-clinico.model.ts`
Añadir `cita?: { id: number; fecha: string; hora: string; estado: string } | null`. Crear **HistorialClinicoRequest**:
```ts
{ id?: number; diagnostico: string; tratamiento?: string; observaciones?: string; mascotaId: number; veterinarioId: number; }
```

### `src/app/models/usuario.model.ts`
`rol?: 'ADMIN' | 'EMPLEADO' | 'VETERINARIO'`. Eliminar la página de registro público (ver §6).

---

## 4. Cambios en los componentes (payloads de crear/editar)

### `crear-cita.component.ts`
- Construir request correcto antes de enviar:
```ts
const request = { fecha: cita.fecha, hora: cita.hora + ':00', mascotaId: cita.mascota.id, veterinarioId: cita.veterinario.id, motivo: cita.motivo };
this.citaService.create(request)...
```
- Quitar el `<select>` de estado (siempre `PROGRAMADA`) y el de dueño (no existe en el request; el dueño se deriva de la mascota).
- `hora` del `<input type="time">` → añadir `:00` (segundos).

### `cita.component.ts` + `.html`
- Quitar columna "Dueño" (no viene en la respuesta).
- Añadir acciones según rol:
  - **Cambiar estado** (ADMIN, VETERINARIO): menú PROGRAMADA/COMPLETADA/CANCELADA → `cambiarEstado(id, estado)`.
  - **Cancelar** (los 3): `cancelar(id)` con confirm.
  - **Eliminar** (solo ADMIN): `delete(id)`.
  - Ver citas pendientes / filtros por fecha y por veterinario (ver §5).

### `crear-mascota.component.ts`
- Cambiar a `duenoId`: enviar `{ ...campos, duenoId: this.mascota.dueno!.id }`.
- `peso` es obligatorio (`double` primitivo): validar antes de enviar.

### `crear-factura.component.ts` + `editar-factura.component.ts`
- Enviar `duenoId` (no `dueno`), `detalles: [{ servicioId, cantidad }]` (no `servicio`/`subtotal`), `citaId` opcional, y **no** enviar `total`.
- Al editar, mapear la respuesta: `detalle.servicio.id` → `servicioId` al enviar.

### `factura.component.ts` / `.html`
- `actualizarEstado` → usar `facturaService.cambiarEstado(id, estado)`.
- Mostrar cita asociada si existe (`f.cita`).

### `crear-historial.component.ts`
- Enviar `{ diagnostico, tratamiento, observaciones, mascotaId, veterinarioId }` (sin `fecha`).

### `crear-medicamento.component.ts` / `editar-medicamento.component.ts`
- `update(medicamento)` (sin id en ruta).

### `usuario.component.ts` / `.html`
- Quitar botón eliminar. Añadir "ver detalle" (solo ADMIN) con `getOne`.

---

## 5. Nuevas funcionalidades a añadir

1. **Citas**
   - Cambio de estado (PROGRAMADA → COMPLETADA / CANCELADA) con permisos.
   - Botón **Cancelar cita** (`PUT /cancelar`).
   - Vista **Citas pendientes** (`GET /pendientes`).
   - **Filtro por fecha** (`GET /fecha?fecha=`).
   - **Agenda del día** por veterinario (`GET /agenda?veterinarioId=&fecha=`).
2. **Historial clínico**
   - **Registrar desde cita atendida**: al elegir una cita `COMPLETADA`, crear historial con `POST /historial-clinico/cita/{citaId}` (autocompleta mascota/veterinario desde la cita).
   - **Filtrar por mascota** (`GET /historial-clinico/mascota/{id}`) y **por veterinario** (`GET /historial-clinico/veterinario/{id}`).
3. **Medicamentos**
   - **Buscador por nombre** (`GET /medicamento/buscar?nombre=`).
4. **Mascotas**
   - **Listar por dueño** (`GET /mascota/dueno/{duenoId}`) en la ficha del dueño.
5. **Facturas**
   - Cambio de estado de pago con el endpoint correcto y mensaje del backend.
6. **Dashboard/Home**
   - Añadir métricas nuevas: citas de hoy/pendientes, medicamentos en stock bajo (consume `GET /medicamento`).

---

## 6. Seguridad: roles, guards y menú

### Guards por rol (nuevo `src/app/guards/rol.guard.ts`)
- `rolGuard(roles: RolUsuario[])` que lea `localStorage['rol']` y redirija si no pertenece.
- Aplicar en `app.routes.ts` según la matriz del backend:

| Ruta | Roles |
|---|---|
| `factura` (+crear/editar) | ADMIN, EMPLEADO |
| `historial-clinico` (+crear) | ADMIN, VETERINARIO |
| `usuario`, `usuario/crear` | ADMIN |
| `servicio/crear|editar`, `medicamento/crear|editar` | ADMIN |
| `cita` (cambio estado) | ADMIN, VETERINARIO |

### Menú lateral (`dashboard.component.html`) — ocultar según rol
- **Facturas**: solo ADMIN, EMPLEADO.
- **Historial Clínico**: ADMIN, VETERINARIO.
- **Usuarios**: solo ADMIN.
- Botones de "Nuevo/Editar" de **Servicios y Medicamentos**: solo ADMIN.
- Botón eliminar **Dueño/Mascota/Cita**: solo ADMIN.
- Botón "Nueva Mascota": ADMIN, EMPLEADO (VETERINARIO solo lectura).

### Registro público
- Eliminar `register` route + componente y el enlace "Regístrate" del login.
- La creación de usuarios queda solo en `dashboard/usuario/crear` (ADMIN).

### Interceptor 401 (`auth.interceptor.ts`)
- Al recibir un error `401`, limpiar `localStorage` (token/username/rol) y `router.navigate(['/login'])`.

---

## 7. Mejoras transversales

### Centralizar la URL base
- Crear `src/environments/environment.ts` con `apiUrl: 'http://localhost:8080/api'` y sustituir las cadenas hardcodeadas en los 9 services.

### Manejo de errores del backend
- En los `subscribe` de error, leer `err.error.message` (formato uniforme del backend) y mostrarlo en la UI; si hay `fieldErrors`, mostrarlos por campo.
- Helper compartido `src/app/utils/error.util.ts` (extrae `message` y `fieldErrors`).

### Formatos de fecha/hora
- Fecha: `yyyy-MM-dd` (ya viene del `<input type="date">`).
- Hora: añadir `:00` (segundos) al enviar citas.
- No usar `new Date(...).toISOString()` para fechas (cambia el día por zona horaria); la edición de factura ya hace esto mal (`editar-factura.component.ts:154`).

---

## 8. Orden de implementación sugerido

1. **Models** (base de todo): actualizar `cita`, `factura`, `detalle-factura`, `historial-clinico`, `usuario`, `mascota`; añadir los tipos `*Request`.
2. **Services**: corregir URLs/métodos y añadir los endpoints nuevos.
3. **Interceptor + errors util**: manejo de 401 y de mensajes del backend.
4. **Guards por rol + rutas + menú lateral**.
5. **Componentes CRUD**: corregir payloads (cita, mascota, factura, historial, medicamento, usuario).
6. **Nuevas funcionalidades**: citas (estado/cancelar/pendientes/agenda), historial desde cita, buscar medicamento, mascotas por dueño.
7. **Registro público**: eliminar.
8. **Centralizar URL base** (`environment.ts`).

## 9. Verificación

- `npm run build` sin errores de TypeScript.
- Probar con backend levantado y token real:
  - Login OK; **crear cita** (con `mascotaId`/`veterinarioId`), **cambiar estado**, **cancelar**.
  - **Crear factura** con `duenoId` + `detalles[{servicioId, cantidad}]` (total lo calcula el backend).
  - **Historial desde cita completada**.
  - **Buscar medicamento** por nombre.
  - Forzar un **401** (token inválido) → redirige a `/login`.
  - Iniciar sesión con `EMPLEADO`/`VETERINARIO` → menú y rutas restringidas según matriz.
