import { useState } from "react";
import { User } from "lucide-react";
import { employeeFullName, useEmployeeByPin } from "@/features/employees/employees";

function Avatar({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return (
    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-slate-100 dark:bg-gray-800">
      <User className="h-4 w-4 text-slate-400 dark:text-gray-500" aria-hidden />
    </span>
  )

  return <img src={src} alt={alt} onError={() => setFailed(true)} className="h-9 w-9 flex-none rounded-lg border border-slate-200 object-cover dark:border-gray-700" />
}

// El descuento solo trae el PIN; nombre y foto se consultan (y cachean) por PIN
export function DiscountEmployee({ pin }: { pin: string }) {
  const { data: employee, isLoading } = useEmployeeByPin(pin);
  const name = employee ? employeeFullName(employee) : null;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar key={pin} src={employee?.hasPhoto ? employee.photoUrl : undefined} alt={name ? `Fotografía de ${name}` : ''} />
      <div className="min-w-0">
        {isLoading ? (
          <span className="block h-3.5 w-32 animate-pulse rounded bg-slate-200 dark:bg-gray-700" aria-label="Cargando empleado" />
        ) : (
          <span className="block truncate font-medium text-slate-900 dark:text-gray-100">{name ?? 'Empleado no encontrado'}</span>
        )}
        <span className="block text-xs tabular-nums text-slate-500 dark:text-gray-400">PIN {pin}</span>
      </div>
    </div>
  )
}
