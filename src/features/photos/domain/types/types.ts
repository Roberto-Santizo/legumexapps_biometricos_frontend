import { UploadPhotosResultSchema } from "@/features/photos/photos";
import type { z } from "zod";

export type UploadPhotosResult = z.infer<typeof UploadPhotosResultSchema>;

// Cómo llegó la foto a la sesión: subida en lote, consultada por PIN o reemplazada desde su marco
export type PhotoOrigin = 'subida' | 'consulta' | 'reemplazo';

// Foto que el usuario tocó en esta sesión; el backend no tiene listado, así que se recuerda en el navegador
export type SessionPhoto = {
    key: string;
    origin: PhotoOrigin;
    // marca de tiempo; también rompe la caché de la imagen tras reemplazarla o eliminarla
    version: number;
}

// Archivo preparado en la mesa de carga, antes de enviarlo
export type StagedPhoto = {
    id: string;
    file: File;
    previewUrl: string;
    key: string;
    // error que reportó el backend para este archivo en la última carga
    error?: string;
}
