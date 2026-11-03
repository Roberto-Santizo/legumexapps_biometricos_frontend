import { ActionsMenu, CustomFilledButton, FilterDrawer, LoadingData, Pagination, Table, Tbody, Td, Th, Thead, Title, Tr, usePagination } from "@/features/shared/shared";
import { EditIcon, EyeIcon, PlusIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PermissionStatusBadge, employeePermissionsRepositoryProvider, formatPermissionDate, permissionTypeLabels, permissionTypeOptions, salaryStatusLabels, salaryStatusOptions } from "@/features/employee-permissions/employee-permissions";

const FILTERS = ['employee_name', 'employee_pin', 'substitute_pin', 'folio', 'date', 'type', 'salary_status', 'hr_signed'] as const;

export function EmployeePermissions() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, rowsPerPage } = usePagination(searchParams);
  const filters = Object.fromEntries(FILTERS.map(name => [name, searchParams.get(name) ?? '']));

  const { data, isLoading } = useQuery({
    queryKey: ['getPermissions', page, rowsPerPage, ...Object.values(filters)],
    queryFn: () => employeePermissionsRepositoryProvider.getPermissions(page, rowsPerPage, filters)
  });

  return (
    <div className="space-y-5">
      <Title title="Permisos de empleados" subtitle="Control de ausencias; un permiso es válido cuando tiene el Vo.Bo. de RRHH" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterDrawer
          fields={[
            { name: 'employee_name', label: 'Trabajador', placeholder: 'Buscar por nombre' },
            { name: 'employee_pin', label: 'Código del trabajador', placeholder: 'Buscar por código' },
            { name: 'substitute_pin', label: 'Código del comodín', placeholder: 'Buscar por código' },
            { name: 'folio', label: 'Folio', placeholder: 'Folio exacto', type: 'number' },
            { name: 'date', label: 'Día del permiso', type: 'date' },
            { name: 'type', label: 'Tipo de permiso', options: permissionTypeOptions },
            { name: 'salary_status', label: 'Salario', options: salaryStatusOptions },
            {
              name: 'hr_signed',
              label: 'Vo.Bo. RRHH',
              options: [
                { value: 'true', label: 'Firmados (válidos)' },
                { value: 'false', label: 'Pendientes de firma' }
              ]
            },
          ]}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

        <CustomFilledButton
          label="Crear Permiso"
          type="button"
          icon={<PlusIcon className="text-white" />}
          onClick={() => navigate('/permisos/crear')}
        />
      </div>

      {isLoading && <LoadingData />}

      {data && (
        <>
          <Table>
            <Thead>
              <Th text="Folio" />
              <Th text="Fecha" />
              <Th text="Trabajador" />
              <Th text="Tipo" />
              <Th text="Salario" />
              <Th text="Turno" />
              <Th text="Estado" />
              <Th text="Acciones" />
            </Thead>

            <Tbody>
              {data.data.map(permission => (
                <Tr key={permission.id}>
                  <Td>{permission.folio}</Td>
                  <Td>{formatPermissionDate(permission.date)}</Td>
                  <Td>
                    <span className="block">{permission.employee.name}</span>
                    <span className="block text-xs text-slate-500 dark:text-gray-400">{permission.employee.pin}</span>
                  </Td>
                  <Td>{permissionTypeLabels[permission.type]}</Td>
                  <Td>{salaryStatusLabels[permission.salary_status]}</Td>
                  <Td>{permission.shift_start} – {permission.shift_end}</Td>
                  <Td><PermissionStatusBadge isValid={permission.is_valid} /></Td>
                  <Td>
                    <ActionsMenu
                      items={[
                        { label: 'Ver', icon: <EyeIcon />, onClick: () => navigate(`/permisos/${permission.id}`) },
                        // Con la firma de RRHH el permiso ya no se puede editar
                        ...(permission.is_valid ? [] : [
                          { label: 'Editar', icon: <EditIcon />, onClick: () => navigate(`/permisos/${permission.id}/editar`) }
                        ]),
                      ]}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {data.data.length === 0 && (
            <p className="text-center text-sm text-slate-500 dark:text-gray-400">No se encontraron permisos</p>
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
