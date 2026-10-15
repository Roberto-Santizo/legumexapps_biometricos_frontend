import { ActionsMenu, CustomFilledButton, FilterDrawer, LoadingData, Pagination, Table, Tbody, Td, Th, Thead, Title, Tr, usePagination } from "@/features/shared/shared";
import { EditIcon, EyeIcon, PlusIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { employeesRepositoryProvider } from "@/features/employees/employees";

export function Employees() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, rowsPerPage } = usePagination(searchParams);
  const name = searchParams.get('name') ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['getEmployees', page, rowsPerPage, name],
    queryFn: () => employeesRepositoryProvider.getEmployees(page, rowsPerPage, { name })
  });

  // El backend no devuelve el total: si la página viene incompleta es la última
  const count = data && data.length < rowsPerPage ? page * rowsPerPage + data.length : -1;

  return (
    <div className="space-y-5">
      <Title title="Empleados" subtitle="Listado de empleados registrados en ZKBioAccess" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterDrawer
          fields={[{ name: 'name', label: 'Nombre', placeholder: 'Buscar por nombre' }]}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

        <CustomFilledButton
          label="Crear Empleado"
          type="button"
          icon={<PlusIcon className="text-white" />}
          onClick={() => navigate('/empleados/crear')}
        />
      </div>

      {isLoading && <LoadingData />}

      {data && (
        <>
          <Table>
            <Thead>
              <Th text="PIN" />
              <Th text="Nombre" />
              <Th text="Departamento" />
              <Th text="Creado por" />
              <Th text="Acciones" />
            </Thead>

            <Tbody>
              {data.map(employee => (
                <Tr key={employee.id}>
                  <Td>{employee.pin}</Td>
                  <Td>{employee.name}</Td>
                  <Td>{employee.department || '—'}</Td>
                  <Td>{employee.createdBy || '—'}</Td>
                  <Td>
                    <ActionsMenu
                      items={[
                        { label: 'Ver', icon: <EyeIcon />, onClick: () => navigate(`/empleados/${employee.id}`) },
                        { label: 'Editar', icon: <EditIcon />, onClick: () => navigate(`/empleados/${employee.id}/editar`) },
                      ]}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {data.length === 0 && (
            <p className="text-center text-sm text-slate-500 dark:text-gray-400">No se encontraron empleados</p>
          )}

          <Pagination
            count={count}
            page={page}
            rowsPerPage={rowsPerPage}
            setSearchParams={setSearchParams}
          />
        </>
      )}
    </div>
  )
}
