import { DepartmentsDatasourceImpl, DepartmentsRepositoryImpl } from "@/features/departments/infrastructure/infrastructure";
import { DepartmentsProvider } from "./DepartmentsProvider";
import api from "@/config/http/axios";

const datasource = new DepartmentsDatasourceImpl(api);
const repository = new DepartmentsRepositoryImpl(datasource);
export const departmentsRepositoryProvider = new DepartmentsProvider(repository);
