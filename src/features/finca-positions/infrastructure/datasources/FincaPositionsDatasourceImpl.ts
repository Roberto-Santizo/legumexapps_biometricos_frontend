import { getApiErrorMessage, setQueryParams, type PaginatedResponse } from '@/features/shared/shared';
import { type AxiosInstance } from 'axios';
import { FincaPositionSchema, FincaPositionsDatasource, FincaPositionsSchema, type FincaPosition, type FincaPositionForm, type FincaPositionsFilters, type UpdateFincaPositionForm } from '@/features/finca-positions/finca-positions';

export class FincaPositionsDatasourceImpl implements FincaPositionsDatasource {
    constructor(private api: AxiosInstance) { }

    async createFincaPosition(payload: FincaPositionForm): Promise<string> {
        try {
            const url = '/position-finca';
            const { data } = await this.api.post(url, payload);
            const response = FincaPositionSchema.safeParse(data);

            if (response.success) {
                return `Posición ${response.data.position_name} creada correctamente`;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getFincaPositions(page: number, limit: number, filters: FincaPositionsFilters): Promise<PaginatedResponse<FincaPosition>> {
        try {
            const params = setQueryParams({ limit, offset: page * limit, ...filters });
            const url = `/position-finca?${params.toString()}`;
            const { data } = await this.api.get(url);
            const response = FincaPositionsSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getFincaPositionById(id: string): Promise<FincaPosition> {
        try {
            const url = `/position-finca/${id}`;
            const { data } = await this.api.get(url);
            const response = FincaPositionSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async updateFincaPositionById(payload: UpdateFincaPositionForm, id: string): Promise<string> {
        try {
            const url = `/position-finca/${id}`;
            const { data } = await this.api.patch(url, payload);
            const response = FincaPositionSchema.safeParse(data);

            if (response.success) {
                return `Posición ${response.data.position_name} actualizada correctamente`;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // DELETE /position-finca/:id responde con el mensaje de confirmación en texto plano
    async deleteFincaPositionById(id: string): Promise<string> {
        try {
            const url = `/position-finca/${id}`;
            const { data } = await this.api.delete(url);
            return typeof data === 'string' && data ? data : 'Posición eliminada correctamente';
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }
}
