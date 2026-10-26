import { getApiErrorMessage, setQueryParams, type PaginatedResponse } from '@/features/shared/shared';
import { type AxiosInstance } from 'axios';
import { CreateFincaDepartmentResponseSchema, FincaDepartmentSchema, FincaDepartmentsDatasource, FincaDepartmentsSchema, type FincaDepartment, type FincaDepartmentForm, type FincaDepartmentsFilters, type UpdateFincaDepartmentForm } from '@/features/finca-departments/finca-departments';

export class FincaDepartmentsDatasourceImpl implements FincaDepartmentsDatasource {
    constructor(private api: AxiosInstance) { }

    async createFincaDepartment(payload: FincaDepartmentForm): Promise<string> {
        try {
            const url = '/departments';
            const { data } = await this.api.post(url, payload);
            const response = CreateFincaDepartmentResponseSchema.safeParse(data);

            if (response.success) {
                return `Departamento ${response.data.dept_name} creado correctamente`;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getFincaDepartments(page: number, limit: number, filters: FincaDepartmentsFilters): Promise<PaginatedResponse<FincaDepartment>> {
        try {
            const params = setQueryParams({ limit, offset: page * limit, ...filters });
            const url = `/departments?${params.toString()}`;
            const { data } = await this.api.get(url);
            const response = FincaDepartmentsSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getFincaDepartmentById(id: string): Promise<FincaDepartment> {
        try {
            const url = `/departments/${id}`;
            const { data } = await this.api.get(url);
            const response = FincaDepartmentSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async updateFincaDepartmentById(payload: UpdateFincaDepartmentForm, id: string): Promise<string> {
        try {
            const url = `/departments/${id}`;
            const { data } = await this.api.patch(url, payload);
            const response = FincaDepartmentSchema.safeParse(data);

            if (response.success) {
                return `Departamento ${response.data.dept_name} actualizado correctamente`;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // DELETE /departments/:id responde con el mensaje de confirmación en texto plano
    async deleteFincaDepartmentById(id: string): Promise<string> {
        try {
            const url = `/departments/${id}`;
            const { data } = await this.api.delete(url);
            return typeof data === 'string' && data ? data : 'Departamento eliminado correctamente';
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }
}
