import type { PaginatedResponse } from "@/features/shared/shared";
import type { InactiveEmployee, InactiveEmployeeListItem, InactiveEmployeesFilters } from "@/features/inactive-employees/inactive-employees";

export abstract class InactiveEmployeesRepository {
    abstract getInactiveEmployees(page: number, limit: number, filters: InactiveEmployeesFilters): Promise<PaginatedResponse<InactiveEmployeeListItem>>;
    abstract getInactiveEmployeeById(id: string): Promise<InactiveEmployee>;
    abstract reActivateEmployee(id: string): Promise<string>;
}
