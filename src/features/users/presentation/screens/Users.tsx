import { ActionsMenu, CustomFilledButton, FilterDrawer, LoadingData, Pagination, Table, Tbody, Td, Th, Thead, Title, Tr, usePagination } from "@/features/shared/shared";
import { EditIcon, EyeIcon, PlusIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { roleLabel, UserStatusBadge, usersRepositoryProvider } from "@/features/users/users";

export function Users() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, rowsPerPage } = usePagination(searchParams);
  const name = searchParams.get('name') ?? '';
  const email = searchParams.get('email') ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['getUsers', page, rowsPerPage, name, email],
    queryFn: () => usersRepositoryProvider.getUsers(page, rowsPerPage, { name, email })
  });

  // El backend no devuelve el total: si la página viene incompleta es la última
  const count = data && data.length < rowsPerPage ? page * rowsPerPage + data.length : -1;

  return (
    <div className="space-y-5">
      <Title title="Usuarios" subtitle="Listado de usuarios" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterDrawer
          fields={[
            { name: 'name', label: 'Nombre', placeholder: 'Buscar por nombre' },
            { name: 'email', label: 'Correo electrónico', placeholder: 'Buscar por correo' },
          ]}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

        <CustomFilledButton
          label="Crear Usuario"
          type="button"
          icon={<PlusIcon className="text-white" />}
          onClick={() => navigate('/usuarios/crear')}
        />
      </div>

      {isLoading && <LoadingData />}

      {data && (
        <>
          <Table>
            <Thead>
              <Th text="Nombre" />
              <Th text="Correo Electrónico" />
              <Th text="Roles" />
              <Th text="Estado" />
              <Th text="Acciones" />
            </Thead>

            <Tbody>
              {data.map(user => (
                <Tr key={user.id}>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.roles.map(roleLabel).join(', ')}</Td>
                  <Td><UserStatusBadge isActive={user.isActive} /></Td>
                  <Td>
                    <ActionsMenu
                      items={[
                        { label: 'Ver', icon: <EyeIcon />, onClick: () => navigate(`/usuarios/${user.id}`) },
                        { label: 'Editar', icon: <EditIcon />, onClick: () => navigate(`/usuarios/${user.id}/editar`) },
                      ]}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {data.length === 0 && (
            <p className="text-center text-sm text-slate-500 dark:text-gray-400">No se encontraron usuarios</p>
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
