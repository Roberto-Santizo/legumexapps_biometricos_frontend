import type { PaginatedResponse } from "@/features/shared/shared";
import type { Task, TasksFilters, TaskUploadType } from "@/features/tasks/tasks";

export abstract class TasksRepository {
    abstract getTasks(page: number, limit: number, filters: TasksFilters): Promise<PaginatedResponse<Task>>;
    abstract getTaskById(id: string): Promise<Task>;
    abstract uploadTasks(type: TaskUploadType, file: File): Promise<string>;
    abstract deleteTask(id: string): Promise<string>;
}
