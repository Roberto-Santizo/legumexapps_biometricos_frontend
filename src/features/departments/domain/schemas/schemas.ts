import { z } from "zod";
import { PaginatedResponseSchema } from "@/features/shared/shared";

// Los campos de auditoría y jerarquía pueden venir nulos desde la base de datos
export const DepartmentSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    creater_name: z.string().nullish(),
    creater_code: z.string().nullish(),
    updater_name: z.string().nullish(),
    updater_code: z.string().nullish(),
    sort: z.coerce.string().nullish(),
    parent_id: z.string().nullish(),
    create_time: z.string().nullish(),
    update_time: z.string().nullish()
});

export const DepartmentsSchema = PaginatedResponseSchema(DepartmentSchema);
