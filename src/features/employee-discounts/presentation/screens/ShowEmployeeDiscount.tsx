import { CustomFilledButton, Spinner, ZoomablePhoto, useNotification } from "@/features/shared/shared";
import { DiscountAmount, employeeDiscountsRepositoryProvider, formatDiscountLongDate } from "@/features/employee-discounts/employee-discounts";
import { employeeFullName, useEmployeeByPin } from "@/features/employees/employees";
import { ArrowLeft, CalendarDays, EditIcon, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

const formatDateTime = (value: string) => new Date(value).toLocaleString('es-GT');

export function ShowEmployeeDiscount() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notification = useNotification();
  const id = params.id!;

  const { data, isLoading, error } = useQuery({
    queryKey: ['getDiscountById', id],
    queryFn: () => employeeDiscountsRepositoryProvider.getDiscountById(id)
  });

  const { data: employee, isLoading: isLoadingEmployee } = useEmployeeByPin(data?.code ?? '');

  const { mutate: deleteDiscount, isPending: isDeleting } = useMutation({
    mutationFn: () => employeeDiscountsRepositoryProvider.deleteDiscountById(id),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getDiscounts'] });
      queryClient.removeQueries({ queryKey: ['getDiscountById', id] });
      navigate('/descuentos');
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  if (isLoading) return <Spinner />
  if (error) return (
    <p className="text-center text-sm text-red-600 dark:text-red-400">No se pudo cargar el descuento: {error.message}</p>
  )
  if (data) {
    const name = employee ? employeeFullName(employee) : null;

    const handleDelete = () => notification.question(
      '¿Desea eliminar el descuento?',
      'Eliminar',
      'Esta acción no se puede deshacer',
      () => deleteDiscount()
    );

    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button type="button" onClick={() => navigate('/descuentos')} className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer dark:text-gray-400 dark:hover:text-gray-100">
            <ArrowLeft className="h-4 w-4" /> Descuentos
          </button>
          <div className="flex gap-2">
            <CustomFilledButton
              label="Eliminar"
              type="button"
              icon={<Trash2 className="h-4 w-4 text-white" />}
              disabled={isDeleting}
              loading={isDeleting}
              className="bg-red-600! hover:bg-red-700! focus:ring-red-500!"
              onClick={handleDelete}
            />
            <CustomFilledButton
              label="Editar"
              type="button"
              icon={<EditIcon className="h-4 w-4 text-white" />}
              onClick={() => navigate(`/descuentos/${id}/editar`)}
            />
          </div>
        </div>

        {/* Comprobante pensado para mostrárselo al trabajador: el monto es lo primero que se lee */}
        <article aria-label="Comprobante de descuento" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="flex flex-col items-center gap-4 px-6 pb-8 pt-8 text-center sm:px-10">
            <ZoomablePhoto
              src={employee?.hasPhoto ? employee.photoUrl : null}
              alt={name ? `Fotografía de ${name}` : 'Fotografía del trabajador'}
            />
            <div className="min-w-0">
              {isLoadingEmployee ? (
                <span className="mx-auto block h-5 w-48 animate-pulse rounded bg-slate-200 dark:bg-gray-700" aria-label="Cargando trabajador" />
              ) : (
                <h1 className="text-xl font-semibold text-balance text-slate-900 dark:text-gray-100">{name ?? 'Trabajador no encontrado'}</h1>
              )}
              <p className="mt-1 text-sm tabular-nums text-slate-500 dark:text-gray-400">
                PIN {data.code}{employee?.position_id ? ` · ${employee.position}` : ''}
              </p>
            </div>
          </div>

          <div className="border-y border-dashed border-rose-200 bg-rose-50/60 px-6 py-8 text-center dark:border-rose-900/60 dark:bg-rose-950/30">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-700/80 dark:text-rose-300/80">Se le descuenta</p>
            <DiscountAmount amount={data.amount} size="lg" className="mt-2" />
          </div>

          <div className="flex items-center justify-center gap-2 px-6 py-5 text-sm text-slate-700 dark:text-gray-300">
            <CalendarDays className="h-4 w-4 text-slate-400 dark:text-gray-500" aria-hidden />
            <span>Fecha del descuento: <strong className="font-semibold">{formatDiscountLongDate(data.date)}</strong></span>
          </div>
        </article>

        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-xs text-slate-500 sm:grid-cols-2 dark:text-gray-400">
          <div className="flex gap-1.5"><dt>Registrado</dt><dd className="font-medium tabular-nums text-slate-700 dark:text-gray-300">{formatDateTime(data.createdAt)}</dd></div>
          <div className="flex gap-1.5 sm:justify-end"><dt>Actualizado</dt><dd className="font-medium tabular-nums text-slate-700 dark:text-gray-300">{formatDateTime(data.updatedAt)}</dd></div>
        </dl>
      </div>
    )
  }
}
