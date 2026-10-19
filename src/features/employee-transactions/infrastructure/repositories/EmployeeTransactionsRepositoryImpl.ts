import type { BufferResponse, PaginatedResponse } from "@/features/shared/shared";
import { EmployeeTransactionsDatasource, EmployeeTransactionsRepository, type EmployeeTransaction, type EmployeeTransactionsFilters, type TransactionsReportPayload } from '@/features/employee-transactions/employee-transactions';

export class EmployeeTransactionsRepositoryImpl implements EmployeeTransactionsRepository {
    constructor(private datasource: EmployeeTransactionsDatasource) { }

    getEmployeeTransactions(page: number, limit: number, filters: EmployeeTransactionsFilters): Promise<PaginatedResponse<EmployeeTransaction>> {
        return this.datasource.getEmployeeTransactions(page, limit, filters);
    }

    generateTransactionsReport(payload: TransactionsReportPayload): Promise<BufferResponse> {
        return this.datasource.generateTransactionsReport(payload);
    }
}
