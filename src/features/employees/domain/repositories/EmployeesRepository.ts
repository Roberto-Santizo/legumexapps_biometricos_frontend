import type { Employee, EmployeeLevel, EmployeeListItem, EmployeePayload, EmployeesFilters } from "@/features/employees/employees";

export abstract class EmployeesRepository {
    abstract saveEmployee(payload: EmployeePayload): Promise<string>;
    abstract getEmployees(page: number, limit: number, filters: EmployeesFilters): Promise<EmployeeListItem[]>;
    abstract getEmployeeById(id: string): Promise<Employee>;
    abstract getEmployeeLevels(id: string): Promise<EmployeeLevel[]>;
}
