import { CustomFilledButton, Spinner, TextFormField, Title, useNotification } from "@/features/shared/shared";
import {
  DepartmentField, PositionField, ScheduledAtField, TaskAccessLevelsField,
  emptyTaskForm, isPlanificationClosed, scheduleBounds, taskDateToInput, taskEditableFields, taskTypeLabels, tasksRepositoryProvider, toUpdateTaskPayload, useTaskCatalogs,
  type TaskForm, type UpdateTaskPayload
} from "@/features/tasks/tasks";
import { planificationLabel, planificationsRepositoryProvider } from "@/features/planifications/planifications";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

// Semanas recientes que se ofrecen para mover la tarea
const PLANIFICATIONS_LIMIT = 100;

export function UpdateTask() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notification = useNotification();
  const id = params.id!;

  const { data: task, isLoading } = useQuery({
    queryKey: ['getTaskById', id],
    queryFn: () => tasksRepositoryProvider.getTaskById(id)
  });

  const { departments, levels, positions } = useTaskCatalogs();

  const { data: planifications } = useQuery({
    queryKey: ['getPlanifications', 0, PLANIFICATIONS_LIMIT, ''],
    queryFn: () => planificationsRepositoryProvider.getPlanifications(0, PLANIFICATIONS_LIMIT),
    select: (response) => response.data
  });

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors, dirtyFields }
  } = useForm<TaskForm>({ defaultValues: emptyTaskForm });

  const planificationId = useWatch({ control, name: 'planification_id' });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: UpdateTaskPayload) => tasksRepositoryProvider.updateTaskById(payload, id),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getTasks'] });
      queryClient.invalidateQueries({ queryKey: ['getTaskById', id] });
      queryClient.invalidateQueries({ queryKey: ['getPlanifications'] });
      queryClient.invalidateQueries({ queryKey: ['getPlanificationById'] });
      navigate(`/tareas/${id}`);
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  // El payload guarda el código del departamento y los IDs de niveles; la posición no viene por ID, así que se deja en "mantener actual"
  useEffect(() => {
    if (task && departments) {
      const { payload } = task;
      reset({
        ...emptyTaskForm,
        planification_id: task.planification_id ?? '',
        scheduled_at: taskDateToInput(task.scheduled_at),
        name: String(payload.name ?? ''),
        lastName: String(payload.lastName ?? ''),
        auth_dept_id: departments.find(department => department.code === payload.deptCode)?.id ?? '',
        accLevelIds: String(payload.accLevelIds ?? '').split(',').filter(Boolean)
      });
    }
  }, [task, departments, reset]);

  if (isLoading || !departments || !levels || !positions) return <Spinner />
  if (task) {
    const fields = taskEditableFields[task.type];
    const pending = task.status === 'pendiente';
    const selected = planifications?.find(planification => planification.id === planificationId);
    const bounds = scheduleBounds(selected);

    const onSubmit = (form: TaskForm) => {
      const payload = toUpdateTaskPayload(form, task.type, dirtyFields);
      if (Object.keys(payload).length === 0) {
        notification.error('No hay cambios para guardar');
        return;
      }
      mutate(payload);
    };

    return (
      <div className="space-y-5">
        <Title title={`Editar ${taskTypeLabels[task.type].toLowerCase()} · PIN ${task.pin}`} subtitle="Solo se envían los campos modificados" />

        <form className="form w-full mx-auto lg:w-2/3" noValidate onSubmit={handleSubmit(onSubmit)}>
          {!pending && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
              Solo se pueden editar tareas pendientes.
            </p>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="planification_id">
              Planificación
            </label>

            <select
              id="planification_id"
              className="text_form_field"
              {...register('planification_id')}
            >
              {/* Las tareas cargadas por Excel no tienen planificación */}
              {!task.planification_id && <option value="">Sin planificación</option>}
              {planifications?.map(planification => (
                <option
                  key={planification.id}
                  value={planification.id}
                  disabled={isPlanificationClosed(planification) && planification.id !== task.planification_id}
                >
                  {planificationLabel(planification)}
                </option>
              ))}
            </select>
          </div>

          <ScheduledAtField register={register} errors={errors} min={bounds.min} max={bounds.max} />

          {fields.includes('name') && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextFormField<TaskForm>
                label="Nombres"
                name="name"
                placeholder="Nombres del empleado"
                register={register}
                type="text"
                validation={{ required: 'El nombre es requerido' }}
                errorMessage={errors.name?.message}
              />

              <TextFormField<TaskForm>
                label="Apellidos"
                name="lastName"
                placeholder="Apellidos del empleado"
                register={register}
                type="text"
                validation={{ required: 'Los apellidos son requeridos' }}
                errorMessage={errors.lastName?.message}
              />
            </div>
          )}

          {fields.includes('position_id') && <PositionField register={register} errors={errors} items={positions} optional />}
          {fields.includes('auth_dept_id') && <DepartmentField register={register} errors={errors} items={departments} optional />}
          {fields.includes('accLevelIds') && <TaskAccessLevelsField register={register} errors={errors} items={levels} />}

          <CustomFilledButton label="Guardar Cambios" type="submit" fullWitdh={true} disabled={isPending || !pending} loading={isPending} />
        </form>
      </div>
    )
  }
}
