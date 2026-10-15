import { DepartmentSchema } from "@/features/departments/departments";
import type { z } from "zod";

export type Department = z.infer<typeof DepartmentSchema>;

export type DepartmentForm = Pick<Department, 'code' | 'name'>;

export type UpdateDepartmentForm = Partial<DepartmentForm>;

export type DepartmentsFilters = {
    name?: string;
    code?: string;
}
