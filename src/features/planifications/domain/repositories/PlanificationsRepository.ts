import type { PaginatedResponse } from "@/features/shared/shared";
import type { Task } from "@/features/tasks/tasks";
import type { Planification, PlanificationForm, PlanificationListItem, PlanificationsFilters } from "@/features/planifications/planifications";

export abstract class PlanificationsRepository {
    abstract createPlanification(payload: PlanificationForm): Promise<Planification>;
    abstract getPlanifications(page: number, limit: number, filters: PlanificationsFilters): Promise<PaginatedResponse<PlanificationListItem>>;
    abstract getPlanificationById(id: string): Promise<Planification>;
    abstract getPlanificationTasks(id: string): Promise<Task[]>;
    abstract deletePlanification(id: string): Promise<string>;
}
