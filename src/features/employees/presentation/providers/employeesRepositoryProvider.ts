import { EmployeesDatasourceImpl, EmployeesRepositoryImpl } from "@/features/employees/infrastructure/infrastructure";
import { EmployeesProvider } from "./EmployeesProvider";
import api from "@/config/http/axios";

const datasource = new EmployeesDatasourceImpl(api);
const repository = new EmployeesRepositoryImpl(datasource);
export const employeesRepositoryProvider = new EmployeesProvider(repository);
