import type { PhotosRepository, UploadPhotosResult } from "@/features/photos/photos";

export class PhotosProvider {
    constructor(private repository: PhotosRepository) { }

    uploadPhotos(files: File[], onProgress?: (percent: number) => void): Promise<UploadPhotosResult> {
        return this.repository.uploadPhotos(files, onProgress);
    }

    updatePhoto(key: string, file: File): Promise<string> {
        return this.repository.updatePhoto(key, file);
    }

    deletePhoto(key: string): Promise<string> {
        return this.repository.deletePhoto(key);
    }

    getPhotoUrl(key: string, version?: number): string {
        return this.repository.getPhotoUrl(key, version);
    }
}
