import { PhotoSchema, UploadPhotosResultSchema } from "@/features/photos/photos";
import type { z } from "zod";

export type UploadPhotosResult = z.infer<typeof UploadPhotosResultSchema>;

export type Photo = z.infer<typeof PhotoSchema>;

export type PhotosFilters = {
    code?: string;
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
