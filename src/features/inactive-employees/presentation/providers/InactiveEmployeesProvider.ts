import type { PaginatedResponse } from "@/features/shared/shared";
import type { InactiveEmployee, InactiveEmployeeListItem, InactiveEmployeesFilters, InactiveEmployeesRepository } from "@/features/inactive-employees/inactive-employees";

export class InactiveEmployeesProvider {
    constructor(private repository: InactiveEmployeesRepository) { }

    getInactiveEmployees(page: number, limit: number, filters: InactiveEmployeesFilters = {}): Promise<PaginatedResponse<InactiveEmployeeListItem>> {
        return this.repository.getInactiveEmployees(page, limit, filters);
    }

    getInactiveEmployeeById(id: string): Promise<InactiveEmployee> {
        return this.repository.getInactiveEmployeeById(id);
    }

    reActivateEmployee(id: string): Promise<string> {
        return this.repository.reActivateEmployee(id);
    }
}
