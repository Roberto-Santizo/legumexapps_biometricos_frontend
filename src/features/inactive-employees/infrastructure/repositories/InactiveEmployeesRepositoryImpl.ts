import type { PaginatedResponse } from "@/features/shared/shared";
import { InactiveEmployeesDatasource, InactiveEmployeesRepository, type InactiveEmployee, type InactiveEmployeeListItem, type InactiveEmployeesFilters } from '@/features/inactive-employees/inactive-employees';

export class InactiveEmployeesRepositoryImpl implements InactiveEmployeesRepository {
    constructor(private datasource: InactiveEmployeesDatasource) { }

    getInactiveEmployees(page: number, limit: number, filters: InactiveEmployeesFilters): Promise<PaginatedResponse<InactiveEmployeeListItem>> {
        return this.datasource.getInactiveEmployees(page, limit, filters);
    }

    getInactiveEmployeeById(id: string): Promise<InactiveEmployee> {
        return this.datasource.getInactiveEmployeeById(id);
    }

    reActivateEmployee(id: string): Promise<string> {
        return this.datasource.reActivateEmployee(id);
    }
}
