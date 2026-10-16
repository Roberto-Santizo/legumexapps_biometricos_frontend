import { EmployeeLevelSchema, EmployeeListItemSchema } from "@/features/employees/employees";
import type { z } from "zod";

export type Employee = z.infer<typeof EmployeeListItemSchema>;

export type EmployeeListItem = z.infer<typeof EmployeeListItemSchema>;

export type EmployeeLevel = z.infer<typeof EmployeeLevelSchema>;

// Valores del formulario: los niveles llegan como arreglo (checkboxes) o como un solo ID (radios en edición); las fechas vienen de inputs datetime-local
export type EmployeeForm = {
    name: string;
    lastName: string;
    pin: string;
    deptCode: string;
    accLevelIds: string[] | string;
    accStartTime: string;
    accEndTime: string;
    // Fotografía del empleado (jpg, jpeg, png o gif); requerida al crear
    file: File | null;
}

// Body multipart de POST /employees (crea o actualiza si el PIN ya existe)
export type EmployeePayload = {
    name: string;
    lastName: string;
    pin: string;
    deptCode: string;
    accLevelIds: string;
    accStartTime?: string;
    accEndTime?: string;
    file?: File;
}

export type EmployeesFilters = {
    name?: string;
}
