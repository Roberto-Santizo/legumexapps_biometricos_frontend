import { CustomFilledButton, useNotification } from "@/features/shared/shared";
import { accessLevelsRepositoryProvider, type AssignDoorFormValues, type Door } from "@/features/access-levels/access-levels";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  levelId: string;
  doors: Door[];
  onAssigned: () => void;
}

export function AssignDoorForm({ levelId, doors, onAssigned }: Props) {
  const notification = useNotification();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<AssignDoorFormValues>({ defaultValues: { door_id: '' } });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ door_id }: AssignDoorFormValues) => accessLevelsRepositoryProvider.assignDoorToLevel({ door_id, level_id: levelId }),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getLevelDoors', levelId] });
      onAssigned();
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  const onSubmit = (payload: AssignDoorFormValues) => mutate(payload);

  if (doors.length === 0) {
    return <p className="text-center text-sm text-slate-500 dark:text-gray-400">No hay puertas disponibles para asignar</p>
  }

  return (
    <form className="flex flex-col gap-6" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="door_id">
          Puerta
        </label>

        <select
          id="door_id"
          aria-invalid={!!errors.door_id}
          className={errors.door_id ? 'text_form_field_error' : 'text_form_field'}
          {...register('door_id', { required: 'Seleccione una puerta' })}
        >
          <option value="" disabled>Seleccione una puerta</option>
          {doors.map(door => (
            <option key={door.id} value={door.id}>{door.dev_alias}</option>
          ))}
        </select>

        <p className="text-red-400 text-xs">{errors.door_id?.message}</p>
      </div>

      <CustomFilledButton label="Asignar Puerta" type="submit" fullWitdh={true} disabled={isPending} />
    </form>
  )
}
