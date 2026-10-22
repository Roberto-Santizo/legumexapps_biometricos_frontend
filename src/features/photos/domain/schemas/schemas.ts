import { z } from "zod";

// POST /photos responde el resultado de la carga; `errors` lista los archivos que no se pudieron guardar
export const UploadPhotosResultSchema = z.object({
    message: z.string(),
    errors: z.array(z.string()).default([])
});
