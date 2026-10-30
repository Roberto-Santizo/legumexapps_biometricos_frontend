import type { PaginatedResponse } from "@/features/shared/shared";
import type { Planification, PlanificationDetail, PlanificationForm, PlanificationListItem, PlanificationsFilters, PlanificationsRepository } from "@/features/planifications/planifications";

export class PlanificationsProvider {
    constructor(private repository: PlanificationsRepository) { }

    createPlanification(payload: PlanificationForm): Promise<Planification> {
        return this.repository.createPlanification(payload);
    }

    getPlanifications(page: number, limit: number, filters: PlanificationsFilters = {}): Promise<PaginatedResponse<PlanificationListItem>> {
        return this.repository.getPlanifications(page, limit, filters);
    }

    getPlanificationById(id: string): Promise<PlanificationDetail> {
        return this.repository.getPlanificationById(id);
    }

    deletePlanification(id: string): Promise<string> {
        return this.repository.deletePlanification(id);
    }
}
