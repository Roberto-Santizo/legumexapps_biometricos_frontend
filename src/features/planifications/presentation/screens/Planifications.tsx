import { ActionsMenu, CustomFilledButton, FilterDrawer, LoadingData, Modal, Pagination, Table, Tbody, Td, Th, Thead, Title, Tr, useNotification, usePagination } from "@/features/shared/shared";
import { CreatePlanificationForm, PlanificationCountsBar, formatWeekRange, planificationsRepositoryProvider } from "@/features/planifications/planifications";
import { EyeIcon, PlusIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function Planifications() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notification = useNotification();
  const [modal, setModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, rowsPerPage } = usePagination(searchParams);
  const year = searchParams.get('year') ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['getPlanifications', page, rowsPerPage, year],
    queryFn: () => planificationsRepositoryProvider.getPlanifications(page, rowsPerPage, { year })
  });

  const { mutate } = useMutation({
    mutationFn: (id: string) => planificationsRepositoryProvider.deletePlanification(id),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getPlanifications'] });
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  const handleDelete = (id: string, week: number) => notification.question(
    `¿Desea eliminar la planificación de la semana ${week}?`,
    'Eliminar',
    'Solo se pueden eliminar semanas sin tareas',
    () => mutate(id)
  );

  return (
    <div className="space-y-5">
      <Title title="Planificaciones" subtitle="Semanas de altas, movimientos y bajas programadas en ZKBioAccess" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterDrawer
          fields={[
            { name: 'year', label: 'Año', placeholder: 'Ej. 2026', type: 'number' },
          ]}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

        <CustomFilledButton
          label="Nueva planificación"
          type="button"
          icon={<PlusIcon className="text-white" />}
          onClick={() => setModal(true)}
        />
      </div>

      {isLoading && <LoadingData />}

      {data && (
        <>
          <Table>
            <Thead>
              <Th text="Semana" />
              <Th text="Lunes – domingo" />
              <Th text="Tareas" />
              <Th text="Estado" />
              <Th text="Creada por" />
              <Th text="Acciones" />
            </Thead>

            <Tbody>
              {data.data.map(planification => (
                <Tr key={planification.id}>
                  <Td>
                    <span className="font-semibold tabular-nums">Semana {planification.week}</span>
                    <span className="text-slate-500 dark:text-gray-400"> · {planification.year}</span>
                  </Td>
                  <Td>{formatWeekRange(planification)}</Td>
                  <Td>
                    <span className="tabular-nums">
                      {planification.counts.total}
                      {planification.counts.total > 0 && (
                        <span className="text-slate-500 dark:text-gray-400">
                          {' '}({planification.counts.by_type.alta} altas · {planification.counts.by_type.movimiento} mov. · {planification.counts.by_type.baja} bajas)
                        </span>
                      )}
                    </span>
                  </Td>
                  <Td><PlanificationCountsBar counts={planification.counts} /></Td>
                  <Td>{planification.created_by}</Td>
                  <Td>
                    <ActionsMenu
                      items={[
                        { label: 'Ver', icon: <EyeIcon />, onClick: () => navigate(`/planificaciones/${planification.id}`) },
                        // El backend no permite eliminar semanas con tareas
                        { label: 'Eliminar', icon: <Trash2 />, disabled: planification.counts.total > 0, onClick: () => handleDelete(planification.id, planification.week), destructive: true },
                      ]}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {data.data.length === 0 && (
            <p className="text-center text-sm text-slate-500 dark:text-gray-400">No se encontraron planificaciones</p>
          )}

          <Pagination
            count={data.total}
            page={page}
            rowsPerPage={rowsPerPage}
            setSearchParams={setSearchParams}
          />
        </>
      )}

      <Modal modal={modal} closeModal={() => setModal(false)} title="Nueva planificación semanal" width="sm:max-w-md">
        <CreatePlanificationForm onCreated={(planification) => navigate(`/planificaciones/${planification.id}`)} />
      </Modal>
    </div>
  )
}
