import { useQuery } from "@tanstack/react-query";
import type { SelectOption } from "@/features/shared/shared";
import { employeeFullName, employeesRepositoryProvider } from "@/features/employees/employees";

// Los empleados se buscan en el backend en lugar de cargar el catálogo completo
const EMPLOYEES_SEARCH_LIMIT = 20;

// Un texto numérico se busca como código (PIN); cualquier otro, por nombre. El value de cada opción es el PIN
export const searchEmployeeOptions = async (search: string, auth_dept_id = ''): Promise<SelectOption[]> => {
  const filters = /^\d+$/.test(search) ? { pin: search } : { name: search };
  const { data } = await employeesRepositoryProvider.getEmployees(0, EMPLOYEES_SEARCH_LIMIT, { ...filters, auth_dept_id });
  return data.map(employee => ({ value: employee.pin, label: `${employeeFullName(employee)} (${employee.pin})` }));
}

// Búsqueda solo por nombre (cuando el código se ingresa en un campo aparte)
export const searchEmployeeOptionsByName = async (name: string): Promise<SelectOption[]> => {
  const { data } = await employeesRepositoryProvider.getEmployees(0, EMPLOYEES_SEARCH_LIMIT, { name });
  return data.map(employee => ({ value: employee.pin, label: `${employeeFullName(employee)} (${employee.pin})` }));
}

// Consulta del empleado por PIN compartida entre formularios, listados y detalles
export const useEmployeeByPin = (pin: string) => useQuery({
  queryKey: ['getEmployeeByPin', pin],
  queryFn: () => employeesRepositoryProvider.getEmployeeByPin(pin),
  enabled: !!pin,
  retry: false
});
