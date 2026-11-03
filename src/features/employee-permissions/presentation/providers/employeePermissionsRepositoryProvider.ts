import { EmployeePermissionsDatasourceImpl, EmployeePermissionsRepositoryImpl } from "@/features/employee-permissions/infrastructure/infrastructure";
import { EmployeePermissionsProvider } from "./EmployeePermissionsProvider";
import api from "@/config/http/axios";

const datasource = new EmployeePermissionsDatasourceImpl(api);
const repository = new EmployeePermissionsRepositoryImpl(datasource);
export const employeePermissionsRepositoryProvider = new EmployeePermissionsProvider(repository);
