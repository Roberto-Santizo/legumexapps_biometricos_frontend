import type { PaginatedResponse } from "@/features/shared/shared";
import type { CreationTaskPayload, InactivationTaskPayload, MovementTaskPayload, Task, TasksFilters, TasksRepository, TaskUploadType, UpdateTaskPayload } from "@/features/tasks/tasks";

export class TasksProvider {
    constructor(private repository: TasksRepository) { }

    getTasks(page: number, limit: number, filters: TasksFilters = {}): Promise<PaginatedResponse<Task>> {
        return this.repository.getTasks(page, limit, filters);
    }

    getTaskById(id: string): Promise<Task> {
        return this.repository.getTaskById(id);
    }

    uploadTasks(type: TaskUploadType, file: File): Promise<string> {
        return this.repository.uploadTasks(type, file);
    }

    createCreationTask(payload: CreationTaskPayload): Promise<string> {
        return this.repository.createCreationTask(payload);
    }

    createMovementTask(payload: MovementTaskPayload): Promise<string> {
        return this.repository.createMovementTask(payload);
    }

    createInactivationTask(payload: InactivationTaskPayload): Promise<string> {
        return this.repository.createInactivationTask(payload);
    }

    updateTaskById(payload: UpdateTaskPayload, id: string): Promise<string> {
        return this.repository.updateTaskById(payload, id);
    }

    deleteTask(id: string): Promise<string> {
        return this.repository.deleteTask(id);
    }
}
