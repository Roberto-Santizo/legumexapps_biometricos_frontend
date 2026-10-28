import type { FincaArea, FincaEmployeeDetail, FincaEmployeeForm, FincaEmployeePayload } from "@/features/finca-employees/finca-employees";

export const toFincaEmployeePayload = (form: FincaEmployeeForm): FincaEmployeePayload => ({
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim(),
    department: Number(form.department),
    position: Number(form.position),
    area: Number(form.area)
});

export const fincaEmployeeFullName = (employee: { first_name: string; last_name?: string | null }) =>
    [employee.first_name, employee.last_name].filter(Boolean).join(' ');

export const emptyFincaEmployeeForm: FincaEmployeeForm = {
    first_name: '',
    last_name: '',
    department: '',
    position: '',
    area: ''
};

// GET /employees-finca/:id devuelve las áreas como asignaciones (sin el ID del área);
// se resuelve contra el catálogo por código para marcar el radio del formulario
export const toFincaEmployeeForm = (employee: FincaEmployeeDetail, areas: FincaArea[]): FincaEmployeeForm => {
    const assigned = areas.find(area => employee.areas.some(a => a.area_code === area.area_code));

    return {
        first_name: employee.first_name,
        last_name: employee.last_name ?? '',
        department: String(employee.department_id),
        position: String(employee.position_id),
        area: assigned ? String(assigned.id) : ''
    };
};
