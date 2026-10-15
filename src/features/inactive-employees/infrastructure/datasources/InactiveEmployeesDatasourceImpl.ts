import { getApiErrorMessage, setQueryParams } from '@/features/shared/shared';
import { type AxiosInstance } from 'axios';
import { InactiveEmployeeListSchema, InactiveEmployeeSchema, InactiveEmployeesDatasource, type InactiveEmployee, type InactiveEmployeeListItem, type InactiveEmployeesFilters } from '@/features/inactive-employees/inactive-employees';

export class InactiveEmployeesDatasourceImpl implements InactiveEmployeesDatasource {
    constructor(private api: AxiosInstance) { }

    async getInactiveEmployees(page: number, limit: number, filters: InactiveEmployeesFilters): Promise<InactiveEmployeeListItem[]> {
        try {
            const params = setQueryParams({ limit, offset: page * limit, ...filters });
            const url = `/inactive-employees?${params.toString()}`;
            const { data } = await this.api.get(url);
            const response = InactiveEmployeeListSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getInactiveEmployeeById(id: string): Promise<InactiveEmployee> {
        try {
            const url = `/inactive-employees/${id}`;
            const { data } = await this.api.get(url);
            const response = InactiveEmployeeSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // POST /inactive-employees/status/reActivateEmployee/:id da de alta al empleado en ZKBioAccess; responde un mensaje de texto
    async reActivateEmployee(id: string): Promise<string> {
        try {
            const url = `/inactive-employees/status/reActivateEmployee/${id}`;
            const { data } = await this.api.post(url);
            return typeof data === 'string' && data ? data : 'Empleado dado de alta correctamente';
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }
}
