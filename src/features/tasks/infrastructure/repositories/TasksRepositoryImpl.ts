import type { PaginatedResponse } from "@/features/shared/shared";
import { TasksDatasource, TasksRepository, type Task, type TasksFilters, type TaskUploadType } from '@/features/tasks/tasks';

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

    deleteTask(id: string): Promise<string> {
        return this.datasource.deleteTask(id);
    }
}
