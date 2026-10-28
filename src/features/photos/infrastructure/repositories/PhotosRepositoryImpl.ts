import type { PaginatedResponse } from '@/features/shared/shared';
import { PhotosDatasource, PhotosRepository, type Photo, type PhotosFilters, type UploadPhotosResult } from '@/features/photos/photos';

export class PhotosRepositoryImpl implements PhotosRepository {
    constructor(private datasource: PhotosDatasource) { }

    getPhotos(page: number, limit: number, filters: PhotosFilters): Promise<PaginatedResponse<Photo>> {
        return this.datasource.getPhotos(page, limit, filters);
    }

    createPhoto(code: string, file: File): Promise<string> {
        return this.datasource.createPhoto(code, file);
    }

    uploadPhotos(files: File[], onProgress?: (percent: number) => void): Promise<UploadPhotosResult> {
        return this.datasource.uploadPhotos(files, onProgress);
    }

    updatePhoto(id: string, file: File): Promise<string> {
        return this.datasource.updatePhoto(id, file);
    }

    deletePhoto(id: string): Promise<string> {
        return this.datasource.deletePhoto(id);
    }

    getPhotoUrl(key: string, version?: number): string {
        return this.datasource.getPhotoUrl(key, version);
    }
}
