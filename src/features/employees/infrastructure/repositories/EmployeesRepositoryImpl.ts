import type { PaginatedResponse } from "@/features/shared/shared";
import { EmployeesDatasource, EmployeesRepository, type Employee, type EmployeeLevel, type EmployeeListItem, type EmployeePayload, type EmployeesFilters, type UpdateEmployeePayload } from '@/features/employees/employees';

export class EmployeesRepositoryImpl implements EmployeesRepository {
    constructor(private datasource: EmployeesDatasource) { }

    saveEmployee(payload: EmployeePayload): Promise<string> {
        return this.datasource.saveEmployee(payload);
    }

    getEmployees(page: number, limit: number, filters: EmployeesFilters): Promise<PaginatedResponse<EmployeeListItem>> {
        return this.datasource.getEmployees(page, limit, filters);
    }

    getEmployeeById(id: string): Promise<Employee> {
        return this.datasource.getEmployeeById(id);
    }

    updateEmployeeById(payload: UpdateEmployeePayload, id: string): Promise<string> {
        return this.datasource.updateEmployeeById(payload, id);
    }

    getEmployeeLevels(id: string): Promise<EmployeeLevel[]> {
        return this.datasource.getEmployeeLevels(id);
    }

    inactiveEmployee(id: string): Promise<string> {
        return this.datasource.inactiveEmployee(id);
    }

    updateEmployeePhoto(pin: string, file: File): Promise<string> {
        return this.datasource.updateEmployeePhoto(pin, file);
    }

    removeEmployee(pin: string): Promise<string> {
        return this.datasource.removeEmployee(pin);
    }
}
