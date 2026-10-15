import { AuthDatasource, AuthRepository, type LoginForm, type AuthUser } from '@/features/auth/auth';

export class AuthRepositoryImpl implements AuthRepository {

    constructor(private datasource: AuthDatasource) { }

    checkStatus(): Promise<AuthUser> {
        return this.datasource.checkStatus();
    }

    login(data: LoginForm): Promise<AuthUser> {
        return this.datasource.login(data);
    }

}