import type { PaginatedResponse } from "@/features/shared/shared";
import { PlanificationsDatasource, PlanificationsRepository, type Planification, type PlanificationDetail, type PlanificationForm, type PlanificationListItem, type PlanificationsFilters } from '@/features/planifications/planifications';

export class PlanificationsRepositoryImpl implements PlanificationsRepository {
    constructor(private datasource: PlanificationsDatasource) { }

    createPlanification(payload: PlanificationForm): Promise<Planification> {
        return this.datasource.createPlanification(payload);
    }

    getPlanifications(page: number, limit: number, filters: PlanificationsFilters): Promise<PaginatedResponse<PlanificationListItem>> {
        return this.datasource.getPlanifications(page, limit, filters);
    }

    getPlanificationById(id: string): Promise<PlanificationDetail> {
        return this.datasource.getPlanificationById(id);
    }

    deletePlanification(id: string): Promise<string> {
        return this.datasource.deletePlanification(id);
    }
}
