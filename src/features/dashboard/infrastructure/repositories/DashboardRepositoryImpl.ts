import { DashboardDatasource, DashboardRepository, type DashboardEmployees, type DashboardFilters, type DashboardPositions, type DashboardSummary, type DashboardTasks, type DashboardTransactions } from '@/features/dashboard/dashboard';

export class DashboardRepositoryImpl implements DashboardRepository {
    constructor(private datasource: DashboardDatasource) { }

    getSummary(filters: DashboardFilters): Promise<DashboardSummary> {
        return this.datasource.getSummary(filters);
    }

    getEmployees(): Promise<DashboardEmployees> {
        return this.datasource.getEmployees();
    }

    getPositions(): Promise<DashboardPositions> {
        return this.datasource.getPositions();
    }

    getTransactions(filters: DashboardFilters): Promise<DashboardTransactions> {
        return this.datasource.getTransactions(filters);
    }

    getTasks(filters: DashboardFilters): Promise<DashboardTasks> {
        return this.datasource.getTasks(filters);
    }
}
