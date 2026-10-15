import { UsersDatasource, UsersRepository, type UpdateUserForm, type User, type UserForm, type UsersFilters } from '@/features/users/users';

export class UsersRepositoryImpl implements UsersRepository {
    constructor(private datasource: UsersDatasource) { }

    createUser(payload: UserForm): Promise<string> {
        return this.datasource.createUser(payload);
    }

    getUsers(page: number, limit: number, filters: UsersFilters): Promise<User[]> {
        return this.datasource.getUsers(page, limit, filters);
    }

    getUserById(id: string): Promise<User> {
        return this.datasource.getUserById(id);
    }

    updateUserById(payload: UpdateUserForm, id: string): Promise<string> {
        return this.datasource.updateUserById(payload, id);
    }

    toggleUserStatus(id: string): Promise<string> {
        return this.datasource.toggleUserStatus(id);
    }
}
