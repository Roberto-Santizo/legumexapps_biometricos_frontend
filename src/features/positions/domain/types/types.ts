import { PositionSchema } from "@/features/positions/positions";
import type { z } from "zod";

export type Position = z.infer<typeof PositionSchema>;

export type PositionForm = Pick<Position, 'code' | 'name'>;

export type UpdatePositionForm = Partial<PositionForm>;

export type PositionsFilters = {
    name?: string;
    code?: string;
}
