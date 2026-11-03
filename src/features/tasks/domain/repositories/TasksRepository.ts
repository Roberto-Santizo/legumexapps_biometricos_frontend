import type { PaginatedResponse } from "@/features/shared/shared";
import type { CreationTaskPayload, InactivationTaskPayload, MovementTaskPayload, Task, TasksFilters, TaskUploadType, UpdateTaskPayload } from "@/features/tasks/tasks";

export abstract class TasksRepository {
    abstract getTasks(page: number, limit: number, filters: TasksFilters): Promise<PaginatedResponse<Task>>;
    abstract getTaskById(id: string): Promise<Task>;
    abstract uploadTasks(type: TaskUploadType, file: File): Promise<string>;
    abstract createCreationTask(payload: CreationTaskPayload): Promise<string>;
    abstract createMovementTask(payload: MovementTaskPayload): Promise<string>;
    abstract createInactivationTask(payload: InactivationTaskPayload): Promise<string>;
    abstract updateTaskById(payload: UpdateTaskPayload, id: string): Promise<string>;
    abstract deleteTask(id: string): Promise<string>;
}
