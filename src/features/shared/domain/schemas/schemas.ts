import z from "zod";

export const ApiResponseSchema = z.object({
    statusCode: z.number(),
    message: z.string(),

});

// Los métodos index (GET con limit/offset) devuelven los registros en `data` junto con los metadatos de paginación
export const PaginatedResponseSchema = <T extends z.ZodType>(item: T) => z.object({
    data: z.array(item),
    total: z.number(),
    totalPages: z.number(),
    currentPage: z.number()
});

export const FileResponseSchema = z.object({
    file: z.base64(),
    fileName: z.string()
});