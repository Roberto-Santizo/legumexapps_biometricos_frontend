import type { PaginatedResponse } from "@/features/shared/shared";
import type { AddFincaEmployeeAreaPayload, FincaArea, FincaEmployee, FincaEmployeeDetail, FincaEmployeePayload, FincaEmployeesFilters } from "@/features/finca-employees/finca-employees";

export abstract class FincaEmployeesDatasource {
    abstract createFincaEmployee(payload: FincaEmployeePayload): Promise<string>;
    abstract getFincaEmployees(page: number, limit: number, filters: FincaEmployeesFilters): Promise<PaginatedResponse<FincaEmployee>>;
    abstract getFincaEmployeeById(id: string): Promise<FincaEmployeeDetail>;
    abstract resignFincaEmployee(id: string): Promise<string>;
    abstract reinstateFincaEmployee(id: string): Promise<string>;
    abstract addFincaEmployeeArea(payload: AddFincaEmployeeAreaPayload): Promise<string>;
    abstract deleteFincaEmployeeArea(id: string): Promise<string>;
    abstract getFincaAreas(): Promise<FincaArea[]>;
}
