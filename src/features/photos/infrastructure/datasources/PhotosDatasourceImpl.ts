import { getApiErrorMessage, setQueryParams, type PaginatedResponse } from '@/features/shared/shared';
import { type AxiosInstance } from 'axios';
import { PhotosDatasource, PhotosSchema, UploadPhotosResultSchema, type Photo, type PhotosFilters, type UploadPhotosResult } from '@/features/photos/photos';

// Las acciones de /photos responden con el mensaje de confirmación en texto plano (o cuerpo vacío)
const toMessage = (data: unknown, fallback: string) => typeof data === 'string' && data ? data : fallback;

export class PhotosDatasourceImpl implements PhotosDatasource {
    constructor(private api: AxiosInstance) { }

    // GET /photos es público; `code` filtra por búsqueda parcial
    async getPhotos(page: number, limit: number, filters: PhotosFilters): Promise<PaginatedResponse<Photo>> {
        try {
            const params = setQueryParams({ limit, offset: page * limit, ...filters });
            const url = `/photos?${params.toString()}`;
            const { data } = await this.api.get(url);
            const response = PhotosSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // POST /photos (multipart, campos `code` y `file`); responde 201 sin cuerpo
    async createPhoto(code: string, file: File): Promise<string> {
        try {
            const formData = new FormData();
            formData.append('code', code);
            formData.append('file', file);
            const { data } = await this.api.post('/photos', formData);
            return toMessage(data, 'Foto creada correctamente');
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // POST /photos/uploadFiles (multipart, hasta 100 imágenes en el campo `files`); cada archivo se guarda como <NOMBRE>.jpg
    async uploadPhotos(files: File[], onProgress?: (percent: number) => void): Promise<UploadPhotosResult> {
        try {
            const formData = new FormData();
            files.forEach(file => formData.append('files', file));
            const { data } = await this.api.post('/photos/uploadFiles', formData, {
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

    // PATCH /photos/:id (multipart, campo `file`) reemplaza la imagen de la foto
    async updatePhoto(id: string, file: File): Promise<string> {
        try {
            const url = `/photos/${id}`;
            const formData = new FormData();
            formData.append('file', file);
            const { data } = await this.api.patch(url, formData);
            return toMessage(data, 'Foto actualizada correctamente');
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // DELETE /photos/:id elimina la imagen y el registro
    async deletePhoto(id: string): Promise<string> {
        try {
            const url = `/photos/${id}`;
            const { data } = await this.api.delete(url);
            return toMessage(data, 'Foto eliminada correctamente');
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // GET /photos/:key es público, así que la imagen se pide directo desde <img>; `key` incluye la extensión
    getPhotoUrl(key: string, version?: number): string {
        const url = this.api.getUri({ url: `/photos/${encodeURIComponent(key)}` });
        return version ? `${url}?v=${version}` : url;
    }
}
