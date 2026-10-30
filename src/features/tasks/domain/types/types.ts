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

// Valores de los formularios de tareas; cada tipo usa solo sus campos. scheduled_at viene de un input date ("YYYY-MM-DD")
export type TaskForm = {
    planification_id: string;
    scheduled_at: string;
    employee_id: string;
    pin: string;
    name: string;
    lastName: string;
    position_id: string;
    auth_dept_id: string;
    accLevelIds: string[];
    // Fotografía opcional del alta (jpg, jpeg, png o gif)
    file: File | null;
}

// Body multipart de POST /tasks/creation; accLevelIds van separados por coma
export type CreationTaskPayload = Pick<TaskForm, 'planification_id' | 'pin' | 'name' | 'lastName' | 'position_id' | 'auth_dept_id' | 'scheduled_at'> & {
    accLevelIds: string;
    file?: File;
}

// Body de POST /tasks/movement
export type MovementTaskPayload = Pick<TaskForm, 'planification_id' | 'employee_id' | 'position_id' | 'auth_dept_id' | 'scheduled_at'> & {
    accLevelIds: string;
}

// Body de POST /tasks/inactivate
export type InactivationTaskPayload = Pick<TaskForm, 'planification_id' | 'employee_id' | 'scheduled_at'>;

// Body de PATCH /tasks/:id; solo se envían los campos modificados que apliquen al tipo de tarea
export type UpdateTaskPayload = Partial<Pick<TaskForm, 'planification_id' | 'scheduled_at' | 'position_id' | 'auth_dept_id' | 'name' | 'lastName'> & {
    accLevelIds: string;
}>;

// Datos mínimos de la planificación para programar tareas dentro de su semana
export type TaskPlanificationRef = {
    id: string;
    start_date: string;
    end_date: string;
}
