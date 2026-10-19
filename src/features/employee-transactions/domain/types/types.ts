import { EmployeeTransactionSchema } from "@/features/employee-transactions/employee-transactions";
import type { z } from "zod";

export type EmployeeTransaction = z.infer<typeof EmployeeTransactionSchema>;

// last_name guarda la posición del empleado en ZKBioAccess; event_time acepta 'YYYY-MM-DD', 'desde,hasta' o fecha ISO completa; el resto son búsquedas parciales
export type EmployeeTransactionsFilters = {
    pin?: string;
    name?: string;
    last_name?: string;
    dept_code?: string;
    dept_name?: string;
    event_time?: string;
}

// Body de POST /employee-transactions/report; el rango no puede superar una semana
export type TransactionsReportPayload = {
    start_date: string;
    end_date: string;
}
