import { EmployeePreviewCard, useEmployeeByPin } from "@/features/employees/employees";

// El PIN viene del buscador, así que el empleado existe; se muestran sus datos (con foto) como referencia
export function SelectedEmployeePreview({ pin }: { pin: string }) {
  const { data: employee } = useEmployeeByPin(pin);

  // Evita mostrar el empleado anterior mientras carga el nuevo
  if (!pin || !employee || employee.pin !== pin) return null;

  return <EmployeePreviewCard employee={employee} />
}
