import type { CreationTaskPayload, InactivationTaskPayload, MovementTaskPayload, TaskForm, TaskPlanificationRef, TaskStatus, TaskType, TaskUploadType, UpdateTaskPayload } from "@/features/tasks/tasks";

export const taskTypeLabels: Record<TaskType, string> = {
    alta: 'Alta',
    movimiento: 'Movimiento',
    baja: 'Baja'
};

export const taskStatusLabels: Record<TaskStatus, string> = {
    pendiente: 'Pendiente',
    completada: 'Completada',
    fallida: 'Fallida'
};

// Columnas que el backend lee de la primera hoja (desde la fila 2) según el tipo de carga
export const taskUploadTypes: { value: TaskUploadType; label: string; columns: string[] }[] = [
    { value: 'creation', label: 'Altas', columns: ['Posición', 'Código', 'Nombre', 'Código de departamento', 'Nivel de acceso', 'Fecha programada'] },
    { value: 'movement', label: 'Movimientos', columns: ['Posición', 'Código', 'Código de departamento', 'Nivel de acceso', 'Fecha programada'] },
    { value: 'inactivate', label: 'Bajas', columns: ['Código', 'Fecha programada'] }
];

// Claves del payload / previous que envía el backend, con su etiqueta en pantalla
export const taskFieldLabels: Record<string, string> = {
    pin: 'PIN',
    code: 'Código',
    name: 'Nombres',
    lastName: 'Apellidos',
    position: 'Posición',
    department: 'Departamento',
    deptCode: 'Código de departamento',
    accLevelIds: 'Niveles de acceso',
    leaveType: 'Tipo de baja',
    leaveDate: 'Fecha de baja'
};

export const formatTaskValue = (value: unknown): string => {
    if (value == null || value === '') return '—';
    if (Array.isArray(value)) return value.map(formatTaskValue).join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}

const pad = (value: number) => String(value).padStart(2, '0');

// Fecha local en formato "YYYY-MM-DD" (el que usan los inputs date y el backend)
export const toInputDate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const todayInputDate = () => toInputDate(new Date());

// scheduled_at llega como "YYYY-MM-DD" (columna date); se acepta también el formato anterior "dd-MM-yyyy HH:mm:ss"
export const taskDateToInput = (scheduledAt: string) => {
    const [date] = scheduledAt.split(/[ T]/);
    const [first, month, last] = date.split('-');
    return first.length === 4 ? date : `${last}-${month}-${first}`;
}

// scheduled_at debe ser hoy o posterior y caer dentro de la semana de la planificación
export const scheduleBounds = (planification?: Pick<TaskPlanificationRef, 'start_date' | 'end_date'>) => {
    const today = todayInputDate();
    if (!planification) return { min: today, max: undefined };
    return { min: planification.start_date > today ? planification.start_date : today, max: planification.end_date };
}

// La semana ya no admite tareas cuando su domingo es anterior a hoy
export const isPlanificationClosed = (planification: Pick<TaskPlanificationRef, 'end_date'>) => planification.end_date < todayInputDate();

// Campos de PATCH /tasks/:id que aplican a cada tipo (además de planification_id y scheduled_at)
export const taskEditableFields: Record<TaskType, (keyof UpdateTaskPayload)[]> = {
    alta: ['position_id', 'auth_dept_id', 'accLevelIds', 'name', 'lastName'],
    movimiento: ['position_id', 'auth_dept_id', 'accLevelIds'],
    baja: []
};

const joinLevels = (ids: string[]) => [ids].flat().filter(Boolean).join(',');

export const toCreationTaskPayload = (form: TaskForm, planificationId: string): CreationTaskPayload => ({
    planification_id: planificationId,
    pin: form.pin.trim(),
    name: form.name.trim(),
    lastName: form.lastName.trim(),
    // Vacío = sin posición; se omite del body
    position_id: form.position_id || undefined,
    auth_dept_id: form.auth_dept_id,
    accLevelIds: joinLevels(form.accLevelIds),
    scheduled_at: form.scheduled_at,
    file: form.file ?? undefined
});

export const toMovementTaskPayload = (form: TaskForm, planificationId: string): MovementTaskPayload => ({
    planification_id: planificationId,
    employee_id: form.employee_id,
    position_id: form.position_id,
    auth_dept_id: form.auth_dept_id,
    accLevelIds: joinLevels(form.accLevelIds),
    scheduled_at: form.scheduled_at
});

export const toInactivationTaskPayload = (form: TaskForm, planificationId: string): InactivationTaskPayload => ({
    planification_id: planificationId,
    employee_id: form.employee_id,
    scheduled_at: form.scheduled_at
});

// Solo se envían los campos modificados; los vacíos ("mantener actual") se omiten
export const toUpdateTaskPayload = (form: TaskForm, type: TaskType, dirty: Partial<Record<keyof TaskForm, unknown>>): UpdateTaskPayload => {
    const values: UpdateTaskPayload = {
        planification_id: form.planification_id,
        scheduled_at: form.scheduled_at,
        position_id: form.position_id,
        auth_dept_id: form.auth_dept_id,
        accLevelIds: joinLevels(form.accLevelIds),
        name: form.name.trim(),
        lastName: form.lastName.trim()
    };
    const allowed: (keyof UpdateTaskPayload)[] = ['planification_id', 'scheduled_at', ...taskEditableFields[type]];

    return Object.fromEntries(
        allowed.filter(key => dirty[key] && values[key]).map(key => [key, values[key]])
    );
}

export const emptyTaskForm: TaskForm = {
    planification_id: '',
    scheduled_at: '',
    employee_id: '',
    pin: '',
    name: '',
    lastName: '',
    position_id: '',
    auth_dept_id: '',
    accLevelIds: [],
    file: null
};
