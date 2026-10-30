import { ActionsMenu } from "@/features/shared/shared";
import { formatLongDay, weekDays } from "@/features/planifications/planifications";
import { TaskStatusBadge, TaskTypeBadge, taskDateToInput, todayInputDate, type Task } from "@/features/tasks/tasks";
import { EditIcon, EyeIcon, Trash2 } from "lucide-react";

type Props = {
  startDate: string;
  tasks: Task[];
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

// Nombre del empleado cuando el payload lo trae (altas); en movimientos y bajas solo se conoce el PIN
const taskSubject = (task: Task) => {
  const name = [task.payload.name, task.payload.lastName].filter(Boolean).join(' ');
  return name || null;
}

const columns = 'sm:grid-cols-[150px_120px_1fr_120px_40px]';

// Tareas de lunes a domingo en una sola lista ordenada por fecha (el backend ya las envía ordenadas)
export function WeekTasks({ startDate, tasks, onView, onEdit, onDelete }: Props) {
  const today = todayInputDate();
  const days = weekDays(startDate);
  const weekTasks = tasks
    .filter(task => days.includes(taskDateToInput(task.scheduled_at)))
    .sort((a, b) => taskDateToInput(a.scheduled_at).localeCompare(taskDateToInput(b.scheduled_at)));

  return (
    <ol className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <li aria-hidden="true" className={`hidden items-center gap-4 border-b border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-400 ${columns}`}>
        <span>Fecha</span>
        <span>Tipo</span>
        <span>Empleado</span>
        <span>Estado</span>
        <span />
      </li>
      {weekTasks.length === 0 ? (
        <li className="px-5 py-10 text-center text-sm text-slate-400 dark:text-gray-500">Sin tareas esta semana</li>
      ) : (
        weekTasks.map(task => {
          const day = taskDateToInput(task.scheduled_at);
          const isToday = day === today;
          const isPast = day < today;

          return (
            <li key={task.id} className={`grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 border-b border-slate-100 px-5 py-3 last:border-b-0 hover:bg-slate-50 dark:border-gray-800 dark:hover:bg-gray-800/40 ${columns}`}>
              <span className={`flex items-center gap-2 text-sm font-medium first-letter:uppercase ${isPast ? 'text-slate-400 dark:text-gray-500' : 'text-slate-900 dark:text-gray-100'}`}>
                {formatLongDay(day).split(',')[0]} {day.slice(8)}
                {isToday && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">Hoy</span>}
              </span>
              <span><TaskTypeBadge type={task.type} /></span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tabular-nums text-slate-900 dark:text-gray-100">PIN {task.pin}</p>
                {taskSubject(task) && <p className="truncate text-xs text-slate-500 dark:text-gray-400">{taskSubject(task)}</p>}
              </div>
              <span><TaskStatusBadge status={task.status} /></span>
              <ActionsMenu
                items={[
                  { label: 'Ver', icon: <EyeIcon />, onClick: () => onView(task) },
                  // Solo las tareas pendientes se pueden editar
                  { label: 'Editar', icon: <EditIcon />, disabled: task.status !== 'pendiente', onClick: () => onEdit(task) },
                  { label: 'Eliminar', icon: <Trash2 />, onClick: () => onDelete(task), destructive: true },
                ]}
              />
            </li>
          );
        })
      )}
    </ol>
  )
}
