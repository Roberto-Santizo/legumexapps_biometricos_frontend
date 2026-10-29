import { getApiErrorMessage, setQueryParams } from '@/features/shared/shared';
import { type AxiosInstance } from 'axios';
import type { z } from 'zod';
import { DashboardDatasource, DashboardEmployeesSchema, DashboardPositionsSchema, DashboardSummarySchema, DashboardTasksSchema, DashboardTransactionsSchema, type DashboardEmployees, type DashboardFilters, type DashboardPositions, type DashboardSummary, type DashboardTasks, type DashboardTransactions } from '@/features/dashboard/dashboard';

export class DashboardDatasourceImpl implements DashboardDatasource {
    constructor(private api: AxiosInstance) { }

    getSummary(filters: DashboardFilters): Promise<DashboardSummary> {
        return this.get('/dashboard/summary', DashboardSummarySchema, filters);
    }

    getEmployees(): Promise<DashboardEmployees> {
        return this.get('/dashboard/employees', DashboardEmployeesSchema);
    }

    getPositions(): Promise<DashboardPositions> {
        return this.get('/dashboard/positions', DashboardPositionsSchema);
    }

    getTransactions(filters: DashboardFilters): Promise<DashboardTransactions> {
        return this.get('/dashboard/transactions', DashboardTransactionsSchema, filters);
    }

    getTasks(filters: DashboardFilters): Promise<DashboardTasks> {
        return this.get('/dashboard/tasks', DashboardTasksSchema, filters);
    }

    // Todos los endpoints del dashboard son GET de solo lectura con la misma validación y manejo de errores
    private async get<T extends z.ZodType>(path: string, schema: T, filters: DashboardFilters = {}): Promise<z.infer<T>> {
        try {
            const params = setQueryParams(filters);
            const url = params.size ? `${path}?${params.toString()}` : path;
            const { data } = await this.api.get(url);
            const response = schema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }
}
