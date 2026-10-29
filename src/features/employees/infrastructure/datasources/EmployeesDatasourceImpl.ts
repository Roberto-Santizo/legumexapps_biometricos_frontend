import { getApiErrorMessage, setQueryParams, type PaginatedResponse } from '@/features/shared/shared';
import { type AxiosInstance } from 'axios';
import { EmployeeLevelsSchema, EmployeeListItemSchema, EmployeeListSchema, EmployeesDatasource, type Employee, type EmployeeLevel, type EmployeeListItem, type EmployeePayload, type EmployeesFilters, type UpdateEmployeePayload } from '@/features/employees/employees';

// Las acciones de /employees responden con el mensaje de confirmación en texto plano
const toMessage = (data: unknown, fallback: string) => typeof data === 'string' && data ? data : fallback;

const toFormData = (payload: EmployeePayload | UpdateEmployeePayload) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, value);
    });
    return formData;
}

export class EmployeesDatasourceImpl implements EmployeesDatasource {
    constructor(private api: AxiosInstance) { }

    // POST /employees (multipart, foto en el campo `file`) crea al empleado en ZKBioAccess
    async saveEmployee(payload: EmployeePayload): Promise<string> {
        try {
            const url = '/employees';
            const { data } = await this.api.post(url, toFormData(payload));
            return toMessage(data, `Empleado ${payload.name} ${payload.lastName} creado correctamente`);
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // PATCH /employees/:id (multipart, foto opcional en el campo `file`); no acepta el PIN
    async updateEmployeeById(payload: UpdateEmployeePayload, id: string): Promise<string> {
        try {
            const url = `/employees/${id}`;
            const { data } = await this.api.patch(url, toFormData(payload));
            return toMessage(data, 'Empleado actualizado correctamente');
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getEmployees(page: number, limit: number, filters: EmployeesFilters): Promise<PaginatedResponse<EmployeeListItem>> {
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
            const response = EmployeeListItemSchema.safeParse(data);

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
            return toMessage(data, 'Empleado dado de baja correctamente');
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // POST /employees/updateEmployeePhoto/:pin (multipart, campo `file`) envía la foto a ZKBioAccess; responde un mensaje de texto
    async updateEmployeePhoto(pin: string, file: File): Promise<string> {
        try {
            const url = `/employees/updateEmployeePhoto/${encodeURIComponent(pin)}`;
            const formData = new FormData();
            formData.append('file', file);
            const { data } = await this.api.post(url, formData);
            return toMessage(data, 'Foto actualizada correctamente');
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }
}
