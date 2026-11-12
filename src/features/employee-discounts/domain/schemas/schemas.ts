import { z } from "zod";
import { PaginatedResponseSchema } from "@/features/shared/shared";

// code es el PIN del empleado en ZKBioAccess; el descuento no trae nombre ni foto, se consultan por PIN
export const EmployeeDiscountSchema = z.object({
    id: z.string(),
    code: z.string(),
    // Algunas columnas decimal llegan como string; se normaliza a número
    amount: z.coerce.number(),
    date: z.string(),
    createdAt: z.string(),
    updatedAt: z.string()
});

export const EmployeeDiscountsSchema = PaginatedResponseSchema(EmployeeDiscountSchema);
