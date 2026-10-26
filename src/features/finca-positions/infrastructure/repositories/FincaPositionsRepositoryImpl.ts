import type { PaginatedResponse } from "@/features/shared/shared";
import { FincaPositionsDatasource, FincaPositionsRepository, type FincaPosition, type FincaPositionForm, type FincaPositionsFilters, type UpdateFincaPositionForm } from '@/features/finca-positions/finca-positions';

export class FincaPositionsRepositoryImpl implements FincaPositionsRepository {
    constructor(private datasource: FincaPositionsDatasource) { }

    createFincaPosition(payload: FincaPositionForm): Promise<string> {
        return this.datasource.createFincaPosition(payload);
    }

    getFincaPositions(page: number, limit: number, filters: FincaPositionsFilters): Promise<PaginatedResponse<FincaPosition>> {
        return this.datasource.getFincaPositions(page, limit, filters);
    }

    getFincaPositionById(id: string): Promise<FincaPosition> {
        return this.datasource.getFincaPositionById(id);
    }

    updateFincaPositionById(payload: UpdateFincaPositionForm, id: string): Promise<string> {
        return this.datasource.updateFincaPositionById(payload, id);
    }

    deleteFincaPositionById(id: string): Promise<string> {
        return this.datasource.deleteFincaPositionById(id);
    }
}
