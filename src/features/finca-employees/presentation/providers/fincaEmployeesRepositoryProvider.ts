import { FincaEmployeesDatasourceImpl, FincaEmployeesRepositoryImpl } from "@/features/finca-employees/infrastructure/infrastructure";
import { FincaEmployeesProvider } from "./FincaEmployeesProvider";
import api from "@/config/http/axios";

const datasource = new FincaEmployeesDatasourceImpl(api);
const repository = new FincaEmployeesRepositoryImpl(datasource);
export const fincaEmployeesRepositoryProvider = new FincaEmployeesProvider(repository);
