import type { FincaEmployeeForm, FincaEmployeePayload } from "@/features/finca-employees/finca-employees";

export const toFincaEmployeePayload = (form: FincaEmployeeForm): FincaEmployeePayload => ({
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim(),
    department: Number(form.department),
    position: Number(form.position),
    area: [form.area].flat().filter(Boolean).map(Number)
});

export const fincaEmployeeFullName = (employee: { first_name: string; last_name?: string | null }) =>
    [employee.first_name, employee.last_name].filter(Boolean).join(' ');

export const emptyFincaEmployeeForm: FincaEmployeeForm = {
    first_name: '',
    last_name: '',
    department: '',
    position: '',
    area: []
};
