import type { PaginatedResponse } from "@/features/shared/shared";
import type { Task, TasksFilters, TasksRepository, TaskUploadType } from "@/features/tasks/tasks";

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

    deleteTask(id: string): Promise<string> {
        return this.repository.deleteTask(id);
    }
}
