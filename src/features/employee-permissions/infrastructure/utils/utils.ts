import type { EmployeePermission, EmployeePermissionForm, EmployeePermissionPayload, PermissionSigner, PermissionType, SalaryStatus, UpdateEmployeePermissionForm } from "@/features/employee-permissions/employee-permissions";

export const permissionTypeLabels: Record<PermissionType, string> = {
    enfermedad: 'Enfermedad',
    personal: 'Personal',
    igss: 'IGSS',
    duelo: 'Duelo',
    otro: 'Otro'
};

export const salaryStatusLabels: Record<SalaryStatus, string> = {
    con_goce: 'Con goce de salario',
    sin_goce: 'Sin goce de salario',
    falta_injustificada: 'Falta injustificada'
};

export const signerLabels: Record<PermissionSigner, string> = {
    employee: 'Trabajador',
    substitute: 'Comodín',
    supervisor: 'Jefe o supervisor de línea',
    floor_auditor: 'Auditor de piso',
    hr: 'Vo.Bo. Recursos Humanos'
};

export const permissionTypeOptions = Object.entries(permissionTypeLabels).map(([value, label]) => ({ value, label }));

export const salaryStatusOptions = Object.entries(salaryStatusLabels).map(([value, label]) => ({ value, label }));

// El backend exige que la firma sea PNG y no supere 1 MB
export const SIGNATURE_MAX_SIZE_MB = 1;

// date llega como "YYYY-MM-DD"; se formatea sin pasar por Date para no correr el día por zona horaria
export const formatPermissionDate = (value: string) => {
    const [year, month, day] = value.slice(0, 10).split('-');
    return `${day}/${month}/${year}`;
}

// La firma del comodín solo aplica cuando el permiso tiene comodín
export const permissionSigners = (permission: EmployeePermission): PermissionSigner[] =>
    (['employee', 'substitute', 'supervisor', 'floor_auditor', 'hr'] as PermissionSigner[])
        .filter(signer => signer !== 'substitute' || permission.substitute);

export const toPermissionPayload = (form: EmployeePermissionForm): EmployeePermissionPayload => {
    const substitutePin = form.substitute_pin.trim();

    return {
        employee_pin: form.employee_pin.trim(),
        date: form.date,
        type: form.type as PermissionType,
        reason: form.reason.trim(),
        salary_status: form.salary_status as SalaryStatus,
        shift_start: form.shift_start,
        shift_end: form.shift_end,
        // substitute_pin y substitute_signature van juntos o no van
        substitute_pin: substitutePin || undefined,
        substitute_signature: substitutePin ? form.substitute_signature ?? undefined : undefined,
        employee_signature: form.employee_signature!,
        supervisor_signature: form.supervisor_signature!,
        floor_auditor_signature: form.floor_auditor_signature!
    };
}

export const toUpdatePermissionForm = (permission: EmployeePermission): UpdateEmployeePermissionForm => ({
    date: permission.date.slice(0, 10),
    type: permission.type,
    reason: permission.reason,
    salary_status: permission.salary_status,
    shift_start: permission.shift_start,
    shift_end: permission.shift_end
});

export const emptyPermissionForm: EmployeePermissionForm = {
    employee_pin: '',
    date: '',
    type: '',
    reason: '',
    salary_status: '',
    shift_start: '',
    shift_end: '',
    substitute_pin: '',
    employee_signature: null,
    substitute_signature: null,
    supervisor_signature: null,
    floor_auditor_signature: null
};
