import { z } from "zod";
import { PaginatedResponseSchema } from "@/features/shared/shared";

export const FincaPositionSchema = z.object({
    id: z.number(),
    position_code: z.string(),
    position_name: z.string(),
    is_default: z.boolean(),
    company_id: z.number(),
    parent_position_id: z.number().nullable()
});

export const FincaPositionsSchema = PaginatedResponseSchema(FincaPositionSchema);
