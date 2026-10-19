import { getApiErrorMessage, setQueryParams, type PaginatedResponse } from '@/features/shared/shared';
import { type AxiosInstance } from 'axios';
import { AccessLevelSchema, AccessLevelsDatasource, AccessLevelsSchema, AssignedDoorSchema, DoorsSchema, LevelDoorsSchema, type AccessLevel, type AccessLevelForm, type AccessLevelsFilters, type AssignDoorPayload, type Door, type LevelDoor, type UpdateAccessLevelForm } from '@/features/access-levels/access-levels';

export class AccessLevelsDatasourceImpl implements AccessLevelsDatasource {
    constructor(private api: AxiosInstance) { }

    async createAccessLevel(payload: AccessLevelForm): Promise<string> {
        try {
            const url = '/acc-level';
            const { data } = await this.api.post(url, payload);
            const response = AccessLevelSchema.safeParse(data);

            if (response.success) {
                return `Nivel de acceso ${response.data.name} creado correctamente`;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getAccessLevels(page: number, limit: number, filters: AccessLevelsFilters): Promise<PaginatedResponse<AccessLevel>> {
        try {
            const params = setQueryParams({ limit, offset: page * limit, ...filters });
            const url = `/acc-level?${params.toString()}`;
            const { data } = await this.api.get(url);
            const response = AccessLevelsSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getAccessLevelById(id: string): Promise<AccessLevel> {
        try {
            const url = `/acc-level/${id}`;
            const { data } = await this.api.get(url);
            const response = AccessLevelSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async updateAccessLevelById(payload: UpdateAccessLevelForm, id: string): Promise<string> {
        try {
            const url = `/acc-level/${id}`;
            const { data } = await this.api.patch(url, payload);
            const response = AccessLevelSchema.safeParse(data);

            if (response.success) {
                return `Nivel de acceso ${response.data.name} actualizado correctamente`;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getDoors(): Promise<Door[]> {
        try {
            const url = '/acc-level/doors/getDoors';
            const { data } = await this.api.get(url);
            const response = DoorsSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getLevelDoors(id: string): Promise<LevelDoor[]> {
        try {
            const url = `/acc-level/doors/getLevelDoors/${id}`;
            const { data } = await this.api.get(url);
            const response = LevelDoorsSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async assignDoorToLevel(payload: AssignDoorPayload): Promise<string> {
        try {
            const url = '/acc-level/doors/assignDoorToLevel';
            const { data } = await this.api.post(url, payload);
            const response = AssignedDoorSchema.safeParse(data);

            if (response.success) {
                return 'Puerta asignada al nivel correctamente';
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // DELETE responde con un mensaje en texto plano
    async removeDoorFromLevel(id: string): Promise<string> {
        try {
            const url = `/acc-level/doors/deleteAccLevelDoor/${id}`;
            const { data } = await this.api.delete(url);
            return typeof data === 'string' && data ? data : 'Puerta eliminada de nivel correctamente';
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }
}
