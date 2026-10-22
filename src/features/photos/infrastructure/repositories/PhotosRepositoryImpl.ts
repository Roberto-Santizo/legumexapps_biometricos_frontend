import { PhotosDatasource, PhotosRepository, type UploadPhotosResult } from '@/features/photos/photos';

export class PhotosRepositoryImpl implements PhotosRepository {
    constructor(private datasource: PhotosDatasource) { }

    uploadPhotos(files: File[], onProgress?: (percent: number) => void): Promise<UploadPhotosResult> {
        return this.datasource.uploadPhotos(files, onProgress);
    }

    updatePhoto(key: string, file: File): Promise<string> {
        return this.datasource.updatePhoto(key, file);
    }

    deletePhoto(key: string): Promise<string> {
        return this.datasource.deletePhoto(key);
    }

    getPhotoUrl(key: string, version?: number): string {
        return this.datasource.getPhotoUrl(key, version);
    }
}
