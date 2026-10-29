import { PositionsDatasourceImpl, PositionsRepositoryImpl } from "@/features/positions/infrastructure/infrastructure";
import { PositionsProvider } from "./PositionsProvider";
import api from "@/config/http/axios";

const datasource = new PositionsDatasourceImpl(api);
const repository = new PositionsRepositoryImpl(datasource);
export const positionsRepositoryProvider = new PositionsProvider(repository);
