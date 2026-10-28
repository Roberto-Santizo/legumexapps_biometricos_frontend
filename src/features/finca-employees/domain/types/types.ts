import { FincaAreaSchema, FincaEmployeeAreaSchema, FincaEmployeeDetailSchema, FincaEmployeeSchema } from "@/features/finca-employees/finca-employees";
import type { z } from "zod";

export type FincaEmployee = z.infer<typeof FincaEmployeeSchema>;

export type FincaEmployeeDetail = z.infer<typeof FincaEmployeeDetailSchema>;

export type FincaEmployeeArea = z.infer<typeof FincaEmployeeAreaSchema>;

export type FincaArea = z.infer<typeof FincaAreaSchema>;

// Valores del formulario: los selects y radios entregan los IDs como texto
export type FincaEmployeeForm = {
    first_name: string;
    last_name: string;
    department: string;
    position: string;
    area: string;
}

// Body de POST /employees-finca; el código de empleado lo asigna el backend
export type FincaEmployeePayload = {
    first_name: string;
    last_name: string;
    department: number;
    position: number;
    area: number;
}

// Body de PATCH /employees-finca/:id; todos los campos son opcionales
export type UpdateFincaEmployeePayload = Partial<FincaEmployeePayload>;

export type AssignFincaAreaForm = {
    area_id: string;
}

export type AddFincaEmployeeAreaPayload = {
    employee_id: number;
    area_id: number;
}

export type FincaEmployeesFilters = {
    first_name?: string;
    last_name?: string;
    emp_code?: string;
    position_id?: string;
}
