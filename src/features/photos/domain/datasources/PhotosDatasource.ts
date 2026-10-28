import type { PaginatedResponse } from "@/features/shared/shared";
import type { Photo, PhotosFilters, UploadPhotosResult } from "@/features/photos/photos";

export abstract class PhotosDatasource {
    abstract getPhotos(page: number, limit: number, filters: PhotosFilters): Promise<PaginatedResponse<Photo>>;
    abstract createPhoto(code: string, file: File): Promise<string>;
    abstract uploadPhotos(files: File[], onProgress?: (percent: number) => void): Promise<UploadPhotosResult>;
    abstract updatePhoto(id: string, file: File): Promise<string>;
    abstract deletePhoto(id: string): Promise<string>;
    abstract getPhotoUrl(key: string, version?: number): string;
}
