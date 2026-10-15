import { EmployeeLevelSchema, EmployeeListItemSchema, EmployeeSchema } from "@/features/employees/employees";
import type { z } from "zod";

export type Employee = z.infer<typeof EmployeeSchema>;

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
}

// Body de POST /employees (crea o actualiza si el PIN ya existe)
export type EmployeePayload = {
    name: string;
    lastName: string;
    pin: string;
    deptCode: string;
    accLevelIds: string;
    accStartTime?: string;
    accEndTime?: string;
}

export type EmployeesFilters = {
    name?: string;
}
