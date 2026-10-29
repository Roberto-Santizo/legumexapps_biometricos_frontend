import { DashboardEmployeesSchema, DashboardPositionsSchema, DashboardSummarySchema, DashboardTaskSummarySchema, DashboardTasksSchema, DashboardTransactionsSchema } from "@/features/dashboard/dashboard";
import type { z } from "zod";

export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;

export type DashboardEmployees = z.infer<typeof DashboardEmployeesSchema>;

export type DashboardPositions = z.infer<typeof DashboardPositionsSchema>;

export type DashboardTransactions = z.infer<typeof DashboardTransactionsSchema>;

export type DashboardTasks = z.infer<typeof DashboardTasksSchema>;

export type DashboardTaskSummary = z.infer<typeof DashboardTaskSummarySchema>;

// yyyy-MM-dd (UTC); sin valores el backend usa los últimos 30 días. El rango no puede superar 366 días
export type DashboardFilters = {
    start_date?: string;
    end_date?: string;
}
