import { ActionsMenu, CustomFilledButton, FilterDrawer, LoadingData, Pagination, Table, Tbody, Td, Th, Thead, Title, Tr, usePagination } from "@/features/shared/shared";
import { EditIcon, EyeIcon, PlusIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fincaDepartmentsRepositoryProvider } from "@/features/finca-departments/finca-departments";

export function FincaDepartments() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, rowsPerPage } = usePagination(searchParams);
  const dept_name = searchParams.get('dept_name') ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['getFincaDepartments', page, rowsPerPage, dept_name],
    queryFn: () => fincaDepartmentsRepositoryProvider.getFincaDepartments(page, rowsPerPage, { dept_name })
  });

  return (
    <div className="space-y-5">
      <Title title="Departamentos Fincas" subtitle="Listado de departamentos de fincas" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterDrawer
          fields={[
            { name: 'dept_name', label: 'Nombre', placeholder: 'Buscar por nombre' },
          ]}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

        <CustomFilledButton
          label="Crear Departamento"
          type="button"
          icon={<PlusIcon className="text-white" />}
          onClick={() => navigate('/departamentos-fincas/crear')}
        />
      </div>

      {isLoading && <LoadingData />}

      {data && (
        <>
          <Table>
            <Thead>
              <Th text="Código" />
              <Th text="Nombre" />
              <Th text="Acciones" />
            </Thead>

            <Tbody>
              {data.data.map(department => (
                <Tr key={department.id}>
                  <Td>{department.dept_code}</Td>
                  <Td>{department.dept_name}</Td>
                  <Td>
                    <ActionsMenu
                      items={[
                        { label: 'Ver', icon: <EyeIcon />, onClick: () => navigate(`/departamentos-fincas/${department.id}`) },
                        { label: 'Editar', icon: <EditIcon />, onClick: () => navigate(`/departamentos-fincas/${department.id}/editar`) },
                      ]}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {data.data.length === 0 && (
            <p className="text-center text-sm text-slate-500 dark:text-gray-400">No se encontraron departamentos</p>
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
