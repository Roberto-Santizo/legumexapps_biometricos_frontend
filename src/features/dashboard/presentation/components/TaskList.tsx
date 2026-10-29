import { Link } from "react-router-dom";
import { TaskTypeBadge } from "@/features/tasks/tasks";
import { type DashboardTaskSummary } from "@/features/dashboard/dashboard";
import { EmptyState } from "./Panel";

type Props = {
    tasks: DashboardTaskSummary[];
    emptyMessage: string;
    showError?: boolean;
}

export function TaskList({ tasks, emptyMessage, showError = false }: Props) {
    if (tasks.length === 0) return <EmptyState message={emptyMessage} />

    return (
        <ul className="-mx-2 divide-y divide-slate-100 dark:divide-gray-800">
            {tasks.map(task => (
                <li key={task.id}>
                    <Link to={`/tareas/${task.id}`} className="block rounded-lg px-2 py-2.5 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-gray-800">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-2">
                                <TaskTypeBadge type={task.type} />
                                <span className="truncate text-sm font-medium text-slate-900 tabular-nums dark:text-gray-100">PIN {task.pin}</span>
                            </div>
                            <span className="shrink-0 text-xs text-slate-500 tabular-nums dark:text-gray-400">{task.scheduled_at}</span>
                        </div>

                        <p className="mt-1 truncate text-xs text-slate-500 dark:text-gray-400">
                            {task.created_by}{task.attempts > 0 && ` · ${task.attempts} ${task.attempts === 1 ? 'intento' : 'intentos'}`}
                        </p>

                        {showError && task.last_error && (
                            <p className="mt-1 line-clamp-2 text-xs text-red-600 dark:text-red-400" title={task.last_error}>{task.last_error}</p>
                        )}
                    </Link>
                </li>
            ))}
        </ul>
    )
}
