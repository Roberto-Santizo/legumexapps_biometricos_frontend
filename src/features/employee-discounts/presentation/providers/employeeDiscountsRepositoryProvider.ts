import { EmployeeDiscountsDatasourceImpl, EmployeeDiscountsRepositoryImpl } from "@/features/employee-discounts/infrastructure/infrastructure";
import { EmployeeDiscountsProvider } from "./EmployeeDiscountsProvider";
import api from "@/config/http/axios";

const datasource = new EmployeeDiscountsDatasourceImpl(api);
const repository = new EmployeeDiscountsRepositoryImpl(datasource);
export const employeeDiscountsRepositoryProvider = new EmployeeDiscountsProvider(repository);
