import type { SelectOption } from "@/features/shared/shared";
import { departmentsRepositoryProvider } from "@/features/departments/departments";

const DEPARTMENTS_SEARCH_LIMIT = 20;

// El filtro auth_dept_id de empleados espera el id del departamento (el formulario de empleados usa el código)
export const searchDepartmentOptions = async (name: string): Promise<SelectOption[]> => {
  const { data } = await departmentsRepositoryProvider.getDepartments(0, DEPARTMENTS_SEARCH_LIMIT, { name });
  return data.map(department => ({ value: department.id, label: `${department.name} (${department.code})` }));
}
