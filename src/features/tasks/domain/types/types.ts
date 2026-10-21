import { TaskSchema, TaskStatusSchema, TaskTypeSchema } from "@/features/tasks/tasks";
import type { z } from "zod";

export type Task = z.infer<typeof TaskSchema>;

export type TaskType = z.infer<typeof TaskTypeSchema>;

export type TaskStatus = z.infer<typeof TaskStatusSchema>;

// Valor del parámetro :type de POST /tasks/upload/:type (altas, movimientos o bajas)
export type TaskUploadType = 'creation' | 'movement' | 'inactivate';

// pin es búsqueda parcial; scheduled_at es coincidencia exacta de fecha y hora
export type TasksFilters = {
    pin?: string;
    scheduled_at?: string;
}
