import { z } from "zod";

//AUTH USER SCHEMA
export const AuthUserSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    email: z.string(),
    roles: z.array(z.string()),
    token: z.string(),
});
