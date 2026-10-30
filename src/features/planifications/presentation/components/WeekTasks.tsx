import { ActionsMenu } from "@/features/shared/shared";
import { formatLongDay, weekDays } from "@/features/planifications/planifications";
import { TaskStatusBadge, TaskTypeBadge, taskDateToInput, taskTime, todayInputDate, type Task } from "@/features/tasks/tasks";
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

// Agenda de lunes a domingo con las tareas de cada día
export function WeekTasks({ startDate, tasks, onView, onEdit, onDelete }: Props) {
  const today = todayInputDate();

  return (
    <ol className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:divide-gray-800 dark:border-gray-700 dark:bg-gray-900">
      {weekDays(startDate).map(day => {
        const dayTasks = tasks.filter(task => taskDateToInput(task.scheduled_at) === day);
        const isToday = day === today;
        const isPast = day < today;

        return (
          <li key={day} className="grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-[180px_1fr]">
            <div className="flex items-center gap-2 sm:items-start">
              <h3 className={`text-sm font-semibold first-letter:uppercase ${isPast ? 'text-slate-400 dark:text-gray-500' : 'text-slate-900 dark:text-gray-100'}`}>
                {formatLongDay(day)}
              </h3>
              {isToday && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">Hoy</span>}
            </div>

            {dayTasks.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-gray-500">Sin tareas</p>
            ) : (
              <ul className="space-y-2">
                {dayTasks.map(task => (
                  <li key={task.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-gray-800/60">
                    <span className="w-11 flex-none text-xs font-medium tabular-nums text-slate-500 dark:text-gray-400">{taskTime(task.scheduled_at)}</span>
                    <TaskTypeBadge type={task.type} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold tabular-nums text-slate-900 dark:text-gray-100">PIN {task.pin}</p>
                      {taskSubject(task) && <p className="truncate text-xs text-slate-500 dark:text-gray-400">{taskSubject(task)}</p>}
                    </div>
                    <TaskStatusBadge status={task.status} />
                    <ActionsMenu
                      items={[
                        { label: 'Ver', icon: <EyeIcon />, onClick: () => onView(task) },
                        // Solo las tareas pendientes se pueden editar
                        { label: 'Editar', icon: <EditIcon />, disabled: task.status !== 'pendiente', onClick: () => onEdit(task) },
                        { label: 'Eliminar', icon: <Trash2 />, onClick: () => onDelete(task), destructive: true },
                      ]}
                    />
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  )
}
