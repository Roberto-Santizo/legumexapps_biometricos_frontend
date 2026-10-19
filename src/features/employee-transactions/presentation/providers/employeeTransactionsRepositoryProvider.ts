import { EmployeeTransactionsDatasourceImpl, EmployeeTransactionsRepositoryImpl } from "@/features/employee-transactions/infrastructure/infrastructure";
import { EmployeeTransactionsProvider } from "./EmployeeTransactionsProvider";
import api from "@/config/http/axios";

const datasource = new EmployeeTransactionsDatasourceImpl(api);
const repository = new EmployeeTransactionsRepositoryImpl(datasource);
export const employeeTransactionsRepositoryProvider = new EmployeeTransactionsProvider(repository);
