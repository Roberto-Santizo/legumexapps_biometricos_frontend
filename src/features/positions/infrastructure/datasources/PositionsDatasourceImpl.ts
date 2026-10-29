import { getApiErrorMessage, setQueryParams, type PaginatedResponse } from '@/features/shared/shared';
import { type AxiosInstance } from 'axios';
import { PositionEntitySchema, PositionSchema, PositionsDatasource, PositionsSchema, type Position, type PositionForm, type PositionsFilters, type UpdatePositionForm } from '@/features/positions/positions';

export class PositionsDatasourceImpl implements PositionsDatasource {
    constructor(private api: AxiosInstance) { }

    async createPosition(payload: PositionForm): Promise<string> {
        try {
            const url = '/position';
            const { data } = await this.api.post(url, payload);
            const response = PositionEntitySchema.safeParse(data);

            if (response.success) {
                return `Posición ${response.data.name} creada correctamente`;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getPositions(page: number, limit: number, filters: PositionsFilters): Promise<PaginatedResponse<Position>> {
        try {
            const params = setQueryParams({ limit, offset: page * limit, ...filters });
            const url = `/position?${params.toString()}`;
            const { data } = await this.api.get(url);
            const response = PositionsSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getPositionById(id: string): Promise<Position> {
        try {
            const url = `/position/${id}`;
            const { data } = await this.api.get(url);
            const response = PositionSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // PATCH /position/:id rechaza la actualización si la posición tiene un empleado asignado
    async updatePositionById(payload: UpdatePositionForm, id: string): Promise<string> {
        try {
            const url = `/position/${id}`;
            const { data } = await this.api.patch(url, payload);
            const response = PositionEntitySchema.safeParse(data);

            if (response.success) {
                return `Posición ${response.data.name} actualizada correctamente`;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }
}
