import type { PaginatedResponse } from "@/features/shared/shared";
import type { Task } from "@/features/tasks/tasks";
import type { Planification, PlanificationForm, PlanificationListItem, PlanificationsFilters, PlanificationsRepository } from "@/features/planifications/planifications";

export class PlanificationsProvider {
    constructor(private repository: PlanificationsRepository) { }

    createPlanification(payload: PlanificationForm): Promise<Planification> {
        return this.repository.createPlanification(payload);
    }

    getPlanifications(page: number, limit: number, filters: PlanificationsFilters = {}): Promise<PaginatedResponse<PlanificationListItem>> {
        return this.repository.getPlanifications(page, limit, filters);
    }

    getPlanificationById(id: string): Promise<Planification> {
        return this.repository.getPlanificationById(id);
    }

    getPlanificationTasks(id: string): Promise<Task[]> {
        return this.repository.getPlanificationTasks(id);
    }

    deletePlanification(id: string): Promise<string> {
        return this.repository.deletePlanification(id);
    }
}
