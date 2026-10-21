import type { TaskStatus, TaskType, TaskUploadType } from "@/features/tasks/tasks";

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
