import { getApiErrorMessage, setQueryParams, type PaginatedResponse } from '@/features/shared/shared';
import { type AxiosInstance } from 'axios';
import { FincaAreasSchema, FincaEmployeeDetailSchema, FincaEmployeesDatasource, FincaEmployeesSchema, type AddFincaEmployeeAreaPayload, type FincaArea, type FincaEmployee, type FincaEmployeeDetail, type FincaEmployeePayload, type FincaEmployeesFilters, type UpdateFincaEmployeePayload } from '@/features/finca-employees/finca-employees';

// Las acciones de /employees-finca responden con el mensaje de confirmación en texto plano
const toMessage = (data: unknown, fallback: string) => typeof data === 'string' && data ? data : fallback;

export class FincaEmployeesDatasourceImpl implements FincaEmployeesDatasource {
    constructor(private api: AxiosInstance) { }

    async createFincaEmployee(payload: FincaEmployeePayload): Promise<string> {
        try {
            const url = '/employees-finca';
            const { data } = await this.api.post(url, payload);
            return toMessage(data, 'Empleado creado correctamente');
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getFincaEmployees(page: number, limit: number, filters: FincaEmployeesFilters): Promise<PaginatedResponse<FincaEmployee>> {
        try {
            const params = setQueryParams({ limit, offset: page * limit, ...filters });
            const url = `/employees-finca?${params.toString()}`;
            const { data } = await this.api.get(url);
            const response = FincaEmployeesSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getFincaEmployeeById(id: string): Promise<FincaEmployeeDetail> {
        try {
            const url = `/employees-finca/${id}`;
            const { data } = await this.api.get(url);
            const response = FincaEmployeeDetailSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async updateFincaEmployeeById(payload: UpdateFincaEmployeePayload, id: string): Promise<string> {
        try {
            const url = `/employees-finca/${id}`;
            const { data } = await this.api.patch(url, payload);
            return toMessage(data, 'Empleado actualizado correctamente');
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async resignFincaEmployee(id: string): Promise<string> {
        try {
            const url = `/employees-finca/resignEmployee/${id}`;
            const { data } = await this.api.post(url);
            return toMessage(data, 'Empleado dado de baja correctamente');
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async reinstateFincaEmployee(id: string): Promise<string> {
        try {
            const url = `/employees-finca/reinstatmentEmployee/${id}`;
            const { data } = await this.api.post(url);
            return toMessage(data, 'Empleado dado de alta correctamente');
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async addFincaEmployeeArea(payload: AddFincaEmployeeAreaPayload): Promise<string> {
        try {
            const url = '/employees-finca/addEmployeeArea';
            const { data } = await this.api.post(url, payload);
            return toMessage(data, 'Área asignada correctamente');
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // `id` es el ID de la asignación área-empleado, no el del área
    async deleteFincaEmployeeArea(id: string): Promise<string> {
        try {
            const url = `/employees-finca/deleteEmployeeArea/${id}`;
            const { data } = await this.api.delete(url);
            return toMessage(data, 'Área desasignada correctamente');
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getFincaAreas(): Promise<FincaArea[]> {
        try {
            const url = '/area-finca';
            const { data } = await this.api.get(url);
            const response = FincaAreasSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }
}
