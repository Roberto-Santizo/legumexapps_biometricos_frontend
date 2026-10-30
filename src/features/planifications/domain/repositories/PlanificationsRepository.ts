import type { PaginatedResponse } from "@/features/shared/shared";
import type { Planification, PlanificationDetail, PlanificationForm, PlanificationListItem, PlanificationsFilters } from "@/features/planifications/planifications";

export abstract class PlanificationsRepository {
    abstract createPlanification(payload: PlanificationForm): Promise<Planification>;
    abstract getPlanifications(page: number, limit: number, filters: PlanificationsFilters): Promise<PaginatedResponse<PlanificationListItem>>;
    abstract getPlanificationById(id: string): Promise<PlanificationDetail>;
    abstract deletePlanification(id: string): Promise<string>;
}
