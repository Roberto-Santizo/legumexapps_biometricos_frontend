import { UsersDatasourceImpl, UsersRepositoryImpl } from "@/features/users/infrastructure/infrastructure";
import { UsersProvider } from "./UsersProvider";
import api from "@/config/http/axios";

const datasource = new UsersDatasourceImpl(api);
const repository = new UsersRepositoryImpl(datasource);
export const usersRepositoryProvider = new UsersProvider(repository);
