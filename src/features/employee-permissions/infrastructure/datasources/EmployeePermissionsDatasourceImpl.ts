import { getApiErrorMessage, setQueryParams, type PaginatedResponse } from '@/features/shared/shared';
import { type AxiosInstance } from 'axios';
import { EmployeePermissionSchema, EmployeePermissionsDatasource, EmployeePermissionsSchema, type EmployeePermission, type EmployeePermissionPayload, type EmployeePermissionsFilters, type PermissionSigner, type UpdateEmployeePermissionForm } from '@/features/employee-permissions/employee-permissions';

// DELETE /permissions/:id responde el mensaje de confirmación en texto plano
const toMessage = (data: unknown, fallback: string) => typeof data === 'string' && data ? data : fallback;

const toFormData = (payload: EmployeePermissionPayload) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, value);
    });
    return formData;
}

export class EmployeePermissionsDatasourceImpl implements EmployeePermissionsDatasource {
    constructor(private api: AxiosInstance) { }

    // POST /permissions (multipart) valida que el trabajador y el comodín existan en ZKBioAccess y no tengan otro permiso esa fecha
    async createPermission(payload: EmployeePermissionPayload): Promise<string> {
        try {
            const url = '/permissions';
            const { data } = await this.api.post(url, toFormData(payload));
            const response = EmployeePermissionSchema.safeParse(data);

            if (response.success) {
                return `Permiso con folio ${response.data.folio} creado correctamente`;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getPermissions(page: number, limit: number, filters: EmployeePermissionsFilters): Promise<PaginatedResponse<EmployeePermission>> {
        try {
            const params = setQueryParams({ limit, offset: page * limit, ...filters });
            const url = `/permissions?${params.toString()}`;
            const { data } = await this.api.get(url);
            const response = EmployeePermissionsSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getPermissionById(id: string): Promise<EmployeePermission> {
        try {
            const url = `/permissions/${id}`;
            const { data } = await this.api.get(url);
            const response = EmployeePermissionSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // PATCH /permissions/:id (JSON) responde 400 si el permiso ya tiene la firma de RRHH
    async updatePermissionById(payload: UpdateEmployeePermissionForm, id: string): Promise<string> {
        try {
            const url = `/permissions/${id}`;
            const { data } = await this.api.patch(url, payload);
            const response = EmployeePermissionSchema.safeParse(data);

            if (response.success) {
                return `Permiso con folio ${response.data.folio} actualizado correctamente`;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async deletePermissionById(id: string): Promise<string> {
        try {
            const url = `/permissions/${id}`;
            const { data } = await this.api.delete(url);
            return toMessage(data, 'Permiso eliminado correctamente');
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // POST /permissions/:id/hr-signature (multipart, campo `signature`) valida el permiso (Vo.Bo.)
    async signPermissionByHr(id: string, signature: File): Promise<string> {
        try {
            const url = `/permissions/${id}/hr-signature`;
            const formData = new FormData();
            formData.append('signature', signature);
            const { data } = await this.api.post(url, formData);
            const response = EmployeePermissionSchema.safeParse(data);

            if (response.success) {
                return `Permiso con folio ${response.data.folio} firmado por RRHH`;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // GET /permissions/:id/signatures/:signer devuelve la imagen PNG; requiere el token, por eso se descarga como Blob
    async getPermissionSignature(id: string, signer: PermissionSigner): Promise<Blob> {
        try {
            const url = `/permissions/${id}/signatures/${signer}`;
            const { data } = await this.api.get<Blob>(url, { responseType: 'blob' });
            return data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "No se pudo cargar la firma"), { cause: error });
        }
    }
}
