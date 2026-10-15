import type { UpdateUserForm, User, UserForm, UsersFilters, UsersRepository } from "@/features/users/users";

export class UsersProvider {
    constructor(private repository: UsersRepository) { }

    createUser(payload: UserForm): Promise<string> {
        return this.repository.createUser(payload);
    }

    getUsers(page: number, limit: number, filters: UsersFilters = {}): Promise<User[]> {
        return this.repository.getUsers(page, limit, filters);
    }

    getUserById(id: string): Promise<User> {
        return this.repository.getUserById(id);
    }

    updateUserById(payload: UpdateUserForm, id: string): Promise<string> {
        return this.repository.updateUserById(payload, id);
    }

    toggleUserStatus(id: string): Promise<string> {
        return this.repository.toggleUserStatus(id);
    }
}
