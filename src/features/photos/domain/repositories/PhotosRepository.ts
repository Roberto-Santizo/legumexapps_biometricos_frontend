import type { UploadPhotosResult } from "@/features/photos/photos";

export abstract class PhotosRepository {
    abstract uploadPhotos(files: File[], onProgress?: (percent: number) => void): Promise<UploadPhotosResult>;
    abstract updatePhoto(key: string, file: File): Promise<string>;
    abstract deletePhoto(key: string): Promise<string>;
    abstract getPhotoUrl(key: string, version?: number): string;
}
