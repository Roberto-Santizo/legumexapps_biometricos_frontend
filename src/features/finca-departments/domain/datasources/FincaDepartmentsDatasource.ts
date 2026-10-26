import type { PaginatedResponse } from "@/features/shared/shared";
import type { FincaDepartment, FincaDepartmentForm, FincaDepartmentsFilters, UpdateFincaDepartmentForm } from "@/features/finca-departments/finca-departments";

export abstract class FincaDepartmentsDatasource {
    abstract createFincaDepartment(payload: FincaDepartmentForm): Promise<string>;
    abstract getFincaDepartments(page: number, limit: number, filters: FincaDepartmentsFilters): Promise<PaginatedResponse<FincaDepartment>>;
    abstract getFincaDepartmentById(id: string): Promise<FincaDepartment>;
    abstract updateFincaDepartmentById(payload: UpdateFincaDepartmentForm, id: string): Promise<string>;
    abstract deleteFincaDepartmentById(id: string): Promise<string>;
}
