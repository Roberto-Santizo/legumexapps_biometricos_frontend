import { FincaPositionsDatasourceImpl, FincaPositionsRepositoryImpl } from "@/features/finca-positions/infrastructure/infrastructure";
import { FincaPositionsProvider } from "./FincaPositionsProvider";
import api from "@/config/http/axios";

const datasource = new FincaPositionsDatasourceImpl(api);
const repository = new FincaPositionsRepositoryImpl(datasource);
export const fincaPositionsRepositoryProvider = new FincaPositionsProvider(repository);
