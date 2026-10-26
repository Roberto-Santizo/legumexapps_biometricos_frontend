import { z } from "zod";
import { PaginatedResponseSchema } from "@/features/shared/shared";

export const FincaDepartmentSchema = z.object({
    id: z.number(),
    dept_code: z.string(),
    dept_name: z.string(),
    company_id: z.number()
});

export const FincaDepartmentsSchema = PaginatedResponseSchema(FincaDepartmentSchema);

// POST /departments devuelve únicamente los datos enviados
export const CreateFincaDepartmentResponseSchema = FincaDepartmentSchema.pick({ dept_code: true, dept_name: true });
