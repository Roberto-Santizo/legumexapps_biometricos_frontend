import { ActionsMenu, CustomFilledButton, FilterDrawer, LoadingData, Pagination, Table, Tbody, Td, Th, Thead, Title, Tr, usePagination } from "@/features/shared/shared";
import { EditIcon, EyeIcon, PlusIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { accessLevelsRepositoryProvider } from "@/features/access-levels/access-levels";

export function AccessLevels() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, rowsPerPage } = usePagination(searchParams);
  const name = searchParams.get('name') ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['getAccessLevels', page, rowsPerPage, name],
    queryFn: () => accessLevelsRepositoryProvider.getAccessLevels(page, rowsPerPage, { name })
  });

  // El backend no devuelve el total: si la página viene incompleta es la última
  const count = data && data.length < rowsPerPage ? page * rowsPerPage + data.length : -1;

  return (
    <div className="space-y-5">
      <Title title="Niveles de acceso" subtitle="Listado de niveles de acceso" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterDrawer
          fields={[{ name: 'name', label: 'Nombre', placeholder: 'Buscar por nombre' }]}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

        <CustomFilledButton
          label="Crear Nivel de Acceso"
          type="button"
          icon={<PlusIcon className="text-white" />}
          onClick={() => navigate('/niveles-acceso/crear')}
        />
      </div>

      {isLoading && <LoadingData />}

      {data && (
        <>
          <Table>
            <Thead>
              <Th text="Nombre" />
              <Th text="Creado por" />
              <Th text="Actualizado por" />
              <Th text="Acciones" />
            </Thead>

            <Tbody>
              {data.map(level => (
                <Tr key={level.id}>
                  <Td>{level.name}</Td>
                  <Td>{level.creater_name || '—'}</Td>
                  <Td>{level.updater_name || '—'}</Td>
                  <Td>
                    <ActionsMenu
                      items={[
                        { label: 'Ver', icon: <EyeIcon />, onClick: () => navigate(`/niveles-acceso/${level.id}`) },
                        { label: 'Editar', icon: <EditIcon />, onClick: () => navigate(`/niveles-acceso/${level.id}/editar`) },
                      ]}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {data.length === 0 && (
            <p className="text-center text-sm text-slate-500 dark:text-gray-400">No se encontraron niveles de acceso</p>
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
