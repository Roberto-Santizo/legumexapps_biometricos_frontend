import type { PaginatedResponse } from "@/features/shared/shared";
import { DepartmentsDatasource, DepartmentsRepository, type Department, type DepartmentForm, type DepartmentsFilters, type UpdateDepartmentForm } from '@/features/departments/departments';

export class DepartmentsRepositoryImpl implements DepartmentsRepository {
    constructor(private datasource: DepartmentsDatasource) { }

    createDepartment(payload: DepartmentForm): Promise<string> {
        return this.datasource.createDepartment(payload);
    }

    getDepartments(page: number, limit: number, filters: DepartmentsFilters): Promise<PaginatedResponse<Department>> {
        return this.datasource.getDepartments(page, limit, filters);
    }

    getDepartmentById(id: string): Promise<Department> {
        return this.datasource.getDepartmentById(id);
    }

    updateDepartmentById(payload: UpdateDepartmentForm, id: string): Promise<string> {
        return this.datasource.updateDepartmentById(payload, id);
    }

    deleteDepartmentById(id: string): Promise<string> {
        return this.datasource.deleteDepartmentById(id);
    }
}
