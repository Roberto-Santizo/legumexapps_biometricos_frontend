import type { DashboardEmployees, DashboardFilters, DashboardPositions, DashboardSummary, DashboardTasks, DashboardTransactions } from "@/features/dashboard/dashboard";

export abstract class DashboardRepository {
    abstract getSummary(filters: DashboardFilters): Promise<DashboardSummary>;
    abstract getEmployees(): Promise<DashboardEmployees>;
    abstract getPositions(): Promise<DashboardPositions>;
    abstract getTransactions(filters: DashboardFilters): Promise<DashboardTransactions>;
    abstract getTasks(filters: DashboardFilters): Promise<DashboardTasks>;
}
