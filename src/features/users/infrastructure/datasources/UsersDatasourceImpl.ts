import { getApiErrorMessage, setQueryParams } from '@/features/shared/shared';
import { type AxiosInstance } from 'axios';
import { CreatedUserSchema, UserSchema, UsersDatasource, UsersSchema, type UpdateUserForm, type User, type UserForm, type UsersFilters } from '@/features/users/users';

export class UsersDatasourceImpl implements UsersDatasource {
    constructor(private api: AxiosInstance) { }

    // El backend crea usuarios a través de POST /auth/register
    async createUser(payload: UserForm): Promise<string> {
        try {
            const url = '/auth/register';
            const { data } = await this.api.post(url, payload);
            const response = CreatedUserSchema.safeParse(data);

            if (response.success) {
                return `Usuario ${response.data.name} creado correctamente`;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getUsers(page: number, limit: number, filters: UsersFilters): Promise<User[]> {
        try {
            const params = setQueryParams({ limit, offset: page * limit, ...filters });
            const url = `/users?${params.toString()}`;
            const { data } = await this.api.get(url);
            const response = UsersSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getUserById(id: string): Promise<User> {
        try {
            const url = `/users/${id}`;
            const { data } = await this.api.get(url);
            const response = UserSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async updateUserById(payload: UpdateUserForm, id: string): Promise<string> {
        try {
            const url = `/users/${id}`;
            const { data } = await this.api.patch(url, payload);
            const response = UserSchema.safeParse(data);

            if (response.success) {
                return `Usuario ${response.data.name} actualizado correctamente`;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // DELETE /users/:id no elimina el registro, alterna isActive
    async toggleUserStatus(id: string): Promise<string> {
        try {
            const url = `/users/${id}`;
            const { data } = await this.api.delete(url);
            const response = UserSchema.safeParse(data);

            if (response.success) {
                return `Usuario ${response.data.isActive ? 'activado' : 'desactivado'} correctamente`;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }
}
