import { TasksDatasourceImpl, TasksRepositoryImpl } from "@/features/tasks/infrastructure/infrastructure";
import { TasksProvider } from "./TasksProvider";
import api from "@/config/http/axios";

const datasource = new TasksDatasourceImpl(api);
const repository = new TasksRepositoryImpl(datasource);
export const tasksRepositoryProvider = new TasksProvider(repository);
