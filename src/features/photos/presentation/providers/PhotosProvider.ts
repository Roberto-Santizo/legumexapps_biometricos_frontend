import type { PaginatedResponse } from "@/features/shared/shared";
import type { Photo, PhotosFilters, PhotosRepository, UploadPhotosResult } from "@/features/photos/photos";

export class PhotosProvider {
    constructor(private repository: PhotosRepository) { }

    getPhotos(page: number, limit: number, filters: PhotosFilters): Promise<PaginatedResponse<Photo>> {
        return this.repository.getPhotos(page, limit, filters);
    }

    createPhoto(code: string, file: File): Promise<string> {
        return this.repository.createPhoto(code, file);
    }

    uploadPhotos(files: File[], onProgress?: (percent: number) => void): Promise<UploadPhotosResult> {
        return this.repository.uploadPhotos(files, onProgress);
    }

    updatePhoto(id: string, file: File): Promise<string> {
        return this.repository.updatePhoto(id, file);
    }

    deletePhoto(id: string): Promise<string> {
        return this.repository.deletePhoto(id);
    }

    getPhotoUrl(key: string, version?: number): string {
        return this.repository.getPhotoUrl(key, version);
    }
}
