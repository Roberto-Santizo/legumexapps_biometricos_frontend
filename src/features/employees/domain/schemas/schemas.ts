import { z } from "zod";
import { PaginatedResponseSchema } from "@/features/shared/shared";

// GET /employees y GET /employees/:id devuelven una vista resumida con el departamento y la posición ya resueltos
export const EmployeeListItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    last_name: z.string(),
    pin: z.coerce.string(),
    // Código de la posición; "Sin posición asignada" cuando no tiene
    position: z.string(),
    position_id: z.string().nullish(),
    createdBy: z.string().nullish(),
    updatedBy: z.string().nullish(),
    department: z.string(),
    departmentCode: z.string(),
    hasPhoto: z.boolean(),
    // Cadena vacía cuando el empleado no tiene fotografía
    photoUrl: z.string()
});

export const EmployeeListSchema = PaginatedResponseSchema(EmployeeListItemSchema);

// `id` es el ID de la asignación nivel-empleado
export const EmployeeLevelSchema = z.object({
    id: z.string(),
    pers_person_id: z.string(),
    level_id: z.string(),
    level_name: z.string()
});

export const EmployeeLevelsSchema = z.array(EmployeeLevelSchema);
