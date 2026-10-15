import type { Employee, EmployeeLevel, EmployeeListItem, EmployeePayload, EmployeesFilters, EmployeesRepository } from "@/features/employees/employees";

export class EmployeesProvider {
    constructor(private repository: EmployeesRepository) { }

    saveEmployee(payload: EmployeePayload): Promise<string> {
        return this.repository.saveEmployee(payload);
    }

    getEmployees(page: number, limit: number, filters: EmployeesFilters = {}): Promise<EmployeeListItem[]> {
        return this.repository.getEmployees(page, limit, filters);
    }

    getEmployeeById(id: string): Promise<Employee> {
        return this.repository.getEmployeeById(id);
    }

    getEmployeeLevels(id: string): Promise<EmployeeLevel[]> {
        return this.repository.getEmployeeLevels(id);
    }
}
