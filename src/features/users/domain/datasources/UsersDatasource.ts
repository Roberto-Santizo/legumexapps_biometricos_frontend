import type { PaginatedResponse } from "@/features/shared/shared";
import type { UpdateUserForm, User, UserForm, UsersFilters } from "@/features/users/users";

export abstract class UsersDatasource {
    abstract createUser(payload: UserForm): Promise<string>;
    abstract getUsers(page: number, limit: number, filters: UsersFilters): Promise<PaginatedResponse<User>>;
    abstract getUserById(id: string): Promise<User>;
    abstract updateUserById(payload: UpdateUserForm, id: string): Promise<string>;
    abstract toggleUserStatus(id: string): Promise<string>;
}
