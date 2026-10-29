import { DashboardDatasourceImpl, DashboardRepositoryImpl } from "@/features/dashboard/infrastructure/infrastructure";
import { DashboardProvider } from "./DashboardProvider";
import api from "@/config/http/axios";

const datasource = new DashboardDatasourceImpl(api);
const repository = new DashboardRepositoryImpl(datasource);
export const dashboardRepositoryProvider = new DashboardProvider(repository);
