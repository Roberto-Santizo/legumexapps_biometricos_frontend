import type { PaginatedResponse } from "@/features/shared/shared";
import type { Position, PositionForm, PositionsFilters, UpdatePositionForm } from "@/features/positions/positions";

export abstract class PositionsRepository {
    abstract createPosition(payload: PositionForm): Promise<string>;
    abstract getPositions(page: number, limit: number, filters: PositionsFilters): Promise<PaginatedResponse<Position>>;
    abstract getPositionById(id: string): Promise<Position>;
    abstract updatePositionById(payload: UpdatePositionForm, id: string): Promise<string>;
}
