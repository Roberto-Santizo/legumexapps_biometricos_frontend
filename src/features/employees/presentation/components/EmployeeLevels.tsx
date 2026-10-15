import { LoadingData, Table, Tbody, Td, Th, Thead, Tr } from "@/features/shared/shared";
import { employeesRepositoryProvider } from "@/features/employees/employees";
import { EyeIcon, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

type Props = {
  employeeId: string;
}

export function EmployeeLevels({ employeeId }: Props) {
  const navigate = useNavigate();

  const { data: levels, isLoading } = useQuery({
    queryKey: ['getEmployeeLevels', employeeId],
    queryFn: () => employeesRepositoryProvider.getEmployeeLevels(employeeId)
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-slate-800 dark:text-gray-100">
        <KeyRound size={20} />
        <h2 className="text-xl font-semibold">Niveles de acceso</h2>
      </div>

      {isLoading && <LoadingData />}

      {levels && (
        <>
          <Table>
            <Thead>
              <Th text="Nivel" />
              <Th text="Acciones" />
            </Thead>

            <Tbody>
              {levels.map(level => (
                <Tr key={level.id}>
                  <Td>{level.level_name}</Td>
                  <Td>
                    <button
                      type="button"
                      aria-label={`Ver nivel ${level.level_name}`}
                      onClick={() => navigate(`/niveles-acceso/${level.level_id}`)}
                      className="grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-blue-50 text-blue-600 transition hover:bg-blue-100 active:scale-90 dark:bg-blue-500/15 dark:text-blue-400 dark:hover:bg-blue-500/25"
                    >
                      <EyeIcon size={16} aria-hidden="true" />
                    </button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {levels.length === 0 && (
            <p className="text-center text-sm text-slate-500 dark:text-gray-400">Este empleado no tiene niveles de acceso asignados</p>
          )}
        </>
      )}
    </section>
  )
}
