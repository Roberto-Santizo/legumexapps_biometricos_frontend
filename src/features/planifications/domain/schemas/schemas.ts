import { z } from "zod";
import { PaginatedResponseSchema } from "@/features/shared/shared";
import { TaskSchema } from "@/features/tasks/tasks";

// Semana ISO (lunes a domingo); start_date y end_date llegan como "YYYY-MM-DD" calculados en zona America/Guatemala
export const PlanificationSchema = z.object({
    id: z.string(),
    year: z.number(),
    week: z.number(),
    start_date: z.string(),
    end_date: z.string(),
    created_by: z.string()
});

export const PlanificationCountsSchema = z.object({
    total: z.number(),
    by_type: z.object({
        alta: z.number(),
        movimiento: z.number(),
        baja: z.number()
    }),
    by_status: z.object({
        pendiente: z.number(),
        completada: z.number(),
        fallida: z.number()
    })
});

// GET /planifications incluye los conteos de tareas de cada semana
export const PlanificationListItemSchema = PlanificationSchema.extend({
    counts: PlanificationCountsSchema
});

export const PlanificationsSchema = PaginatedResponseSchema(PlanificationListItemSchema);

// GET /planifications/tasks/:id devuelve las tareas de la semana ordenadas por fecha programada
export const PlanificationTasksSchema = z.array(TaskSchema);
