import type { PaginatedResponse } from "@/features/shared/shared";
import { PositionsDatasource, PositionsRepository, type Position, type PositionForm, type PositionsFilters, type UpdatePositionForm } from '@/features/positions/positions';

export class PositionsRepositoryImpl implements PositionsRepository {
    constructor(private datasource: PositionsDatasource) { }

    createPosition(payload: PositionForm): Promise<string> {
        return this.datasource.createPosition(payload);
    }

    getPositions(page: number, limit: number, filters: PositionsFilters): Promise<PaginatedResponse<Position>> {
        return this.datasource.getPositions(page, limit, filters);
    }

    getPositionById(id: string): Promise<Position> {
        return this.datasource.getPositionById(id);
    }

    updatePositionById(payload: UpdatePositionForm, id: string): Promise<string> {
        return this.datasource.updatePositionById(payload, id);
    }
}
