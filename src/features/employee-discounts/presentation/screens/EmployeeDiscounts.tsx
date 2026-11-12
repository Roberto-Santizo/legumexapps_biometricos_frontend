import { ActionsMenu, CustomFilledButton, FilterDrawer, LoadingData, Modal, Pagination, Table, Tbody, Td, Th, Thead, Title, Tr, usePagination } from "@/features/shared/shared";
import { EditIcon, EyeIcon, FileSpreadsheet, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DiscountAmount, DiscountEmployee, DiscountsReportForm, employeeDiscountsRepositoryProvider, formatDiscountDate } from "@/features/employee-discounts/employee-discounts";

const FILTERS = ['code', 'date'] as const;

export function EmployeeDiscounts() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, rowsPerPage } = usePagination(searchParams);
  const filters = Object.fromEntries(FILTERS.map(name => [name, searchParams.get(name) ?? '']));

  const { data, isLoading } = useQuery({
    queryKey: ['getDiscounts', page, rowsPerPage, ...Object.values(filters)],
    queryFn: () => employeeDiscountsRepositoryProvider.getDiscounts(page, rowsPerPage, filters)
  });

  return (
    <div className="space-y-5">
      <Title title="Descuentos de empleados" subtitle="Montos descontados a cada trabajador" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterDrawer
          fields={[
            { name: 'code', label: 'Código del trabajador', placeholder: 'Buscar por código' },
            { name: 'date', label: 'Fecha del descuento', type: 'date' },
          ]}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <CustomFilledButton
            label="Generar reporte"
            type="button"
            icon={<FileSpreadsheet className="h-4 w-4 text-white" />}
            onClick={() => setModal(true)}
          />
          <CustomFilledButton
            label="Crear Descuento"
            type="button"
            icon={<PlusIcon className="text-white" />}
            onClick={() => navigate('/descuentos/crear')}
          />
        </div>
      </div>

      {isLoading && <LoadingData />}

      {data && (
        <>
          <Table>
            <Thead>
              <Th text="Trabajador" />
              <Th text="Fecha" />
              <Th text="Monto descontado" />
              <Th text="Acciones" />
            </Thead>

            <Tbody>
              {data.data.map(discount => (
                <Tr key={discount.id}>
                  <Td><DiscountEmployee pin={discount.code} /></Td>
                  <Td><span className="tabular-nums">{formatDiscountDate(discount.date)}</span></Td>
                  <Td><DiscountAmount amount={discount.amount} /></Td>
                  <Td>
                    <ActionsMenu
                      items={[
                        { label: 'Ver', icon: <EyeIcon />, onClick: () => navigate(`/descuentos/${discount.id}`) },
                        { label: 'Editar', icon: <EditIcon />, onClick: () => navigate(`/descuentos/${discount.id}/editar`) },
                      ]}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {data.data.length === 0 && (
            <p className="text-center text-sm text-slate-500 dark:text-gray-400">No se encontraron descuentos</p>
          )}

          <Pagination
            count={data.total}
            page={page}
            rowsPerPage={rowsPerPage}
            setSearchParams={setSearchParams}
          />
        </>
      )}

      <Modal modal={modal} closeModal={() => setModal(false)} title="Reporte de descuentos" width="sm:max-w-lg">
        <DiscountsReportForm onGenerated={() => setModal(false)} />
      </Modal>
    </div>
  )
}
