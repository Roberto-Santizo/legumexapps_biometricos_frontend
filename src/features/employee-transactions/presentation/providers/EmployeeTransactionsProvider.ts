import type { BufferResponse, PaginatedResponse } from "@/features/shared/shared";
import type { EmployeeTransaction, EmployeeTransactionsFilters, EmployeeTransactionsRepository, TransactionsReportPayload } from "@/features/employee-transactions/employee-transactions";

export class EmployeeTransactionsProvider {
    constructor(private repository: EmployeeTransactionsRepository) { }

    getEmployeeTransactions(page: number, limit: number, filters: EmployeeTransactionsFilters = {}): Promise<PaginatedResponse<EmployeeTransaction>> {
        return this.repository.getEmployeeTransactions(page, limit, filters);
    }

    generateTransactionsReport(payload: TransactionsReportPayload): Promise<BufferResponse> {
        return this.repository.generateTransactionsReport(payload);
    }
}
