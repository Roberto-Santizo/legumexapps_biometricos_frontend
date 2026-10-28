import { ActionsMenu, CustomFilledButton, FilterDrawer, LoadingData, Pagination, Table, Tbody, Td, Th, Thead, Title, Tr, usePagination } from "@/features/shared/shared";
import { EditIcon, EyeIcon, PlusIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fincaPositionsRepositoryProvider } from "@/features/finca-positions/finca-positions";
import { ResignBadge, fincaEmployeesRepositoryProvider } from "@/features/finca-employees/finca-employees";

// El filtro de posición necesita el catálogo completo; el backend no expone un endpoint sin paginar
const CATALOG_LIMIT = 1000;

export function FincaEmployees() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, rowsPerPage } = usePagination(searchParams);
  const first_name = searchParams.get('first_name') ?? '';
  const last_name = searchParams.get('last_name') ?? '';
  const emp_code = searchParams.get('emp_code') ?? '';
  const position_id = searchParams.get('position_id') ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['getFincaEmployees', page, rowsPerPage, first_name, last_name, emp_code, position_id],
    queryFn: () => fincaEmployeesRepositoryProvider.getFincaEmployees(page, rowsPerPage, { first_name, last_name, emp_code, position_id })
  });

  const { data: positions } = useQuery({
    queryKey: ['getFincaPositions', 'catalog'],
    queryFn: () => fincaPositionsRepositoryProvider.getFincaPositions(0, CATALOG_LIMIT),
    select: (response) => response.data
  });

  return (
    <div className="space-y-5">
      <Title title="Empleados Fincas" subtitle="Listado de empleados de fincas registrados en BioTime" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterDrawer
          fields={[
            { name: 'first_name', label: 'Nombres', placeholder: 'Buscar por nombres' },
            { name: 'last_name', label: 'Código', placeholder: 'Buscar por código de empleado' },
            {
              name: 'position_id',
              label: 'Posición',
              options: positions?.map(position => ({ value: String(position.id), label: position.position_name })) ?? []
            },
          ]}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

        <CustomFilledButton
          label="Crear Empleado"
          type="button"
          icon={<PlusIcon className="text-white" />}
          onClick={() => navigate('/empleados-fincas/crear')}
        />
      </div>

      {isLoading && <LoadingData />}

      {data && (
        <>
          <Table>
            <Thead>
              <Th text="Código Empleado" />
              <Th text="Código" />
              <Th text="Nombres" />
              <Th text="Departamento" />
              <Th text="Posición" />
              <Th text="Estado" />
              <Th text="Acciones" />
            </Thead>

            <Tbody>
              {data.data.map(employee => (
                <Tr key={employee.id}>
                  <Td>{employee.emp_code}</Td>
                  <Td>{employee.last_name || '—'}</Td>
                  <Td>{employee.first_name}</Td>
                  <Td>{employee.department}</Td>
                  <Td>{employee.position}</Td>
                  <Td><ResignBadge resign={employee.resign} /></Td>
                  <Td>
                    <ActionsMenu
                      items={[
                        { label: 'Ver', icon: <EyeIcon />, onClick: () => navigate(`/empleados-fincas/${employee.id}`) },
                        { label: 'Editar', icon: <EditIcon />, onClick: () => navigate(`/empleados-fincas/${employee.id}/editar`) },
                      ]}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {data.data.length === 0 && (
            <p className="text-center text-sm text-slate-500 dark:text-gray-400">No se encontraron empleados</p>
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
