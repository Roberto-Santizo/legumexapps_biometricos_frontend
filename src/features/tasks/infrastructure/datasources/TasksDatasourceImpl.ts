import { getApiErrorMessage, setQueryParams, type PaginatedResponse } from '@/features/shared/shared';
import { type AxiosInstance } from 'axios';
import { TaskListSchema, TaskSchema, TasksDatasource, type CreationTaskPayload, type InactivationTaskPayload, type MovementTaskPayload, type Task, type TasksFilters, type TaskUploadType, type UpdateTaskPayload } from '@/features/tasks/tasks';

const toFormData = (payload: CreationTaskPayload) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, value);
    });
    return formData;
}

export class TasksDatasourceImpl implements TasksDatasource {
    constructor(private api: AxiosInstance) { }

    async getTasks(page: number, limit: number, filters: TasksFilters): Promise<PaginatedResponse<Task>> {
        try {
            const params = setQueryParams({ limit, offset: page * limit, ...filters });
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

    // POST /tasks/creation (multipart, foto opcional en el campo `file`) programa un alta dentro de la planificación
    async createCreationTask(payload: CreationTaskPayload): Promise<string> {
        return this.saveTask('/tasks/creation', toFormData(payload), 'Alta programada');
    }

    // POST /tasks/movement programa el cambio de posición, departamento y niveles de acceso del empleado
    async createMovementTask(payload: MovementTaskPayload): Promise<string> {
        return this.saveTask('/tasks/movement', payload, 'Movimiento programado');
    }

    // POST /tasks/inactivate programa la baja del empleado
    async createInactivationTask(payload: InactivationTaskPayload): Promise<string> {
        return this.saveTask('/tasks/inactivate', payload, 'Baja programada');
    }

    // PATCH /tasks/:id solo acepta tareas pendientes y los campos que apliquen a su tipo
    async updateTaskById(payload: UpdateTaskPayload, id: string): Promise<string> {
        try {
            const url = `/tasks/${id}`;
            const { data } = await this.api.patch(url, payload);
            const response = TaskSchema.safeParse(data);

            if (response.success) {
                return `Tarea del PIN ${response.data.pin} actualizada correctamente`;
            }

            throw new Error("Información no válida");
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

    // Los POST de programación responden la tarea creada
    private async saveTask(url: string, body: unknown, label: string): Promise<string> {
        try {
            const { data } = await this.api.post(url, body);
            const response = TaskSchema.safeParse(data);

            if (response.success) {
                return `${label} para el PIN ${response.data.pin}`;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }
}
