import { z } from "zod";
import { PaginatedResponseSchema } from "@/features/shared/shared";

// GET /employees-finca devuelve el departamento y la posición ya resueltos por nombre
export const FincaEmployeeSchema = z.object({
    id: z.number(),
    emp_code: z.string(),
    first_name: z.string(),
    // BioTime permite empleados sin apellidos
    last_name: z.string().nullish(),
    department: z.string(),
    position: z.string(),
    resign: z.boolean()
});

export const FincaEmployeesSchema = PaginatedResponseSchema(FincaEmployeeSchema);

// `id` es el ID de la asignación área-empleado (se usa para desasignar el área)
export const FincaEmployeeAreaSchema = z.object({
    id: z.number(),
    area_code: z.string(),
    area_name: z.string()
});

export const FincaEmployeeDetailSchema = FincaEmployeeSchema.extend({
    areas: z.array(FincaEmployeeAreaSchema)
});

// GET /area-finca devuelve el catálogo completo de áreas, sin paginar
export const FincaAreaSchema = z.object({
    id: z.number(),
    area_code: z.string(),
    area_name: z.string()
});

export const FincaAreasSchema = z.array(FincaAreaSchema);
