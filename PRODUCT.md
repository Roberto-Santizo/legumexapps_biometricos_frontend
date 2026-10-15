# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **RRHH (rol `rrhh`)**: personal de recursos humanos en oficina, escritorio. Consulta y reporta asistencia de empleados.
- **Admin de TI (rol `admin`)**: gestiona usuarios, roles y dispositivos biométricos.
- **Empleados (rol `user`)**: consultan sus propios marcajes.

## Product Purpose

Plataforma interna Legumex ("Biométricos") que une dos trabajos: administrar los relojes biométricos y los empleados enrolados en ellos, y consultar/reportar la asistencia que esos marcajes generan. Éxito: RRHH obtiene datos de asistencia confiables sin trabajo manual; TI mantiene dispositivos y accesos bajo control.

## Positioning

Pieza de la suite interna Legumexapps; no es producto comercial. Su valor es conectar directamente dispositivos biométricos de Legumex con la operación de RRHH.

## Operating Context

- Uso en oficina, desde escritorio (RRHH, TI). Empleados acceden a sus marcajes.
- Acceso por login (email + contraseña); permisos por rol (`admin`, `rrhh`, `user`, reflejo del enum `ValidRoles` del backend).
- Backend propio vía `VITE_BASE_URL` (proxy `/api` en desarrollo); despliegue en Vercel.

## Capabilities and Constraints

- Implementado: login, layout protegido con barra lateral, gestión de usuarios (listar, crear, ver, editar; estado activo/inactivo; asignación de roles, solo `admin`), tema claro/oscuro.
- Dashboard: aún placeholder ("WorkingOnIt").
- Pendiente / sin definir: módulos de dispositivos, enrolamiento, marcajes y reportes de asistencia (alcance exacto no confirmado; no inventar).
- UI solo en español; sin i18n.
- Stack existente: React 19 + Vite + TypeScript, Tailwind 4, React Router, TanStack Query, Redux Toolkit, react-hook-form + zod, lucide-react, sonner.

## Brand Commitments

- Nombre: "Biométricos" / Legumexapps Biométricos.
- Logo Legumex obligatorio: `https://legumexappsapi-storage.s3.us-east-1.amazonaws.com/resources/LOGO_LX_V2.png`.

## Evidence on Hand

- Sin datos reales de asistencia, dispositivos ni métricas en el repo; no fabricar cifras, empleados ni dispositivos de ejemplo presentados como reales.

## Product Principles

1. Datos de asistencia exactos y trazables por encima de todo; RRHH decide sobre ellos.
2. Cada rol ve solo lo que le corresponde; permisos visibles y predecibles.
3. Tareas repetitivas de oficina (consultar, filtrar, reportar) deben ser rápidas y escaneables.
4. Español claro y directo en toda la interfaz.
