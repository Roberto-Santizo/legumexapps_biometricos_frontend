import { ZoomablePhoto } from "@/features/shared/shared";
import { employeeFullName, useEmployeeByPin } from "@/features/employees/employees";

// Tarjeta amplia del trabajador elegido: la foto se puede tocar para verla en grande y confirmar que es la persona correcta
export function SelectedDiscountEmployee({ pin }: { pin: string }) {
  const { data: employee, isLoading } = useEmployeeByPin(pin);

  if (!pin) return null;

  if (isLoading) return (
    <div className="flex items-center gap-5 rounded-2xl border border-slate-200 p-4 dark:border-gray-700" aria-label="Cargando trabajador">
      <span className="h-28 w-28 flex-none animate-pulse rounded-2xl bg-slate-200 sm:h-32 sm:w-32 dark:bg-gray-700" />
      <div className="flex-1 space-y-2">
        <span className="block h-5 w-48 animate-pulse rounded bg-slate-200 dark:bg-gray-700" />
        <span className="block h-3.5 w-32 animate-pulse rounded bg-slate-200 dark:bg-gray-700" />
      </div>
    </div>
  )

  // Evita mostrar el empleado anterior mientras carga el nuevo
  if (!employee || employee.pin !== pin) return null;

  const name = employeeFullName(employee);

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 p-4 text-center sm:flex-row sm:items-center sm:gap-5 sm:text-left dark:border-gray-700">
      <ZoomablePhoto
        key={employee.pin}
        src={employee.hasPhoto ? employee.photoUrl : null}
        alt={`Fotografía de ${name}`}
        caption={`${name} · PIN ${employee.pin}`}
        className="h-28 w-28 rounded-2xl sm:h-32 sm:w-32"
      />
      <div className="min-w-0 flex-1">
        <p className="text-lg font-semibold text-balance text-slate-900 dark:text-gray-100">{name}</p>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
          <dt className="text-slate-500 dark:text-gray-400">PIN</dt>
          <dd className="font-medium tabular-nums text-slate-800 dark:text-gray-200">{employee.pin}</dd>
          <dt className="text-slate-500 dark:text-gray-400">Departamento</dt>
          <dd className="truncate font-medium text-slate-800 dark:text-gray-200">{employee.department || '—'}</dd>
          <dt className="text-slate-500 dark:text-gray-400">Posición</dt>
          <dd className="truncate font-medium text-slate-800 dark:text-gray-200">{employee.position_id ? employee.position : 'Sin posición asignada'}</dd>
        </dl>
        {employee.hasPhoto && (
          <p className="mt-2 text-xs text-slate-400 dark:text-gray-500">Toque la foto para ampliarla</p>
        )}
      </div>
    </div>
  )
}
