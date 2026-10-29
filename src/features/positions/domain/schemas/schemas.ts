import { z } from "zod";
import { PaginatedResponseSchema } from "@/features/shared/shared";

// El backend puede enviar "Sin empleado asociado" o null cuando la posición no tiene empleado; ambos se normalizan a null
const NO_EMPLOYEE = 'Sin empleado asociado';

// GET /position y GET /position/:id devuelven una vista resumida con el empleado resuelto por nombre
export const PositionSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    createdBy: z.string().nullish(),
    updatedBy: z.string().nullish(),
    employee: z.string().nullish().transform(employee => employee && employee !== NO_EMPLOYEE ? employee : null)
});

export const PositionsSchema = PaginatedResponseSchema(PositionSchema);

// POST y PATCH /position devuelven la entidad completa; solo se usan los datos de identificación
export const PositionEntitySchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string()
});
