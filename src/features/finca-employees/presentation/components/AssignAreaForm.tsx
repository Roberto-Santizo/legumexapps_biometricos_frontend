import { CustomFilledButton, useNotification } from "@/features/shared/shared";
import { fincaEmployeesRepositoryProvider, type AssignFincaAreaForm, type FincaArea } from "@/features/finca-employees/finca-employees";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  employeeId: string;
  areas: FincaArea[];
  onAssigned: () => void;
}

export function AssignAreaForm({ employeeId, areas, onAssigned }: Props) {
  const notification = useNotification();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<AssignFincaAreaForm>({ defaultValues: { area_id: '' } });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ area_id }: AssignFincaAreaForm) => fincaEmployeesRepositoryProvider.addFincaEmployeeArea({ employee_id: Number(employeeId), area_id: Number(area_id) }),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getFincaEmployeeById', employeeId] });
      onAssigned();
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  const onSubmit = (payload: AssignFincaAreaForm) => mutate(payload);

  if (areas.length === 0) {
    return <p className="text-center text-sm text-slate-500 dark:text-gray-400">No hay áreas disponibles para asignar</p>
  }

  return (
    <form className="flex flex-col gap-6" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="area_id">
          Área
        </label>

        <select
          id="area_id"
          aria-invalid={!!errors.area_id}
          className={errors.area_id ? 'text_form_field_error' : 'text_form_field'}
          {...register('area_id', { required: 'Seleccione un área' })}
        >
          <option value="" disabled>Seleccione un área</option>
          {areas.map(area => (
            <option key={area.id} value={area.id}>{area.area_name} ({area.area_code})</option>
          ))}
        </select>

        <p className="text-red-400 text-xs">{errors.area_id?.message}</p>
      </div>

      <CustomFilledButton label="Asignar Área" type="submit" fullWitdh={true} disabled={isPending} />
    </form>
  )
}
