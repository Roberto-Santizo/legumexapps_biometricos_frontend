import type { AuthRepository, LoginForm, AuthUser } from "@/features/auth/auth";

export class AuthProvider {
    constructor(private repository: AuthRepository) { }

    async login(payload: LoginForm): Promise<AuthUser> {
        return await this.repository.login(payload);
    }

    async checkStatus(){
        return await this.repository.checkStatus();
    }
}