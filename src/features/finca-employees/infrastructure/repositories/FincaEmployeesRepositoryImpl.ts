import type { PaginatedResponse } from "@/features/shared/shared";
import { FincaEmployeesDatasource, FincaEmployeesRepository, type AddFincaEmployeeAreaPayload, type FincaArea, type FincaEmployee, type FincaEmployeeDetail, type FincaEmployeePayload, type FincaEmployeesFilters, type UpdateFincaEmployeePayload } from '@/features/finca-employees/finca-employees';

export class FincaEmployeesRepositoryImpl implements FincaEmployeesRepository {
    constructor(private datasource: FincaEmployeesDatasource) { }

    createFincaEmployee(payload: FincaEmployeePayload): Promise<string> {
        return this.datasource.createFincaEmployee(payload);
    }

    getFincaEmployees(page: number, limit: number, filters: FincaEmployeesFilters): Promise<PaginatedResponse<FincaEmployee>> {
        return this.datasource.getFincaEmployees(page, limit, filters);
    }

    getFincaEmployeeById(id: string): Promise<FincaEmployeeDetail> {
        return this.datasource.getFincaEmployeeById(id);
    }

    updateFincaEmployeeById(payload: UpdateFincaEmployeePayload, id: string): Promise<string> {
        return this.datasource.updateFincaEmployeeById(payload, id);
    }

    resignFincaEmployee(id: string): Promise<string> {
        return this.datasource.resignFincaEmployee(id);
    }

    reinstateFincaEmployee(id: string): Promise<string> {
        return this.datasource.reinstateFincaEmployee(id);
    }

    addFincaEmployeeArea(payload: AddFincaEmployeeAreaPayload): Promise<string> {
        return this.datasource.addFincaEmployeeArea(payload);
    }

    deleteFincaEmployeeArea(id: string): Promise<string> {
        return this.datasource.deleteFincaEmployeeArea(id);
    }

    getFincaAreas(): Promise<FincaArea[]> {
        return this.datasource.getFincaAreas();
    }
}
