import type { PaginatedResponse } from "@/features/shared/shared";
import type { Department, DepartmentForm, DepartmentsFilters, UpdateDepartmentForm } from "@/features/departments/departments";

export abstract class DepartmentsRepository {
    abstract createDepartment(payload: DepartmentForm): Promise<string>;
    abstract getDepartments(page: number, limit: number, filters: DepartmentsFilters): Promise<PaginatedResponse<Department>>;
    abstract getDepartmentById(id: string): Promise<Department>;
    abstract updateDepartmentById(payload: UpdateDepartmentForm, id: string): Promise<string>;
    abstract deleteDepartmentById(id: string): Promise<string>;
}
