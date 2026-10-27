import type { FincaArea, FincaEmployeeDetail, FincaEmployeeForm, FincaEmployeePayload } from "@/features/finca-employees/finca-employees";

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

// GET /employees-finca/:id devuelve las áreas como asignaciones (sin el ID del área);
// se resuelven contra el catálogo por código para marcar los checkboxes del formulario
export const toFincaEmployeeForm = (employee: FincaEmployeeDetail, areas: FincaArea[]): FincaEmployeeForm => ({
    first_name: employee.first_name,
    last_name: employee.last_name ?? '',
    department: String(employee.department_id),
    position: String(employee.position_id),
    area: areas
        .filter(area => employee.areas.some(assigned => assigned.area_code === area.area_code))
        .map(area => String(area.id))
});
