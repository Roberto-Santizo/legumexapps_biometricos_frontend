import type { PaginatedResponse } from "@/features/shared/shared";
import type { Employee, EmployeeLevel, EmployeeListItem, EmployeePayload, EmployeesFilters, UpdateEmployeePayload } from "@/features/employees/employees";

export abstract class EmployeesDatasource {
    abstract saveEmployee(payload: EmployeePayload): Promise<string>;
    abstract getEmployees(page: number, limit: number, filters: EmployeesFilters): Promise<PaginatedResponse<EmployeeListItem>>;
    abstract getEmployeeById(id: string): Promise<Employee>;
    abstract updateEmployeeById(payload: UpdateEmployeePayload, id: string): Promise<string>;
    abstract getEmployeeLevels(id: string): Promise<EmployeeLevel[]>;
    abstract inactiveEmployee(id: string): Promise<string>;
    abstract updateEmployeePhoto(pin: string, file: File): Promise<string>;
}
