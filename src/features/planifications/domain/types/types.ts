import { PlanificationCountsSchema, PlanificationListItemSchema, PlanificationSchema } from "@/features/planifications/planifications";
import type { z } from "zod";

export type Planification = z.infer<typeof PlanificationSchema>;

export type PlanificationListItem = z.infer<typeof PlanificationListItemSchema>;

export type PlanificationCounts = z.infer<typeof PlanificationCountsSchema>;

// Body de POST /planifications; el backend valida que el año ISO tenga esa semana
export type PlanificationForm = {
    year: number;
    week: number;
}

export type PlanificationsFilters = {
    year?: string;
}
