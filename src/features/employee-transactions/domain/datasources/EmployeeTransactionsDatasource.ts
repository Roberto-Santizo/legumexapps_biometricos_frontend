import type { BufferResponse, PaginatedResponse } from "@/features/shared/shared";
import type { EmployeeTransaction, EmployeeTransactionsFilters, TransactionsReportPayload } from "@/features/employee-transactions/employee-transactions";

export abstract class EmployeeTransactionsDatasource {
    abstract getEmployeeTransactions(page: number, limit: number, filters: EmployeeTransactionsFilters): Promise<PaginatedResponse<EmployeeTransaction>>;
    abstract generateTransactionsReport(payload: TransactionsReportPayload): Promise<BufferResponse>;
}
