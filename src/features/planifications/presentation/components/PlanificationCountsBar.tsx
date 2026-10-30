import type { PlanificationCounts } from "@/features/planifications/planifications";
import { taskStatusLabels, type TaskStatus } from "@/features/tasks/tasks";

const statusDot: Record<TaskStatus, string> = {
  pendiente: "bg-amber-500",
  completada: "bg-green-500",
  fallida: "bg-red-500"
};

// Conteo compacto de tareas por estado; los estados en cero se omiten
export function PlanificationCountsBar({ counts }: { counts: PlanificationCounts }) {
  if (counts.total === 0) return <span className="text-sm text-slate-400 dark:text-gray-500">Sin tareas</span>

  const statuses = (Object.keys(statusDot) as TaskStatus[]).filter(status => counts.by_status[status] > 0);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm tabular-nums">
      {statuses.map(status => (
        <span key={status} className="inline-flex items-center gap-1.5 text-slate-700 dark:text-gray-300" title={taskStatusLabels[status]}>
          <span className={`h-2 w-2 rounded-full ${statusDot[status]}`} aria-hidden="true" />
          {counts.by_status[status]} <span className="text-slate-500 dark:text-gray-400">{taskStatusLabels[status].toLowerCase()}</span>
        </span>
      ))}
    </div>
  )
}
