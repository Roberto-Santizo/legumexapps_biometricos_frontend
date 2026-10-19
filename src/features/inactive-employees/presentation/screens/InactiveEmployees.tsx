import { ActionsMenu, FilterDrawer, LoadingData, Pagination, Table, Tbody, Td, Th, Thead, Title, Tr, useNotification, usePagination } from "@/features/shared/shared";
import { EyeIcon, UserCheck } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inactiveEmployeesRepositoryProvider } from "@/features/inactive-employees/inactive-employees";
import { employeeFullName } from "@/features/employees/employees";

const formatDate = (value?: string | null) => value ? new Date(value).toLocaleString('es-GT') : '—';

export function InactiveEmployees() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notification = useNotification();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, rowsPerPage } = usePagination(searchParams);
  const name = searchParams.get('name') ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['getInactiveEmployees', page, rowsPerPage, name],
    queryFn: () => inactiveEmployeesRepositoryProvider.getInactiveEmployees(page, rowsPerPage, { name })
  });

  const { mutate } = useMutation({
    mutationFn: (id: string) => inactiveEmployeesRepositoryProvider.reActivateEmployee(id),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getInactiveEmployees'] });
      queryClient.invalidateQueries({ queryKey: ['getEmployees'] });
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  const handleReActivate = (id: string) => notification.question(
    '¿Desea reactivar al empleado?',
    'Reactivar',
    'El empleado será dado de alta nuevamente en ZKBioAccess',
    () => mutate(id)
  );

  return (
    <div className="space-y-5">
      <Title title="Empleados inactivos" subtitle="Listado de empleados dados de baja en ZKBioAccess" />

      <FilterDrawer
        fields={[{ name: 'name', label: 'Nombre', placeholder: 'Buscar por nombre' }]}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />

      {isLoading && <LoadingData />}

      {data && (
        <>
          <Table>
            <Thead>
              <Th text="PIN" />
              <Th text="Nombre" />
              <Th text="Departamento" />
              <Th text="Fecha de baja" />
              <Th text="Acciones" />
            </Thead>

            <Tbody>
              {data.data.map(employee => (
                <Tr key={employee.id}>
                  <Td>{employee.pin}</Td>
                  <Td>{employeeFullName(employee)}</Td>
                  <Td>{employee.department || '—'}</Td>
                  <Td>{formatDate(employee.leave_date)}</Td>
                  <Td>
                    <ActionsMenu
                      items={[
                        { label: 'Ver', icon: <EyeIcon />, onClick: () => navigate(`/empleados-inactivos/${employee.id}`) },
                        { label: 'Reactivar', icon: <UserCheck />, onClick: () => handleReActivate(employee.id) },
                      ]}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {data.data.length === 0 && (
            <p className="text-center text-sm text-slate-500 dark:text-gray-400">No se encontraron empleados inactivos</p>
          )}

          <Pagination
            count={data.total}
            page={page}
            rowsPerPage={rowsPerPage}
            setSearchParams={setSearchParams}
          />
        </>
      )}
    </div>
  )
}
