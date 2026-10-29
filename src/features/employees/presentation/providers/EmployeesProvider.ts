import type { PaginatedResponse } from "@/features/shared/shared";
import type { Employee, EmployeeLevel, EmployeeListItem, EmployeePayload, EmployeesFilters, EmployeesRepository, UpdateEmployeePayload } from "@/features/employees/employees";

export class EmployeesProvider {
    constructor(private repository: EmployeesRepository) { }

    saveEmployee(payload: EmployeePayload): Promise<string> {
        return this.repository.saveEmployee(payload);
    }

    getEmployees(page: number, limit: number, filters: EmployeesFilters = {}): Promise<PaginatedResponse<EmployeeListItem>> {
        return this.repository.getEmployees(page, limit, filters);
    }

    getEmployeeById(id: string): Promise<Employee> {
        return this.repository.getEmployeeById(id);
    }

    updateEmployeeById(payload: UpdateEmployeePayload, id: string): Promise<string> {
        return this.repository.updateEmployeeById(payload, id);
    }

    getEmployeeLevels(id: string): Promise<EmployeeLevel[]> {
        return this.repository.getEmployeeLevels(id);
    }

    inactiveEmployee(id: string): Promise<string> {
        return this.repository.inactiveEmployee(id);
    }

    updateEmployeePhoto(pin: string, file: File): Promise<string> {
        return this.repository.updateEmployeePhoto(pin, file);
    }
}
