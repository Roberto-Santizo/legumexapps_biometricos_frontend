import { getApiErrorMessage, setQueryParams } from '@/features/shared/shared';
import { type AxiosInstance } from 'axios';
import { EmployeeLevelsSchema, EmployeeListSchema, EmployeeSchema, EmployeesDatasource, type Employee, type EmployeeLevel, type EmployeeListItem, type EmployeePayload, type EmployeesFilters } from '@/features/employees/employees';

export class EmployeesDatasourceImpl implements EmployeesDatasource {
    constructor(private api: AxiosInstance) { }

    // POST /employees crea el empleado en ZKBioAccess o lo actualiza si el PIN ya existe; responde sin cuerpo
    async saveEmployee(payload: EmployeePayload): Promise<string> {
        try {
            const url = '/employees';
            await this.api.post(url, payload);
            return `Empleado ${payload.name} ${payload.lastName} guardado correctamente`;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getEmployees(page: number, limit: number, filters: EmployeesFilters): Promise<EmployeeListItem[]> {
        try {
            const params = setQueryParams({ limit, offset: page * limit, ...filters });
            const url = `/employees?${params.toString()}`;
            const { data } = await this.api.get(url);
            const response = EmployeeListSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getEmployeeById(id: string): Promise<Employee> {
        try {
            const url = `/employees/${id}`;
            const { data } = await this.api.get(url);
            const response = EmployeeSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getEmployeeLevels(id: string): Promise<EmployeeLevel[]> {
        try {
            const url = `/employees/levels/getEmployeeLevels/${id}`;
            const { data } = await this.api.get(url);
            const response = EmployeeLevelsSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // POST /employees/status/inactiveEmployee/:id da de baja al empleado en ZKBioAccess; responde un mensaje de texto
    async inactiveEmployee(id: string): Promise<string> {
        try {
            const url = `/employees/status/inactiveEmployee/${id}`;
            const { data } = await this.api.post(url);
            return typeof data === 'string' && data ? data : 'Empleado dado de baja correctamente';
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }
}
