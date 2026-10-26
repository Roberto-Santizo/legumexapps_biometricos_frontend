import { FincaPositionSchema } from "@/features/finca-positions/finca-positions";
import type { z } from "zod";

export type FincaPosition = z.infer<typeof FincaPositionSchema>;

export type FincaPositionForm = Pick<FincaPosition, 'position_code' | 'position_name'>;

export type UpdateFincaPositionForm = Partial<FincaPositionForm>;

export type FincaPositionsFilters = {
    position_code?: string;
    position_name?: string;
}
