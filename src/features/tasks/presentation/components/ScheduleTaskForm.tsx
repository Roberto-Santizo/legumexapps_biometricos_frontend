import { CustomFilledButton, LoadingData, TextFormField, useNotification } from "@/features/shared/shared";
import {
  DepartmentField, EmployeeSearchField, PositionField, ScheduledAtField, TaskAccessLevelsField, TaskPhotoField,
  emptyTaskForm, scheduleBounds, taskTypeLabels, tasksRepositoryProvider, toCreationTaskPayload, toInactivationTaskPayload, toMovementTaskPayload, useTaskCatalogs,
  type TaskForm, type TaskPlanificationRef, type TaskType
} from "@/features/tasks/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormProps = {
  planification: TaskPlanificationRef;
  onScheduled: () => void;
}

// Al programar se refrescan el listado de tareas y los conteos de las planificaciones
function useScheduleTask(mutationFn: (form: TaskForm) => Promise<string>, onScheduled: () => void) {
  const notification = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getTasks'] });
      queryClient.invalidateQueries({ queryKey: ['getPlanifications'] });
      queryClient.invalidateQueries({ queryKey: ['getPlanificationById'] });
      onScheduled();
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });
}

const useTaskForm = (planification: TaskPlanificationRef) => useForm<TaskForm>({
  defaultValues: { ...emptyTaskForm, scheduled_at: scheduleBounds(planification).min }
});

function CreationTaskForm({ planification, onScheduled }: FormProps) {
  const { departments, levels, positions } = useTaskCatalogs();
  const { handleSubmit, register, control, formState: { errors } } = useTaskForm(planification);
  const { mutate, isPending } = useScheduleTask(
    (form) => tasksRepositoryProvider.createCreationTask(toCreationTaskPayload(form, planification.id)),
    onScheduled
  );
  const bounds = scheduleBounds(planification);

  if (!departments || !levels || !positions) return <LoadingData />

  return (
    <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit(form => mutate(form))}>
      <TextFormField<TaskForm>
        label="Código del empleado"
        name="pin"
        placeholder="PIN del nuevo empleado"
        register={register}
        type="text"
        validation={{ required: 'El PIN es requerido' }}
        errorMessage={errors.pin?.message}
      />

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

      <PositionField register={register} errors={errors} items={positions} />
      <DepartmentField register={register} errors={errors} items={departments} />
      <TaskAccessLevelsField register={register} errors={errors} items={levels} />
      <ScheduledAtField register={register} errors={errors} min={bounds.min} max={bounds.max} />
      <TaskPhotoField control={control} />

      <CustomFilledButton label="Programar alta" type="submit" fullWitdh={true} disabled={isPending} loading={isPending} />
    </form>
  )
}

function MovementTaskForm({ planification, onScheduled }: FormProps) {
  const { departments, levels, positions } = useTaskCatalogs();
  const { handleSubmit, register, control, formState: { errors } } = useTaskForm(planification);
  const { mutate, isPending } = useScheduleTask(
    (form) => tasksRepositoryProvider.createMovementTask(toMovementTaskPayload(form, planification.id)),
    onScheduled
  );
  const bounds = scheduleBounds(planification);

  if (!departments || !levels || !positions) return <LoadingData />

  return (
    <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit(form => mutate(form))}>
      <EmployeeSearchField control={control} />
      <PositionField register={register} errors={errors} items={positions} />
      <DepartmentField register={register} errors={errors} items={departments} />
      <TaskAccessLevelsField register={register} errors={errors} items={levels} />
      <ScheduledAtField register={register} errors={errors} min={bounds.min} max={bounds.max} />

      <CustomFilledButton label="Programar movimiento" type="submit" fullWitdh={true} disabled={isPending} loading={isPending} />
    </form>
  )
}

function InactivationTaskForm({ planification, onScheduled }: FormProps) {
  const { handleSubmit, register, control, formState: { errors } } = useTaskForm(planification);
  const { mutate, isPending } = useScheduleTask(
    (form) => tasksRepositoryProvider.createInactivationTask(toInactivationTaskPayload(form, planification.id)),
    onScheduled
  );
  const bounds = scheduleBounds(planification);

  return (
    <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit(form => mutate(form))}>
      <EmployeeSearchField control={control} />
      <ScheduledAtField register={register} errors={errors} min={bounds.min} max={bounds.max} />

      <CustomFilledButton
        label="Programar baja"
        type="submit"
        fullWitdh={true}
        disabled={isPending}
        loading={isPending}
        className="bg-red-600! hover:bg-red-700! focus:ring-red-500! disabled:bg-red-400!"
      />
    </form>
  )
}

const forms: Record<TaskType, (props: FormProps) => React.ReactNode> = {
  alta: CreationTaskForm,
  movimiento: MovementTaskForm,
  baja: InactivationTaskForm
};

// Programa una tarea (alta, movimiento o baja) dentro de la semana de la planificación
export function ScheduleTaskForm({ planification, onScheduled }: FormProps) {
  const [type, setType] = useState<TaskType>('alta');
  const SelectedForm = forms[type];

  return (
    <div className="flex flex-col gap-6">
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-slate-700 dark:text-gray-300">Tipo de tarea</legend>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(forms) as TaskType[]).map(option => (
            <label
              key={option}
              className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm font-semibold transition has-focus-visible:ring-2 has-focus-visible:ring-emerald-500 ${type === option
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'
                }`}
            >
              <input
                type="radio"
                name="task-type"
                value={option}
                checked={type === option}
                onChange={() => setType(option)}
                className="sr-only"
              />
              {taskTypeLabels[option]}
            </label>
          ))}
        </div>
      </fieldset>

      {/* key reinicia el formulario al cambiar de tipo */}
      <SelectedForm key={type} planification={planification} onScheduled={onScheduled} />
    </div>
  )
}
