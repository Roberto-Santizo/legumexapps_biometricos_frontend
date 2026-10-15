import { getApiErrorMessage, setQueryParams } from '@/features/shared/shared';
import { type AxiosInstance } from 'axios';
import { DepartmentSchema, DepartmentsDatasource, DepartmentsSchema, type Department, type DepartmentForm, type DepartmentsFilters, type UpdateDepartmentForm } from '@/features/departments/departments';

export class DepartmentsDatasourceImpl implements DepartmentsDatasource {
    constructor(private api: AxiosInstance) { }

    async createDepartment(payload: DepartmentForm): Promise<string> {
        try {
            const url = '/auth-department';
            const { data } = await this.api.post(url, payload);
            const response = DepartmentSchema.safeParse(data);

            if (response.success) {
                return `Departamento ${response.data.name} creado correctamente`;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getDepartments(page: number, limit: number, filters: DepartmentsFilters): Promise<Department[]> {
        try {
            const params = setQueryParams({ limit, offset: page * limit, ...filters });
            const url = `/auth-department?${params.toString()}`;
            const { data } = await this.api.get(url);
            const response = DepartmentsSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getDepartmentById(id: string): Promise<Department> {
        try {
            const url = `/auth-department/${id}`;
            const { data } = await this.api.get(url);
            const response = DepartmentSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async updateDepartmentById(payload: UpdateDepartmentForm, id: string): Promise<string> {
        try {
            const url = `/auth-department/${id}`;
            const { data } = await this.api.patch(url, payload);
            const response = DepartmentSchema.safeParse(data);

            if (response.success) {
                return `Departamento ${response.data.name} actualizado correctamente`;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // DELETE /auth-department/:id responde sin cuerpo
    async deleteDepartmentById(id: string): Promise<string> {
        try {
            const url = `/auth-department/${id}`;
            await this.api.delete(url);
            return 'Departamento eliminado correctamente';
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }
}
