import { AccessLevelsDatasourceImpl, AccessLevelsRepositoryImpl } from "@/features/access-levels/infrastructure/infrastructure";
import { AccessLevelsProvider } from "./AccessLevelsProvider";
import api from "@/config/http/axios";

const datasource = new AccessLevelsDatasourceImpl(api);
const repository = new AccessLevelsRepositoryImpl(datasource);
export const accessLevelsRepositoryProvider = new AccessLevelsProvider(repository);
