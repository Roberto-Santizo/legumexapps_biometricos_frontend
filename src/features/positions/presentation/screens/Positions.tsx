import { ActionsMenu, CustomFilledButton, FilterDrawer, LoadingData, Pagination, Table, Tbody, Td, Th, Thead, Title, Tr, usePagination } from "@/features/shared/shared";
import { EditIcon, EyeIcon, PlusIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { positionsRepositoryProvider } from "@/features/positions/positions";

export function Positions() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, rowsPerPage } = usePagination(searchParams);
  const code = searchParams.get('code') ?? '';
  const name = searchParams.get('name') ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['getPositions', page, rowsPerPage, code, name],
    queryFn: () => positionsRepositoryProvider.getPositions(page, rowsPerPage, { code, name })
  });

  return (
    <div className="space-y-5">
      <Title title="Posiciones" subtitle="Listado de posiciones" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterDrawer
          fields={[
            { name: 'code', label: 'Código', placeholder: 'Buscar por código' },
            { name: 'name', label: 'Nombre', placeholder: 'Buscar por nombre' },
          ]}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

        <CustomFilledButton
          label="Crear Posición"
          type="button"
          icon={<PlusIcon className="text-white" />}
          onClick={() => navigate('/posiciones/crear')}
        />
      </div>

      {isLoading && <LoadingData />}

      {data && (
        <>
          <Table>
            <Thead>
              <Th text="Código" />
              <Th text="Nombre" />
              <Th text="Empleado asignado" />
              <Th text="Acciones" />
            </Thead>

            <Tbody>
              {data.data.map(position => (
                <Tr key={position.id}>
                  <Td>{position.code}</Td>
                  <Td>{position.name}</Td>
                  <Td>{position.employee ?? '—'}</Td>
                  <Td>
                    <ActionsMenu
                      items={[
                        { label: 'Ver', icon: <EyeIcon />, onClick: () => navigate(`/posiciones/${position.id}`) },
                        // El backend no permite editar posiciones con un empleado asignado
                        { label: 'Editar', icon: <EditIcon />, disabled: !!position.employee, onClick: () => navigate(`/posiciones/${position.id}/editar`) },
                      ]}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {data.data.length === 0 && (
            <p className="text-center text-sm text-slate-500 dark:text-gray-400">No se encontraron posiciones</p>
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
