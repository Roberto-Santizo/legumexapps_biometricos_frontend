import { EmployeesDatasource, EmployeesRepository, type Employee, type EmployeeLevel, type EmployeeListItem, type EmployeePayload, type EmployeesFilters } from '@/features/employees/employees';

export class EmployeesRepositoryImpl implements EmployeesRepository {
    constructor(private datasource: EmployeesDatasource) { }

    saveEmployee(payload: EmployeePayload): Promise<string> {
        return this.datasource.saveEmployee(payload);
    }

    getEmployees(page: number, limit: number, filters: EmployeesFilters): Promise<EmployeeListItem[]> {
        return this.datasource.getEmployees(page, limit, filters);
    }

    getEmployeeById(id: string): Promise<Employee> {
        return this.datasource.getEmployeeById(id);
    }

    getEmployeeLevels(id: string): Promise<EmployeeLevel[]> {
        return this.datasource.getEmployeeLevels(id);
    }
}
