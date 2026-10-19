import { FileResponseSchema } from '@/features/shared/shared';
import z from 'zod';

export type Option = {
    label: string;
    value: number | string;
};

export type FileForm = {
    file: File
}

export type DynamicFormValues = Record<string, number | string>;
export type FileResponse = z.infer<typeof FileResponseSchema>;

export type PaginatedResponse<T> = {
    data: T[];
    total: number;
    totalPages: number;
    currentPage: number;
};