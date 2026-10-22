import { PhotosDatasourceImpl, PhotosRepositoryImpl } from "@/features/photos/infrastructure/infrastructure";
import { PhotosProvider } from "./PhotosProvider";
import api from "@/config/http/axios";

const datasource = new PhotosDatasourceImpl(api);
const repository = new PhotosRepositoryImpl(datasource);
export const photosRepositoryProvider = new PhotosProvider(repository);
