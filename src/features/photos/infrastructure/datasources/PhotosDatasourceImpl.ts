import { getApiErrorMessage } from '@/features/shared/shared';
import { type AxiosInstance } from 'axios';
import { PhotosDatasource, UploadPhotosResultSchema, type UploadPhotosResult } from '@/features/photos/photos';

export class PhotosDatasourceImpl implements PhotosDatasource {
    constructor(private api: AxiosInstance) { }

    // POST /photos (multipart, hasta 100 imágenes en el campo `files`); cada archivo se guarda como <NOMBRE>.jpg
    async uploadPhotos(files: File[], onProgress?: (percent: number) => void): Promise<UploadPhotosResult> {
        try {
            const formData = new FormData();
            files.forEach(file => formData.append('files', file));
            const { data } = await this.api.post('/photos', formData, {
                onUploadProgress: (event) => {
                    if (onProgress && event.total) onProgress(Math.round((event.loaded / event.total) * 100));
                }
            });
            const response = UploadPhotosResultSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // PATCH /photos/:key (multipart, campo `file`) reemplaza o crea <key>.jpg; responde un mensaje de texto
    async updatePhoto(key: string, file: File): Promise<string> {
        try {
            const url = `/photos/${encodeURIComponent(key)}`;
            const formData = new FormData();
            formData.append('file', file);
            const { data } = await this.api.patch(url, formData);
            return typeof data === 'string' && data ? data : 'Foto actualizada correctamente';
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // DELETE /photos/:key elimina <key>.jpg; responde un mensaje de texto
    async deletePhoto(key: string): Promise<string> {
        try {
            const url = `/photos/${encodeURIComponent(key)}`;
            const { data } = await this.api.delete(url);
            return typeof data === 'string' && data ? data : 'Foto eliminada correctamente';
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // GET /photos/:key.jpg es público, así que la imagen se pide directo desde <img>
    getPhotoUrl(key: string, version?: number): string {
        const url = this.api.getUri({ url: `/photos/${encodeURIComponent(key)}.jpg` });
        return version ? `${url}?v=${version}` : url;
    }
}
