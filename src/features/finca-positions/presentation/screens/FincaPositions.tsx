import { ActionsMenu, CustomFilledButton, FilterDrawer, LoadingData, Pagination, Table, Tbody, Td, Th, Thead, Title, Tr, usePagination } from "@/features/shared/shared";
import { EditIcon, EyeIcon, PlusIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fincaPositionsRepositoryProvider } from "@/features/finca-positions/finca-positions";

export function FincaPositions() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, rowsPerPage } = usePagination(searchParams);
  const position_code = searchParams.get('position_code') ?? '';
  const position_name = searchParams.get('position_name') ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['getFincaPositions', page, rowsPerPage, position_code, position_name],
    queryFn: () => fincaPositionsRepositoryProvider.getFincaPositions(page, rowsPerPage, { position_code, position_name })
  });

  return (
    <div className="space-y-5">
      <Title title="Posiciones Fincas" subtitle="Listado de posiciones de fincas" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterDrawer
          fields={[
            { name: 'position_code', label: 'Código', placeholder: 'Buscar por código' },
            { name: 'position_name', label: 'Nombre', placeholder: 'Buscar por nombre' },
          ]}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

        <CustomFilledButton
          label="Crear Posición"
          type="button"
          icon={<PlusIcon className="text-white" />}
          onClick={() => navigate('/posiciones-fincas/crear')}
        />
      </div>

      {isLoading && <LoadingData />}

      {data && (
        <>
          <Table>
            <Thead>
              <Th text="Código" />
              <Th text="Nombre" />
              <Th text="Por defecto" />
              <Th text="Acciones" />
            </Thead>

            <Tbody>
              {data.data.map(position => (
                <Tr key={position.id}>
                  <Td>{position.position_code}</Td>
                  <Td>{position.position_name}</Td>
                  <Td>{position.is_default ? 'Sí' : 'No'}</Td>
                  <Td>
                    <ActionsMenu
                      items={[
                        { label: 'Ver', icon: <EyeIcon />, onClick: () => navigate(`/posiciones-fincas/${position.id}`) },
                        { label: 'Editar', icon: <EditIcon />, onClick: () => navigate(`/posiciones-fincas/${position.id}/editar`) },
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
