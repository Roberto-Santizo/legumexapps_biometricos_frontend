import { BufferResponseSchema, getApiErrorMessage, setQueryParams, type BufferResponse, type PaginatedResponse } from '@/features/shared/shared';
import { type AxiosInstance } from 'axios';
import { EmployeeTransactionListSchema, EmployeeTransactionsDatasource, type EmployeeTransaction, type EmployeeTransactionsFilters, type TransactionsReportPayload } from '@/features/employee-transactions/employee-transactions';

export class EmployeeTransactionsDatasourceImpl implements EmployeeTransactionsDatasource {
    constructor(private api: AxiosInstance) { }

    async getEmployeeTransactions(page: number, limit: number, filters: EmployeeTransactionsFilters): Promise<PaginatedResponse<EmployeeTransaction>> {
        try {
            const params = setQueryParams({ limit, offset: page * limit, ...filters });
            const url = `/employee-transactions?${params.toString()}`;
            const { data } = await this.api.get(url);
            const response = EmployeeTransactionListSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // POST /employee-transactions/report devuelve el Excel como Buffer serializado en JSON
    async generateTransactionsReport(payload: TransactionsReportPayload): Promise<BufferResponse> {
        try {
            const url = `/employee-transactions/report`;
            const { data } = await this.api.post(url, payload);
            const response = BufferResponseSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Archivo no válido");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }
}
