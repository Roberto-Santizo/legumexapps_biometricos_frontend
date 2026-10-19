import { CustomFilledButton, DateFormField, downloadBufferFile, useNotification } from "@/features/shared/shared";
import { employeeTransactionsRepositoryProvider, type TransactionsReportPayload } from "@/features/employee-transactions/employee-transactions";
import { FileSpreadsheet } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

// El backend rechaza rangos donde end_date supere a start_date por más de 7 días
const MAX_RANGE_DAYS = 7;
// Por defecto se propone la última semana, hoy incluido
const DEFAULT_RANGE_DAYS = 6;
const DAY_MS = 24 * 60 * 60 * 1000;

const toDateInput = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

const daysBetween = (start: string, end: string) => (Date.parse(end) - Date.parse(start)) / DAY_MS;

type Props = {
  onGenerated: () => void;
}

export function TransactionsReportForm({ onGenerated }: Props) {
  const notification = useNotification();
  const today = new Date();

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors }
  } = useForm<TransactionsReportPayload>({
    defaultValues: {
      start_date: toDateInput(new Date(today.getTime() - DEFAULT_RANGE_DAYS * DAY_MS)),
      end_date: toDateInput(today)
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: TransactionsReportPayload) => employeeTransactionsRepositoryProvider.generateTransactionsReport(payload),
    onSuccess: (file, { start_date, end_date }) => {
      downloadBufferFile(file, `Marcajes_${start_date}_${end_date}.xlsx`);
      notification.success('Reporte generado correctamente');
      onGenerated();
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  const onSubmit = (payload: TransactionsReportPayload) => mutate(payload);

  return (
    <form className="flex flex-col gap-6" noValidate onSubmit={handleSubmit(onSubmit)}>
      <p className="text-sm text-slate-500 dark:text-gray-400">
        Se descargará un archivo Excel con los marcajes del rango seleccionado. El rango no puede superar una semana.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DateFormField
          label="Fecha de inicio"
          name="start_date"
          register={register}
          errorMessage={errors.start_date?.message}
          validation={{ required: 'La fecha de inicio es obligatoria' }}
        />

        <DateFormField
          label="Fecha de fin"
          name="end_date"
          register={register}
          errorMessage={errors.end_date?.message}
          validation={{
            required: 'La fecha de fin es obligatoria',
            validate: (end) => {
              const days = daysBetween(getValues('start_date'), end);
              if (days < 0) return 'Debe ser igual o posterior a la fecha de inicio';
              if (days > MAX_RANGE_DAYS) return 'El rango no puede ser mayor a una semana';
              return true;
            }
          }}
        />
      </div>

      <CustomFilledButton
        label="Descargar reporte"
        type="submit"
        fullWitdh={true}
        icon={<FileSpreadsheet className="h-4 w-4 text-white" />}
        disabled={isPending}
      />
    </form>
  )
}
