import { AuthDatasource, type LoginForm, BadRequestError, type AuthUser, Unauthorized, AuthUserSchema } from '@/features/auth/auth';
import { getApiErrorMessage } from '@/features/shared/shared';
import { isAxiosError, type AxiosInstance } from 'axios';

export class AuthDatasourceImpl implements AuthDatasource {
    constructor(private api: AxiosInstance) { }

    async checkStatus(): Promise<AuthUser> {
        try {
            const url = '/auth/check-status';
            const { data } = await this.api.get(url);
            const response = AuthUserSchema.safeParse(data);
            if (response.success) {
                return response.data;
            }

            throw new Error("Error de validación");
        } catch (error) {
            if (isAxiosError(error)) {
                const status = error.response?.status;
                if (status == 401) throw new Unauthorized(getApiErrorMessage(error));
            }
            throw new Error("Error no controlado", { cause: error });
        }
    }

    async login(payload: LoginForm): Promise<AuthUser> {
        try {
            const url = '/auth/login';
            const { data } = await this.api.post(url, payload);
            const response = AuthUserSchema.safeParse(data);
            if (response.success) {
                return response.data;
            }

            throw new Error("Error de validación");
        } catch (error) {
            if (isAxiosError(error)) {
                const status = error.response?.status;
                if (status == 400 || status == 401) throw new BadRequestError(getApiErrorMessage(error));
            }
            throw new Error("Error no controlado", { cause: error });
        }
    }

}
