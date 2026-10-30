import { CustomFilledButton, InfoCard, Modal, Spinner, useNotification } from "@/features/shared/shared";
import { WeekTasks, formatWeekRange, planificationsRepositoryProvider } from "@/features/planifications/planifications";
import { ScheduleTaskForm, isPlanificationClosed, tasksRepositoryProvider, type Task } from "@/features/tasks/tasks";
import { ArrowLeft, CalendarCheck, CalendarClock, CircleAlert, ListChecks, PlusIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export function ShowPlanification() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notification = useNotification();
  const [modal, setModal] = useState(false);
  const id = params.id!;

  const { data, isLoading, error } = useQuery({
    queryKey: ['getPlanificationById', id],
    queryFn: () => planificationsRepositoryProvider.getPlanificationById(id)
  });

  const { mutate: deleteTask } = useMutation({
    mutationFn: (taskId: string) => tasksRepositoryProvider.deleteTask(taskId),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getTasks'] });
      queryClient.invalidateQueries({ queryKey: ['getPlanifications'] });
      queryClient.invalidateQueries({ queryKey: ['getPlanificationById', id] });
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  const { mutate: deletePlanification, isPending: isDeleting } = useMutation({
    mutationFn: () => planificationsRepositoryProvider.deletePlanification(id),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getPlanifications'] });
      queryClient.removeQueries({ queryKey: ['getPlanificationById', id] });
      navigate('/planificaciones');
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  const handleDeleteTask = (task: Task) => notification.question(
    `¿Desea eliminar la tarea del PIN ${task.pin}?`,
    'Eliminar',
    'La tarea dejará de ejecutarse en ZKBioAccess',
    () => deleteTask(task.id)
  );

  const handleDeletePlanification = () => notification.question(
    '¿Desea eliminar la planificación?',
    'Eliminar',
    'La semana no tiene tareas asociadas',
    () => deletePlanification()
  );

  if (isLoading) return <Spinner />
  if (error) return (
    <p className="text-center text-sm text-red-600 dark:text-red-400">No se pudo cargar la planificación: {error.message}</p>
  )
  if (data) {
    const closed = isPlanificationClosed(data);
    const countBy = (status: Task['status']) => data.tasks.filter(task => task.status === status).length;

    return (
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <button type="button" onClick={() => navigate('/planificaciones')} className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer dark:text-gray-400 dark:hover:text-gray-100">
          <ArrowLeft className="h-4 w-4" /> Planificaciones
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-balance text-slate-900 sm:text-3xl dark:text-gray-100">
              Semana {data.week} · {data.year}
            </h1>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              {formatWeekRange(data)} · creada por {data.created_by}
            </p>
          </div>

          {/* La fecha programada debe ser hoy o posterior, así que una semana pasada ya no admite tareas */}
          <CustomFilledButton
            label={closed ? 'Semana finalizada' : 'Programar tarea'}
            type="button"
            icon={<PlusIcon className="h-4 w-4 text-white" />}
            disabled={closed}
            loading={false}
            onClick={() => setModal(true)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <InfoCard icon={<ListChecks className="h-4 w-4" />} label="Tareas" value={data.tasks.length} />
          <InfoCard icon={<CalendarClock className="h-4 w-4" />} label="Pendientes" value={countBy('pendiente')} />
          <InfoCard icon={<CalendarCheck className="h-4 w-4" />} label="Completadas" value={countBy('completada')} />
          <InfoCard icon={<CircleAlert className="h-4 w-4" />} label="Fallidas" value={countBy('fallida')} />
        </div>

        <WeekTasks
          startDate={data.start_date}
          tasks={data.tasks}
          onView={(task) => navigate(`/tareas/${task.id}`)}
          onEdit={(task) => navigate(`/tareas/${task.id}/editar`)}
          onDelete={handleDeleteTask}
        />

        {/* El backend solo elimina planificaciones sin tareas */}
        {data.tasks.length === 0 && (
          <div className="flex flex-col gap-4 rounded-2xl border border-red-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-red-500/30">
            <div>
              <h2 className="text-sm font-semibold text-red-700 dark:text-red-300">Eliminar planificación</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">La semana no tiene tareas y puede eliminarse.</p>
            </div>
            <CustomFilledButton
              label="Eliminar"
              type="button"
              icon={<Trash2 className="h-4 w-4 text-white" />}
              disabled={isDeleting}
              loading={isDeleting}
              className="flex-none bg-red-600! hover:bg-red-700! focus:ring-red-500! disabled:bg-red-400!"
              onClick={handleDeletePlanification}
            />
          </div>
        )}

        <Modal modal={modal} closeModal={() => setModal(false)} title={`Programar tarea · Semana ${data.week}`} width="sm:max-w-xl">
          <ScheduleTaskForm planification={data} onScheduled={() => setModal(false)} />
        </Modal>
      </div>
    )
  }
}
