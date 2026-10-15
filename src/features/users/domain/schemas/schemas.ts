import { z } from "zod";

export const UserSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    email: z.string(),
    isActive: z.boolean(),
    roles: z.array(z.string())
});

export const UsersSchema = z.array(UserSchema);

// POST /auth/register devuelve el usuario creado junto con su token
export const CreatedUserSchema = UserSchema.pick({ id: true, name: true, email: true, roles: true });
