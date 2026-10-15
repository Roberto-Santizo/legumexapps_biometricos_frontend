import { InactiveEmployeesDatasourceImpl, InactiveEmployeesRepositoryImpl } from "@/features/inactive-employees/infrastructure/infrastructure";
import { InactiveEmployeesProvider } from "./InactiveEmployeesProvider";
import api from "@/config/http/axios";

const datasource = new InactiveEmployeesDatasourceImpl(api);
const repository = new InactiveEmployeesRepositoryImpl(datasource);
export const inactiveEmployeesRepositoryProvider = new InactiveEmployeesProvider(repository);
