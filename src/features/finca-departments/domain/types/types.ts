import { FincaDepartmentSchema } from "@/features/finca-departments/finca-departments";
import type { z } from "zod";

export type FincaDepartment = z.infer<typeof FincaDepartmentSchema>;

export type FincaDepartmentForm = Pick<FincaDepartment, 'dept_code' | 'dept_name'>;

export type UpdateFincaDepartmentForm = Partial<FincaDepartmentForm>;

export type FincaDepartmentsFilters = {
    dept_name?: string;
}
