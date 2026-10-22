import type { PhotoOrigin } from "@/features/photos/photos";

// Formatos que acepta el backend (jpg, jpeg, png o gif)
export const PHOTO_ACCEPT = ['image/jpeg', 'image/png', 'image/gif'];
const PHOTO_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif'];

// Límite de archivos por carga en POST /photos
export const MAX_PHOTOS_PER_UPLOAD = 100;

// Algunos navegadores no informan el MIME, así que también se revisa la extensión
export const isPhotoFile = (file: File) => PHOTO_ACCEPT.includes(file.type) || PHOTO_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext));

// El backend guarda cada archivo como <NOMBRE_SIN_EXTENSIÓN_EN_MAYÚSCULAS>.jpg
export const toPhotoKey = (value: string) => value.trim().replace(/\.[^.]+$/, '').toUpperCase();

// Separa lo escrito en el buscador ("10045, 10046 10047") en claves únicas
export const parsePhotoKeys = (value: string) => [...new Set(value.split(/[\s,;]+/).map(toPhotoKey).filter(Boolean))];

export const formatPhotoSize = (bytes: number) => bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

export const photoOriginLabels: Record<PhotoOrigin, string> = {
    subida: 'Subida',
    consulta: 'Consultada',
    reemplazo: 'Reemplazada'
};
