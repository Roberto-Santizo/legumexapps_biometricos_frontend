import { useQuery } from "@tanstack/react-query";
import { departmentsRepositoryProvider } from "@/features/departments/departments";
import { accessLevelsRepositoryProvider } from "@/features/access-levels/access-levels";
import { positionsRepositoryProvider } from "@/features/positions/positions";

// Los catálogos se usan completos en los selectores; el backend no expone un endpoint sin paginar
const CATALOG_LIMIT = 1000;

// Comparte la caché con el formulario de empleados
export function useTaskCatalogs() {
  const { data: departments } = useQuery({
    queryKey: ['getDepartments', 'catalog'],
    queryFn: () => departmentsRepositoryProvider.getDepartments(0, CATALOG_LIMIT),
    select: (response) => response.data
  });

  const { data: levels } = useQuery({
    queryKey: ['getAccessLevels', 'catalog'],
    queryFn: () => accessLevelsRepositoryProvider.getAccessLevels(0, CATALOG_LIMIT),
    select: (response) => response.data
  });

  const { data: positions } = useQuery({
    queryKey: ['getPositions', 'catalog'],
    queryFn: () => positionsRepositoryProvider.getPositions(0, CATALOG_LIMIT),
    select: (response) => response.data
  });

  return { departments, levels, positions };
}
