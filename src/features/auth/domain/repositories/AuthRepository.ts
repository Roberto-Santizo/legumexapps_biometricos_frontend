import type { LoginForm, AuthUser } from "@/features/auth/auth";

export abstract class AuthRepository {
    abstract login(data: LoginForm): Promise<AuthUser>;
    abstract checkStatus(): Promise<AuthUser>;
}