import { z } from "zod";
import { PaginatedResponseSchema } from "@/features/shared/shared";

export const TaskTypeSchema = z.enum(['alta', 'movimiento', 'baja']);

export const TaskStatusSchema = z.enum(['pendiente', 'completada', 'fallida']);

// GET /tasks devuelve las tareas programadas para ZKBioAccess; scheduled_at llega como "dd-MM-yyyy HH:mm:ss"
export const TaskSchema = z.object({
    id: z.string(),
    type: TaskTypeSchema,
    status: TaskStatusSchema,
    pin: z.coerce.string(),
    // alta { pin, name, lastName, deptCode, accLevelIds }, movimiento { pin, position, deptCode, accLevelIds }, baja { pin, leaveType, leaveDate }
    payload: z.record(z.string(), z.unknown()),
    // Datos del empleado antes del movimiento; solo viene en tareas de tipo movimiento
    previous: z.record(z.string(), z.unknown()).nullish(),
    scheduled_at: z.string(),
    created_by: z.string(),
    // null en tareas cargadas por Excel
    planification_id: z.string().nullish()
});

export const TaskListSchema = PaginatedResponseSchema(TaskSchema);
