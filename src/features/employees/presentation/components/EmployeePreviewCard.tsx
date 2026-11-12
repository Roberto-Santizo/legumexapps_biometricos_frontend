import { employeeFullName, type Employee } from "@/features/employees/employees";
import { useState } from "react";
import { User } from "lucide-react";

function EmployeePreviewPhoto({ employee }: { employee: Employee }) {
  const [failed, setFailed] = useState(false);

  if (!employee.hasPhoto || !employee.photoUrl || failed) return (
    <div className="flex h-14 w-14 flex-none items-center justify-center rounded-xl bg-slate-100 dark:bg-gray-800">
      <User className="h-6 w-6 text-slate-400 dark:text-gray-500" aria-label="Sin fotografía" />
    </div>
  )

  return (
    <img
      src={employee.photoUrl}
      alt={`Fotografía de ${employeeFullName(employee)}`}
      onError={() => setFailed(true)}
      className="h-14 w-14 flex-none rounded-xl border border-slate-200 object-cover dark:border-gray-700"
    />
  )
}

// Datos de referencia del empleado elegido en un formulario
export function EmployeePreviewCard({ employee }: { employee: Employee }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-gray-700">
      <EmployeePreviewPhoto key={employee.pin} employee={employee} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-gray-100">{employeeFullName(employee)}</p>
        <p className="truncate text-xs text-slate-500 dark:text-gray-400">
          PIN {employee.pin} · {employee.position_id ? employee.position : 'Sin posición asignada'}
        </p>
      </div>
    </div>
  )
}
