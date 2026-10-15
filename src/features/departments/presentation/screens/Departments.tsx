import { ActionsMenu, CustomFilledButton, FilterDrawer, LoadingData, Pagination, Table, Tbody, Td, Th, Thead, Title, Tr, usePagination } from "@/features/shared/shared";
import { EditIcon, EyeIcon, PlusIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { departmentsRepositoryProvider } from "@/features/departments/departments";

export function Departments() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, rowsPerPage } = usePagination(searchParams);
  const name = searchParams.get('name') ?? '';
  const code = searchParams.get('code') ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['getDepartments', page, rowsPerPage, name, code],
    queryFn: () => departmentsRepositoryProvider.getDepartments(page, rowsPerPage, { name, code })
  });

  // El backend no devuelve el total: si la página viene incompleta es la última
  const count = data && data.length < rowsPerPage ? page * rowsPerPage + data.length : -1;

  return (
    <div className="space-y-5">
      <Title title="Departamentos" subtitle="Listado de departamentos" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterDrawer
          fields={[
            { name: 'name', label: 'Nombre', placeholder: 'Buscar por nombre' },
            { name: 'code', label: 'Código', placeholder: 'Buscar por código' },
          ]}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

        <CustomFilledButton
          label="Crear Departamento"
          type="button"
          icon={<PlusIcon className="text-white" />}
          onClick={() => navigate('/departamentos/crear')}
        />
      </div>

      {isLoading && <LoadingData />}

      {data && (
        <>
          <Table>
            <Thead>
              <Th text="Código" />
              <Th text="Nombre" />
              <Th text="Creado por" />
              <Th text="Acciones" />
            </Thead>

            <Tbody>
              {data.map(department => (
                <Tr key={department.id}>
                  <Td>{department.code}</Td>
                  <Td>{department.name}</Td>
                  <Td>{department.creater_name || '—'}</Td>
                  <Td>
                    <ActionsMenu
                      items={[
                        { label: 'Ver', icon: <EyeIcon />, onClick: () => navigate(`/departamentos/${department.id}`) },
                        { label: 'Editar', icon: <EditIcon />, onClick: () => navigate(`/departamentos/${department.id}/editar`) },
                      ]}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {data.length === 0 && (
            <p className="text-center text-sm text-slate-500 dark:text-gray-400">No se encontraron departamentos</p>
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
