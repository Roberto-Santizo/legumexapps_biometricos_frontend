import { taskStatusLabels, taskTypeLabels, type TaskStatus, type TaskType } from "@/features/tasks/tasks";

const statusClasses: Record<TaskStatus, string> = {
    pendiente: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    completada: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400",
    fallida: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400"
};

const typeClasses: Record<TaskType, string> = {
    alta: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    movimiento: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    baja: "bg-slate-100 text-slate-700 dark:bg-gray-700/60 dark:text-gray-300"
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
    return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[status]}`}>
            {taskStatusLabels[status]}
        </span>
    )
}

export function TaskTypeBadge({ type }: { type: TaskType }) {
    return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${typeClasses[type]}`}>
            {taskTypeLabels[type]}
        </span>
    )
}
