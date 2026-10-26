import type { PaginatedResponse } from "@/features/shared/shared";
import type { FincaPosition, FincaPositionForm, FincaPositionsFilters, UpdateFincaPositionForm } from "@/features/finca-positions/finca-positions";

export abstract class FincaPositionsRepository {
    abstract createFincaPosition(payload: FincaPositionForm): Promise<string>;
    abstract getFincaPositions(page: number, limit: number, filters: FincaPositionsFilters): Promise<PaginatedResponse<FincaPosition>>;
    abstract getFincaPositionById(id: string): Promise<FincaPosition>;
    abstract updateFincaPositionById(payload: UpdateFincaPositionForm, id: string): Promise<string>;
    abstract deleteFincaPositionById(id: string): Promise<string>;
}
