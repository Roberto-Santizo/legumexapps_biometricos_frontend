import type { PaginatedResponse } from "@/features/shared/shared";
import type { AddFincaEmployeeAreaPayload, FincaArea, FincaEmployee, FincaEmployeeDetail, FincaEmployeePayload, FincaEmployeesFilters, FincaEmployeesRepository } from "@/features/finca-employees/finca-employees";

export class FincaEmployeesProvider {
    constructor(private repository: FincaEmployeesRepository) { }

    createFincaEmployee(payload: FincaEmployeePayload): Promise<string> {
        return this.repository.createFincaEmployee(payload);
    }

    getFincaEmployees(page: number, limit: number, filters: FincaEmployeesFilters = {}): Promise<PaginatedResponse<FincaEmployee>> {
        return this.repository.getFincaEmployees(page, limit, filters);
    }

    getFincaEmployeeById(id: string): Promise<FincaEmployeeDetail> {
        return this.repository.getFincaEmployeeById(id);
    }

    resignFincaEmployee(id: string): Promise<string> {
        return this.repository.resignFincaEmployee(id);
    }

    reinstateFincaEmployee(id: string): Promise<string> {
        return this.repository.reinstateFincaEmployee(id);
    }

    addFincaEmployeeArea(payload: AddFincaEmployeeAreaPayload): Promise<string> {
        return this.repository.addFincaEmployeeArea(payload);
    }

    deleteFincaEmployeeArea(id: string): Promise<string> {
        return this.repository.deleteFincaEmployeeArea(id);
    }

    getFincaAreas(): Promise<FincaArea[]> {
        return this.repository.getFincaAreas();
    }
}
