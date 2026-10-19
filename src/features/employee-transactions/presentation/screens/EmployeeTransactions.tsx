import { CustomFilledButton, FilterDrawer, LoadingData, Modal, Pagination, Table, Tbody, Td, Th, Thead, Title, Tr, usePagination } from "@/features/shared/shared";
import { FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { employeeTransactionsRepositoryProvider, TransactionsReportForm, type EmployeeTransactionsFilters } from "@/features/employee-transactions/employee-transactions";

const formatDate = (value?: string | null) => value ? new Date(value).toLocaleString('es-GT') : '—';

const FILTER_KEYS = ['pin', 'name', 'last_name', 'dept_code', 'dept_name', 'event_time'] as const;

export function EmployeeTransactions() {
  const [modal, setModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, rowsPerPage } = usePagination(searchParams);
  const filters: EmployeeTransactionsFilters = Object.fromEntries(FILTER_KEYS.map(key => [key, searchParams.get(key) ?? '']));

  const { data, isLoading } = useQuery({
    queryKey: ['getEmployeeTransactions', page, rowsPerPage, filters],
    queryFn: () => employeeTransactionsRepositoryProvider.getEmployeeTransactions(page, rowsPerPage, filters)
  });

  return (
    <div className="space-y-5">
      <Title title="Transacciones de empleados" subtitle="Marcajes registrados en los dispositivos de ZKBioAccess" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterDrawer
          fields={[
            { name: 'pin', label: 'Código', placeholder: 'Buscar por código de empleado' },
            { name: 'name', label: 'Nombre', placeholder: 'Buscar por nombre' },
            { name: 'last_name', label: 'Posición', placeholder: 'Buscar por posición' },
            { name: 'dept_code', label: 'Código de departamento', placeholder: 'Buscar por código' },
            { name: 'dept_name', label: 'Departamento', placeholder: 'Buscar por departamento' },
            { name: 'event_time', label: 'Fecha del marcaje', type: 'date' },
          ]}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

        <CustomFilledButton
          label="Generar reporte"
          type="button"
          icon={<FileSpreadsheet className="h-4 w-4 text-white" />}
          onClick={() => setModal(true)}
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
              <Th text="Dispositivo" />
              <Th text="Marcaje" />
            </Thead>

            <Tbody>
              {data.data.map(transaction => (
                <Tr key={transaction.id}>
                  <Td>{transaction.pin}</Td>
                  <Td>{transaction.name}</Td>
                  <Td>{transaction.last_name || '—'}</Td>
                  <Td>{transaction.dept_name || '—'}</Td>
                  <Td>{transaction.dev_alias || '—'}</Td>
                  <Td>{formatDate(transaction.event_time)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {data.data.length === 0 && (
            <p className="text-center text-sm text-slate-500 dark:text-gray-400">No se encontraron transacciones</p>
          )}

          <Pagination
            count={data.total}
            page={page}
            rowsPerPage={rowsPerPage}
            setSearchParams={setSearchParams}
          />
        </>
      )}

      <Modal modal={modal} closeModal={() => setModal(false)} title="Reporte de marcajes" width="sm:max-w-lg">
        <TransactionsReportForm onGenerated={() => setModal(false)} />
      </Modal>
    </div>
  )
}
