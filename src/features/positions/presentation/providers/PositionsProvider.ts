import type { PaginatedResponse } from "@/features/shared/shared";
import type { Position, PositionForm, PositionsFilters, PositionsRepository, UpdatePositionForm } from "@/features/positions/positions";

export class PositionsProvider {
    constructor(private repository: PositionsRepository) { }

    createPosition(payload: PositionForm): Promise<string> {
        return this.repository.createPosition(payload);
    }

    getPositions(page: number, limit: number, filters: PositionsFilters = {}): Promise<PaginatedResponse<Position>> {
        return this.repository.getPositions(page, limit, filters);
    }

    getPositionById(id: string): Promise<Position> {
        return this.repository.getPositionById(id);
    }

    updatePositionById(payload: UpdatePositionForm, id: string): Promise<string> {
        return this.repository.updatePositionById(payload, id);
    }
}
