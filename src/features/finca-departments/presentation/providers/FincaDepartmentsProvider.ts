import type { PaginatedResponse } from "@/features/shared/shared";
import type { FincaDepartment, FincaDepartmentForm, FincaDepartmentsFilters, FincaDepartmentsRepository, UpdateFincaDepartmentForm } from "@/features/finca-departments/finca-departments";

export class FincaDepartmentsProvider {
    constructor(private repository: FincaDepartmentsRepository) { }

    createFincaDepartment(payload: FincaDepartmentForm): Promise<string> {
        return this.repository.createFincaDepartment(payload);
    }

    getFincaDepartments(page: number, limit: number, filters: FincaDepartmentsFilters = {}): Promise<PaginatedResponse<FincaDepartment>> {
        return this.repository.getFincaDepartments(page, limit, filters);
    }

    getFincaDepartmentById(id: string): Promise<FincaDepartment> {
        return this.repository.getFincaDepartmentById(id);
    }

    updateFincaDepartmentById(payload: UpdateFincaDepartmentForm, id: string): Promise<string> {
        return this.repository.updateFincaDepartmentById(payload, id);
    }

    deleteFincaDepartmentById(id: string): Promise<string> {
        return this.repository.deleteFincaDepartmentById(id);
    }
}
