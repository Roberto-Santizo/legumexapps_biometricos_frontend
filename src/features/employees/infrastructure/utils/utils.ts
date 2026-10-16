import type { EmployeeForm, EmployeePayload } from "@/features/employees/employees";

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
    accLevelIds: [form.accLevelIds].flat().join(','),
    accStartTime: toZkDateTime(form.accStartTime),
    accEndTime: toZkDateTime(form.accEndTime),
    file: form.file ?? undefined
});

// En ZKBioAccess los apellidos pueden venir nulos o vacíos
export const employeeFullName = (employee: { name: string; last_name?: string | null }) =>
    [employee.name, employee.last_name].filter(Boolean).join(' ');

export const emptyEmployeeForm: EmployeeForm = {
    name: '',
    lastName: '',
    pin: '',
    deptCode: '',
    accLevelIds: [],
    accStartTime: '',
    accEndTime: '',
    file: null
};
