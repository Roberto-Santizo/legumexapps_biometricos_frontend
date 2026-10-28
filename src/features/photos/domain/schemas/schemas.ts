import { z } from "zod";
import { PaginatedResponseSchema } from "@/features/shared/shared";

// POST /photos/uploadFiles responde el resultado de la carga; `errors` lista los archivos que no se pudieron guardar
export const UploadPhotosResultSchema = z.object({
    message: z.string(),
    errors: z.array(z.string()).default([])
});

// Usuario que registró la foto; el backend envía más campos, solo se conservan los que se muestran
export const PhotoCreatorSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string()
});

// `url` es el nombre del archivo en el almacenamiento (<CÓDIGO>.jpg) y la clave para GET /photos/:key
export const PhotoSchema = z.object({
    id: z.string(),
    code: z.string(),
    url: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    created_by: PhotoCreatorSchema
});

export const PhotosSchema = PaginatedResponseSchema(PhotoSchema);
