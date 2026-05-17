# Ventanilla Única Frontend

Aplicación frontend desarrollada con Angular 21 para la gestión de citas y servicios de una ventanilla única.

## Descripción

Esta aplicación incluye:

- Autenticación con `login` y `register`.
- Área pública de directorio y reserva de citas.
- Panel de control con secciones para citas, usuarios, trabajadores, empresas, administradores, salas, horarios, actividades y feriados.
- Roles con control de acceso (`SuperAdmin`, `Admin`, `Worker`, `BaseUser`).
- Confirmación de llegada y sala de espera con conexión en tiempo real (`socket.io-client`).
- Localización en inglés (`en-US`) y español (`es`).

## Tecnologías principales

- Angular 21
- TypeScript
- Tailwind CSS
- PrimeNG / PrimeIcons
- FullCalendar
- ngx-formly
- jsPDF
- socket.io-client
- Vitest

## Requisitos

- Node.js compatible con npm 11.8.0
- Angular CLI compatible con Angular 21
- Backend API activo para la autenticación y consumo de los servicios de citas, usuarios, empresas, salas, horarios y vacaciones.

> El frontend usa URLs de API como `http://localhost:3000/api/...` en varios servicios. Ajusta las rutas si tu backend corre en otro puerto o dominio.

## Instalación

```bash
npm install
```

## Ejecución en desarrollo

```bash
npm start
```

Abre `http://localhost:4200/` en tu navegador.

## Rutas principales

- `/` → Directorio de servicios y reserva de citas
- `/login` → Inicio de sesión
- `/register` → Registro de nuevos usuarios
- `/dashboard` → Panel protegido de administración y gestión
- `/dashboard/home` → Página principal del dashboard
- `/dashboard/appointments` → Gestión de citas
- `/dashboard/today` → Citas del día
- `/dashboard/users` → Gestión de usuarios
- `/dashboard/workers` → Gestión de trabajadores
- `/dashboard/companies` → Gestión de empresas
- `/dashboard/admins` → Gestión de administradores
- `/dashboard/holidays` → Gestión de feriados
- `/dashboard/schedules` → Gestión de horarios
- `/dashboard/activities` → Gestión de actividades
- `/dashboard/rooms` → Gestión de salas
- `/dashboard/my-data` → Perfil del usuario
- `/dashboard/company-data` → Datos de la empresa
- `/confirm` → Confirmación de llegada
- `/waiting/:id` → Sala de espera en tiempo real
- `/find-appointment` → Búsqueda de citas

## Construcción para producción

```bash
npm run build
```

Los archivos generados se colocan en `dist/`.

## Pruebas

```bash
npm test
```

## Notas importantes

- El proyecto usa `localStorage` para persistir el token JWT.
- El layout principal está en `src/app/layout/main-layout/`.
- El servicio de temas está en `src/app/utils/themeservice.ts`.
- Los archivos de localización son `messages.xlf` y `messages_es.xlf`.

## Estructura clave

- `src/app/auth/` → Inicio de sesión y registro
- `src/app/features/dashboard/` → Secciones del panel administrativo
- `src/app/features/directory/` → Reserva pública de citas
- `src/app/core/services/` → Servicios que consumen el backend
- `src/app/layout/` → Navegación, footer y layout general

## Créditos

Basado en el proyecto Ventanilla Única NovaHub.
