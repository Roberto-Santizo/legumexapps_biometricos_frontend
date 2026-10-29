import { z } from "zod";
import { TaskStatusSchema, TaskTypeSchema } from "@/features/tasks/tasks";

// GET /dashboard/summary: KPIs generales; el rango solo aplica a inactive_employees_in_range
export const DashboardSummarySchema = z.object({
    employees_total: z.number(),
    departments_total: z.number(),
    positions_total: z.number(),
    positions_occupied: z.number(),
    positions_vacant: z.number(),
    transactions_today: z.number(),
    employees_marked_today: z.number(),
    tasks_pending: z.number(),
    tasks_failed: z.number(),
    inactive_employees_in_range: z.number(),
    photos_total: z.number()
});

// GET /dashboard/employees: by_department incluye departamentos sin empleados, orden descendente
export const DashboardEmployeesSchema = z.object({
    total: z.number(),
    with_position: z.number(),
    without_position: z.number(),
    by_department: z.array(z.object({
        dept_id: z.string(),
        code: z.string(),
        name: z.string(),
        total: z.number()
    }))
});

// GET /dashboard/positions: vacant_list trae como máximo 50 posiciones
export const DashboardPositionsSchema = z.object({
    total: z.number(),
    occupied: z.number(),
    vacant: z.number(),
    vacant_list: z.array(z.object({
        id: z.string(),
        code: z.string(),
        name: z.string()
    }))
});

// GET /dashboard/transactions: daily solo incluye días con marcajes (yyyy-MM-dd, orden ascendente)
export const DashboardTransactionsSchema = z.object({
    start_date: z.string(),
    end_date: z.string(),
    total: z.number(),
    unique_employees: z.number(),
    daily: z.array(z.object({
        date: z.string(),
        total: z.number(),
        unique_employees: z.number()
    })),
    by_device: z.array(z.object({
        dev_alias: z.string().nullish().transform(alias => alias || 'Sin dispositivo'),
        total: z.number()
    })),
    by_department: z.array(z.object({
        dept_name: z.string().nullish().transform(name => name || 'Sin departamento'),
        total: z.number()
    }))
});

export const TaskStatusCountSchema = z.object({
    pendiente: z.number(),
    completada: z.number(),
    fallida: z.number()
});

export const DashboardTaskSummarySchema = z.object({
    id: z.string(),
    type: TaskTypeSchema,
    status: TaskStatusSchema,
    pin: z.coerce.string(),
    scheduled_at: z.string(),
    attempts: z.number(),
    last_error: z.string().nullish(),
    created_by: z.string()
});

// GET /dashboard/tasks: upcoming y recent_failed ignoran el rango (10 registros como máximo)
export const DashboardTasksSchema = z.object({
    start_date: z.string(),
    end_date: z.string(),
    by_status: TaskStatusCountSchema,
    by_type: z.array(TaskStatusCountSchema.extend({
        type: TaskTypeSchema,
        total: z.number()
    })),
    upcoming: z.array(DashboardTaskSummarySchema),
    recent_failed: z.array(DashboardTaskSummarySchema)
});
