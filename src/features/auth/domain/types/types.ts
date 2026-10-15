import { AuthUserSchema } from "@/features/auth/auth";
import type { z } from "zod";

export type AuthUser = z.infer<typeof AuthUserSchema>;