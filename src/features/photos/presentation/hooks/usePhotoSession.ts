import { useEffect, useState } from "react";
import type { PhotoOrigin, SessionPhoto } from "@/features/photos/photos";

const STORAGE_KEY = 'PHOTOS_SESSION';
const MAX_SESSION_PHOTOS = 200;

// localStorage puede no estar disponible (modo privado, datos bloqueados); la sesión arranca vacía en ese caso
const readSession = (): SessionPhoto[] => {
    try {
        const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((item): item is SessionPhoto => typeof item?.key === 'string' && typeof item?.version === 'number');
    } catch {
        return [];
    }
}

// Fotos que el usuario subió, consultó o reemplazó; el backend no ofrece un listado
export function usePhotoSession() {
    const [photos, setPhotos] = useState<SessionPhoto[]>(readSession);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
        } catch {
            // sin almacenamiento la sesión vive solo mientras la pantalla esté abierta
        }
    }, [photos]);

    // agrega las claves al inicio; si ya estaban, las mueve arriba con la nueva versión
    const add = (keys: string[], origin: PhotoOrigin) => {
        const version = Date.now();
        setPhotos(prev => [
            ...keys.map(key => ({ key, origin, version })),
            ...prev.filter(photo => !keys.includes(photo.key))
        ].slice(0, MAX_SESSION_PHOTOS));
    };

    // vuelve a pedir la imagen sin moverla de lugar (tras reemplazarla o eliminarla)
    const refresh = (key: string, origin?: PhotoOrigin) => {
        setPhotos(prev => prev.map(photo => photo.key === key
            ? { ...photo, origin: origin ?? photo.origin, version: Date.now() }
            : photo));
    };

    const remove = (key: string) => setPhotos(prev => prev.filter(photo => photo.key !== key));

    const clear = () => setPhotos([]);

    return { photos, add, refresh, remove, clear };
}
