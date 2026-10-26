import type { PaginatedResponse } from "@/features/shared/shared";
import { FincaDepartmentsDatasource, FincaDepartmentsRepository, type FincaDepartment, type FincaDepartmentForm, type FincaDepartmentsFilters, type UpdateFincaDepartmentForm } from '@/features/finca-departments/finca-departments';

export class FincaDepartmentsRepositoryImpl implements FincaDepartmentsRepository {
    constructor(private datasource: FincaDepartmentsDatasource) { }

    createFincaDepartment(payload: FincaDepartmentForm): Promise<string> {
        return this.datasource.createFincaDepartment(payload);
    }

    getFincaDepartments(page: number, limit: number, filters: FincaDepartmentsFilters): Promise<PaginatedResponse<FincaDepartment>> {
        return this.datasource.getFincaDepartments(page, limit, filters);
    }

    getFincaDepartmentById(id: string): Promise<FincaDepartment> {
        return this.datasource.getFincaDepartmentById(id);
    }

    updateFincaDepartmentById(payload: UpdateFincaDepartmentForm, id: string): Promise<string> {
        return this.datasource.updateFincaDepartmentById(payload, id);
    }

    deleteFincaDepartmentById(id: string): Promise<string> {
        return this.datasource.deleteFincaDepartmentById(id);
    }
}
