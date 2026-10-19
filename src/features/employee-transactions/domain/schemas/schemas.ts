import { z } from "zod";
import { PaginatedResponseSchema } from "@/features/shared/shared";

// GET /employee-transactions devuelve los marcajes registrados en los dispositivos de ZKBioAccess
export const EmployeeTransactionSchema = z.object({
    id: z.string(),
    pin: z.coerce.string(),
    name: z.string(),
    // ZKBioAccess guarda aquí la posición del empleado (así lo exporta también el reporte)
    last_name: z.string().nullish(),
    dept_code: z.coerce.string().nullish(),
    dept_name: z.string().nullish(),
    dev_alias: z.string().nullish(),
    event_time: z.string()
});

export const EmployeeTransactionListSchema = PaginatedResponseSchema(EmployeeTransactionSchema);
