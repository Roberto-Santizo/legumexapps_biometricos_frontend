import type { DashboardEmployees, DashboardFilters, DashboardPositions, DashboardRepository, DashboardSummary, DashboardTasks, DashboardTransactions } from "@/features/dashboard/dashboard";

export class DashboardProvider {
    constructor(private repository: DashboardRepository) { }

    getSummary(filters: DashboardFilters = {}): Promise<DashboardSummary> {
        return this.repository.getSummary(filters);
    }

    getEmployees(): Promise<DashboardEmployees> {
        return this.repository.getEmployees();
    }

    getPositions(): Promise<DashboardPositions> {
        return this.repository.getPositions();
    }

    getTransactions(filters: DashboardFilters = {}): Promise<DashboardTransactions> {
        return this.repository.getTransactions(filters);
    }

    getTasks(filters: DashboardFilters = {}): Promise<DashboardTasks> {
        return this.repository.getTasks(filters);
    }
}
