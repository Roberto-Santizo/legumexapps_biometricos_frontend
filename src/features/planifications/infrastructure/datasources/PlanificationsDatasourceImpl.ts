import { getApiErrorMessage, setQueryParams, type PaginatedResponse } from '@/features/shared/shared';
import { type AxiosInstance } from 'axios';
import type { Task } from '@/features/tasks/tasks';
import { PlanificationSchema, PlanificationTasksSchema, PlanificationsDatasource, PlanificationsSchema, type Planification, type PlanificationForm, type PlanificationListItem, type PlanificationsFilters } from '@/features/planifications/planifications';

export class PlanificationsDatasourceImpl implements PlanificationsDatasource {
    constructor(private api: AxiosInstance) { }

    // POST /planifications responde 400 si la semana ya existe o el año no la tiene
    async createPlanification(payload: PlanificationForm): Promise<Planification> {
        try {
            const url = '/planifications';
            const { data } = await this.api.post(url, payload);
            const response = PlanificationSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getPlanifications(page: number, limit: number, filters: PlanificationsFilters): Promise<PaginatedResponse<PlanificationListItem>> {
        try {
            const params = setQueryParams({ limit, offset: page * limit, ...filters });
            const url = `/planifications?${params.toString()}`;
            const { data } = await this.api.get(url);
            const response = PlanificationsSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // GET /planifications/:id devuelve solo la información de la semana, sin sus tareas
    async getPlanificationById(id: string): Promise<Planification> {
        try {
            const url = `/planifications/${id}`;
            const { data } = await this.api.get(url);
            const response = PlanificationSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getPlanificationTasks(id: string): Promise<Task[]> {
        try {
            const url = `/planifications/tasks/${id}`;
            const { data } = await this.api.get(url);
            const response = PlanificationTasksSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // DELETE /planifications/:id solo procede si la semana no tiene tareas; responde un mensaje de texto
    async deletePlanification(id: string): Promise<string> {
        try {
            const url = `/planifications/${id}`;
            const { data } = await this.api.delete(url);
            return typeof data === 'string' && data ? data : 'Planificación eliminada correctamente';
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }
}
