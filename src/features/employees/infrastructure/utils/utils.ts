import type { EmployeeForm, EmployeePayload, UpdateEmployeePayload } from "@/features/employees/employees";

// datetime-local entrega "YYYY-MM-DDTHH:mm"; ZKBioAccess espera "YYYY-MM-DD HH:mm:ss"
const toZkDateTime = (value: string) => {
    if (!value) return undefined;
    const [date, time] = value.split('T');
    return `${date} ${time.length === 5 ? `${time}:00` : time}`;
}

export const toEmployeePayload = (form: EmployeeForm): EmployeePayload => ({
    name: form.name.trim(),
    lastName: form.lastName.trim(),
    pin: form.pin.trim(),
    deptCode: form.deptCode,
    // Vacío = sin posición; se omite del body
    position_id: form.position_id || undefined,
    accLevelIds: [form.accLevelIds].flat().join(','),
    accStartTime: toZkDateTime(form.accStartTime),
    accEndTime: toZkDateTime(form.accEndTime),
    file: form.file ?? undefined
});

// PATCH /employees/:id rechaza el PIN como propiedad no permitida
export const toUpdateEmployeePayload = (form: EmployeeForm): UpdateEmployeePayload => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pin, ...payload } = toEmployeePayload(form);
    return payload;
}

// En ZKBioAccess los apellidos pueden venir nulos o vacíos
export const employeeFullName = (employee: { name: string; last_name?: string | null }) =>
    [employee.name, employee.last_name].filter(Boolean).join(' ');

export const emptyEmployeeForm: EmployeeForm = {
    name: '',
    lastName: '',
    pin: '',
    deptCode: '',
    position_id: '',
    accLevelIds: [],
    accStartTime: '',
    accEndTime: '',
    file: null
};
