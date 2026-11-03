import { ActionsMenu, CustomFilledButton, FilterDrawer, LoadingData, Pagination, Table, Tbody, Td, Th, Thead, Title, Tr, usePagination, type SelectOption } from "@/features/shared/shared";
import { EditIcon, EyeIcon, PlusIcon, SmileIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { employeeFullName, employeesRepositoryProvider } from "@/features/employees/employees";
import { departmentsRepositoryProvider } from "@/features/departments/departments";

// Los departamentos se buscan por nombre en el backend en lugar de cargar el catálogo completo
const DEPARTMENTS_SEARCH_LIMIT = 20;

// El filtro auth_dept_id espera el id del departamento (el formulario de empleados usa el código)
const searchDepartments = async (name: string): Promise<SelectOption[]> => {
  const { data } = await departmentsRepositoryProvider.getDepartments(0, DEPARTMENTS_SEARCH_LIMIT, { name });
  return data.map(department => ({ value: department.id, label: `${department.name} (${department.code})` }));
}

export function Employees() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, rowsPerPage } = usePagination(searchParams);
  const name = searchParams.get('name') ?? '';
  const pin = searchParams.get('pin') ?? '';
  const auth_dept_id = searchParams.get('auth_dept_id') ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['getEmployees', page, rowsPerPage, name, pin, auth_dept_id],
    queryFn: () => employeesRepositoryProvider.getEmployees(page, rowsPerPage, { name, pin, auth_dept_id })
  });

  // Etiqueta del chip y del buscador cuando el filtro viene en la URL
  const { data: selectedDepartment } = useQuery({
    queryKey: ['getDepartmentById', auth_dept_id],
    queryFn: () => departmentsRepositoryProvider.getDepartmentById(auth_dept_id),
    enabled: !!auth_dept_id
  });

  return (
    <div className="space-y-5">
      <Title title="Empleados" subtitle="Listado de empleados registrados en ZKBioAccess" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterDrawer
          fields={[
            { name: 'name', label: 'Nombre', placeholder: 'Buscar por nombre' },
            { name: 'pin', label: 'Código', placeholder: 'Buscar por código de empleado' },
            {
              name: 'auth_dept_id',
              label: 'Departamento',
              placeholder: 'Buscar departamento por nombre',
              search: {
                queryKey: ['getDepartments', 'byId'],
                fetchOptions: searchDepartments,
                emptyMessage: 'No se encontraron departamentos'
              },
              valueLabel: selectedDepartment && `${selectedDepartment.name} (${selectedDepartment.code})`
            },
          ]}
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
              <Th text="Código" />
              <Th text="Nombre" />
              <Th text="Posición" />
              <Th text="Departamento" />
              <Th text="Creado por" />
              <Th text="Fotografía" />
              <Th text="Acciones" />
            </Thead>

            <Tbody>
              {data.data.map(employee => (
                <Tr key={employee.id}>
                  <Td>{employee.pin}</Td>
                  <Td>{employeeFullName(employee)}</Td>
                  <Td>{employee.position_id ? employee.position : '—'}</Td>
                  <Td>{employee.department || '—'}</Td>
                  <Td>{employee.createdBy || '—'}</Td>
                  <Td>{employee.hasPhoto ? <SmileIcon className="text-green-500"/> : <SmileIcon className="text-red-500"/>}</Td>
                  <Td>
                    <ActionsMenu
                      items={[
                        { label: 'Ver', icon: <EyeIcon />, onClick: () => navigate(`/empleados/${employee.pin}`) },
                        { label: 'Editar', icon: <EditIcon />, onClick: () => navigate(`/empleados/${employee.pin}/editar`) },
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
