import { EmployeePermissionSchema, PermissionSignerSchema, PermissionSignaturesSchema, PermissionTypeSchema, SalaryStatusSchema } from "@/features/employee-permissions/employee-permissions";
import type { z } from "zod";

export type EmployeePermission = z.infer<typeof EmployeePermissionSchema>;

export type PermissionType = z.infer<typeof PermissionTypeSchema>;

export type SalaryStatus = z.infer<typeof SalaryStatusSchema>;

export type PermissionSigner = z.infer<typeof PermissionSignerSchema>;

export type PermissionSignatures = z.infer<typeof PermissionSignaturesSchema>;

// Valores del formulario de creación; las firmas se capturan como PNG (máx. 1 MB)
export type EmployeePermissionForm = {
    employee_pin: string;
    date: string;
    type: PermissionType | '';
    reason: string;
    salary_status: SalaryStatus | '';
    shift_start: string;
    shift_end: string;
    // Opcional: si se indica comodín, su firma es obligatoria
    substitute_pin: string;
    employee_signature: File | null;
    substitute_signature: File | null;
    supervisor_signature: File | null;
    floor_auditor_signature: File | null;
}

// Body multipart de POST /permissions
export type EmployeePermissionPayload = {
    employee_pin: string;
    date: string;
    type: PermissionType;
    reason: string;
    salary_status: SalaryStatus;
    shift_start: string;
    shift_end: string;
    substitute_pin?: string;
    employee_signature: File;
    substitute_signature?: File;
    supervisor_signature: File;
    floor_auditor_signature: File;
}

// Body JSON de PATCH /permissions/:id; el backend rechaza employee_pin, substitute_pin y archivos
export type UpdateEmployeePermissionForm = {
    date: string;
    type: PermissionType;
    reason: string;
    salary_status: SalaryStatus;
    shift_start: string;
    shift_end: string;
}

export type EmployeePermissionsFilters = {
    employee_pin?: string;
    employee_name?: string;
    substitute_pin?: string;
    folio?: string;
    // 'YYYY-MM-DD' o rango 'desde,hasta'
    date?: string;
    type?: string;
    salary_status?: string;
    // 'true' | 'false'
    hr_signed?: string;
}
