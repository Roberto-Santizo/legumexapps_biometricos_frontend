import type { PaginatedResponse } from "@/features/shared/shared";
import { TasksDatasource, TasksRepository, type CreationTaskPayload, type InactivationTaskPayload, type MovementTaskPayload, type Task, type TasksFilters, type TaskUploadType, type UpdateTaskPayload } from '@/features/tasks/tasks';

export class TasksRepositoryImpl implements TasksRepository {
    constructor(private datasource: TasksDatasource) { }

    getTasks(page: number, limit: number, filters: TasksFilters): Promise<PaginatedResponse<Task>> {
        return this.datasource.getTasks(page, limit, filters);
    }

    getTaskById(id: string): Promise<Task> {
        return this.datasource.getTaskById(id);
    }

    uploadTasks(type: TaskUploadType, file: File): Promise<string> {
        return this.datasource.uploadTasks(type, file);
    }

    createCreationTask(payload: CreationTaskPayload): Promise<string> {
        return this.datasource.createCreationTask(payload);
    }

    createMovementTask(payload: MovementTaskPayload): Promise<string> {
        return this.datasource.createMovementTask(payload);
    }

    createInactivationTask(payload: InactivationTaskPayload): Promise<string> {
        return this.datasource.createInactivationTask(payload);
    }

    updateTaskById(payload: UpdateTaskPayload, id: string): Promise<string> {
        return this.datasource.updateTaskById(payload, id);
    }

    deleteTask(id: string): Promise<string> {
        return this.datasource.deleteTask(id);
    }
}
