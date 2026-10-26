import type { PaginatedResponse } from "@/features/shared/shared";
import type { FincaPosition, FincaPositionForm, FincaPositionsFilters, FincaPositionsRepository, UpdateFincaPositionForm } from "@/features/finca-positions/finca-positions";

export class FincaPositionsProvider {
    constructor(private repository: FincaPositionsRepository) { }

    createFincaPosition(payload: FincaPositionForm): Promise<string> {
        return this.repository.createFincaPosition(payload);
    }

    getFincaPositions(page: number, limit: number, filters: FincaPositionsFilters = {}): Promise<PaginatedResponse<FincaPosition>> {
        return this.repository.getFincaPositions(page, limit, filters);
    }

    getFincaPositionById(id: string): Promise<FincaPosition> {
        return this.repository.getFincaPositionById(id);
    }

    updateFincaPositionById(payload: UpdateFincaPositionForm, id: string): Promise<string> {
        return this.repository.updateFincaPositionById(payload, id);
    }

    deleteFincaPositionById(id: string): Promise<string> {
        return this.repository.deleteFincaPositionById(id);
    }
}
