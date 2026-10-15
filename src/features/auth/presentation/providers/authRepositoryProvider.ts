import { AuthDatasourceImpl, AuthRepositoryImpl } from "@/features/auth/infrastructure/infrastructure";
import { AuthProvider } from "./AuthProvider";
import api from "@/config/http/axios";

const datasource = new AuthDatasourceImpl(api);
const repository = new AuthRepositoryImpl(datasource);
export const authRepositoryProvider = new AuthProvider(repository);