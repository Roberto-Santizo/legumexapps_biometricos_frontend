import { getApiErrorMessage, setQueryParams, type PaginatedResponse } from '@/features/shared/shared';
import { type AxiosInstance } from 'axios';
import { TaskListSchema, TaskSchema, TasksDatasource, type Task, type TasksFilters, type TaskUploadType } from '@/features/tasks/tasks';

// El filtro llega del input datetime-local ("YYYY-MM-DDTHH:mm" en hora local); el backend espera ISO con coincidencia exacta
const toIsoDateTime = (value?: string) => {
    if (!value) return undefined;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toISOString();
}

export class TasksDatasourceImpl implements TasksDatasource {
    constructor(private api: AxiosInstance) { }

    async getTasks(page: number, limit: number, filters: TasksFilters): Promise<PaginatedResponse<Task>> {
        try {
            const params = setQueryParams({ limit, offset: page * limit, ...filters, scheduled_at: toIsoDateTime(filters.scheduled_at) });
            const url = `/tasks?${params.toString()}`;
            const { data } = await this.api.get(url);
            const response = TaskListSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getTaskById(id: string): Promise<Task> {
        try {
            const url = `/tasks/${id}`;
            const { data } = await this.api.get(url);
            const response = TaskSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // POST /tasks/upload/:type (multipart, Excel en el campo `file`) programa una tarea por fila; responde un mensaje de texto
    async uploadTasks(type: TaskUploadType, file: File): Promise<string> {
        try {
            const url = `/tasks/upload/${type}`;
            const formData = new FormData();
            formData.append('file', file);
            const { data } = await this.api.post(url, formData);
            return typeof data === 'string' && data ? data : 'Tareas programadas correctamente';
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // DELETE /tasks/:id responde un mensaje de texto
    async deleteTask(id: string): Promise<string> {
        try {
            const url = `/tasks/${id}`;
            const { data } = await this.api.delete(url);
            return typeof data === 'string' && data ? data : 'Tarea eliminada correctamente';
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }
}
