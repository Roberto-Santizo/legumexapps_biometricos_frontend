import { CustomFilledButton, TextFormField, useNotification } from "@/features/shared/shared";
import { formatWeekRange, getIsoWeek, isoWeekRange, isoWeeksInYear, planificationsRepositoryProvider, type Planification, type PlanificationForm } from "@/features/planifications/planifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { CalendarRange } from "lucide-react";

// Por defecto se propone la semana siguiente, que es la que normalmente se planifica
const nextWeek = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return getIsoWeek(date);
}

type Props = {
  onCreated: (planification: Planification) => void;
}

export function CreatePlanificationForm({ onCreated }: Props) {
  const notification = useNotification();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors }
  } = useForm<PlanificationForm>({ defaultValues: nextWeek() });

  const [year, week] = useWatch({ control, name: ['year', 'week'] });
  const validWeek = year >= 2000 && week >= 1 && week <= isoWeeksInYear(year);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: PlanificationForm) => planificationsRepositoryProvider.createPlanification(payload),
    onSuccess: (planification) => {
      notification.success(`Planificación de la semana ${planification.week} creada correctamente`);
      queryClient.invalidateQueries({ queryKey: ['getPlanifications'] });
      onCreated(planification);
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  return (
    <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit(payload => mutate(payload))}>
      <div className="grid grid-cols-2 gap-4">
        <TextFormField<PlanificationForm>
          label="Año"
          name="year"
          placeholder="2026"
          register={register}
          type="number"
          validation={{
            required: 'El año es requerido',
            valueAsNumber: true,
            min: { value: 2000, message: 'El año debe ser 2000 o posterior' }
          }}
          errorMessage={errors.year?.message}
        />

        <TextFormField<PlanificationForm>
          label="Semana"
          name="week"
          placeholder="45"
          register={register}
          type="number"
          validation={{
            required: 'La semana es requerida',
            valueAsNumber: true,
            validate: (week, { year }) => (week >= 1 && week <= isoWeeksInYear(year)) || `El año ${year} tiene semanas de la 1 a la ${isoWeeksInYear(year)}`
          }}
          errorMessage={errors.week?.message}
        />
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-gray-800/60">
        <CalendarRange className="h-5 w-5 flex-none text-slate-500 dark:text-gray-400" />
        <p className="text-sm text-slate-700 dark:text-gray-200">
          {validWeek
            ? <>Lunes a domingo: <span className="font-semibold tabular-nums">{formatWeekRange(isoWeekRange(year, week))}</span></>
            : 'Ingrese un año y una semana ISO válidos'}
        </p>
      </div>

      <CustomFilledButton label="Crear planificación" type="submit" fullWitdh={true} disabled={isPending} loading={isPending} />
    </form>
  )
}
