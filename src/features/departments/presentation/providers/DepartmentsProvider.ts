import type { Department, DepartmentForm, DepartmentsFilters, DepartmentsRepository, UpdateDepartmentForm } from "@/features/departments/departments";

export class DepartmentsProvider {
    constructor(private repository: DepartmentsRepository) { }

    createDepartment(payload: DepartmentForm): Promise<string> {
        return this.repository.createDepartment(payload);
    }

    getDepartments(page: number, limit: number, filters: DepartmentsFilters = {}): Promise<Department[]> {
        return this.repository.getDepartments(page, limit, filters);
    }

    getDepartmentById(id: string): Promise<Department> {
        return this.repository.getDepartmentById(id);
    }

    updateDepartmentById(payload: UpdateDepartmentForm, id: string): Promise<string> {
        return this.repository.updateDepartmentById(payload, id);
    }

    deleteDepartmentById(id: string): Promise<string> {
        return this.repository.deleteDepartmentById(id);
    }
}
