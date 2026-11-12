import { z } from "zod";
import { PaginatedResponseSchema } from "@/features/shared/shared";

export const PermissionTypeSchema = z.enum(['enfermedad', 'personal', 'igss', 'duelo', 'otro']);

export const SalaryStatusSchema = z.enum(['con_goce', 'sin_goce', 'falta_injustificada']);

export const PermissionSignerSchema = z.enum(['employee', 'substitute', 'supervisor', 'floor_auditor', 'hr']);

// Datos del trabajador al momento del permiso (no cambian si luego se mueve de área o posición)
export const PermissionEmployeeSchema = z.object({
    pin: z.string(),
    name: z.string(),
    department: z.string(),
    position: z.string().nullable()
});

export const PermissionSubstituteSchema = z.object({
    pin: z.string(),
    name: z.string()
});

export const PermissionSignaturesSchema = z.object({
    employee: z.boolean(),
    substitute: z.boolean(),
    supervisor: z.boolean(),
    floor_auditor: z.boolean(),
    hr: z.boolean()
});

// El permiso solo es válido (is_valid) cuando tiene la firma de RRHH; a partir de ahí ya no se puede editar ni eliminar
export const EmployeePermissionSchema = z.object({
    id: z.string(),
    folio: z.number(),
    date: z.string(),
    employee: PermissionEmployeeSchema,
    substitute: PermissionSubstituteSchema.nullable(),
    type: PermissionTypeSchema,
    reason: z.string(),
    salary_status: SalaryStatusSchema,
    shift_start: z.string(),
    shift_end: z.string(),
    signatures: PermissionSignaturesSchema,
    is_valid: z.boolean(),
    hr_signed_by: z.string().nullable(),
    hr_signed_at: z.string().nullable(),
    created_by: z.string(),
    updated_by: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string()
});

export const EmployeePermissionsSchema = PaginatedResponseSchema(EmployeePermissionSchema);
