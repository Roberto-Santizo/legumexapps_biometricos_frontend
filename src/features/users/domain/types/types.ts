import { UserSchema } from "@/features/users/users";
import type { z } from "zod";

export type User = z.infer<typeof UserSchema>;

export type UserForm = Pick<User, 'name' | 'email' | 'roles'> & {
    password: string;
}

export type UpdateUserForm = Partial<UserForm>;

export type UsersFilters = {
    name?: string;
    email?: string;
}
