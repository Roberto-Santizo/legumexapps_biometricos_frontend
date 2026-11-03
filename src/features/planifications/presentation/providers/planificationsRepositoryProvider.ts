import { PlanificationsDatasourceImpl, PlanificationsRepositoryImpl } from "@/features/planifications/infrastructure/infrastructure";
import { PlanificationsProvider } from "./PlanificationsProvider";
import api from "@/config/http/axios";

const datasource = new PlanificationsDatasourceImpl(api);
const repository = new PlanificationsRepositoryImpl(datasource);
export const planificationsRepositoryProvider = new PlanificationsProvider(repository);
