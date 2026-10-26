import { FincaDepartmentsDatasourceImpl, FincaDepartmentsRepositoryImpl } from "@/features/finca-departments/infrastructure/infrastructure";
import { FincaDepartmentsProvider } from "./FincaDepartmentsProvider";
import api from "@/config/http/axios";

const datasource = new FincaDepartmentsDatasourceImpl(api);
const repository = new FincaDepartmentsRepositoryImpl(datasource);
export const fincaDepartmentsRepositoryProvider = new FincaDepartmentsProvider(repository);
