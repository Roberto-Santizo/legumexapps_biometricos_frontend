import { ActionsMenu, CustomFilledButton, FilterDrawer, LoadingData, Modal, Pagination, Table, Tbody, Td, Th, Thead, Title, Tr, useNotification, usePagination } from "@/features/shared/shared";
import { EditIcon, EyeIcon, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TaskStatusBadge, TaskTypeBadge, tasksRepositoryProvider, UploadTasksForm } from "@/features/tasks/tasks";

export function Tasks() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notification = useNotification();
  const [modal, setModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, rowsPerPage } = usePagination(searchParams);
  const pin = searchParams.get('pin') ?? '';
  const scheduled_at = searchParams.get('scheduled_at') ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['getTasks', page, rowsPerPage, pin, scheduled_at],
    queryFn: () => tasksRepositoryProvider.getTasks(page, rowsPerPage, { pin, scheduled_at })
  });

  const { mutate } = useMutation({
    mutationFn: (id: string) => tasksRepositoryProvider.deleteTask(id),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getTasks'] });
      queryClient.invalidateQueries({ queryKey: ['getPlanifications'] });
      queryClient.invalidateQueries({ queryKey: ['getPlanificationById'] });
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  const handleDelete = (id: string) => notification.question(
    '¿Desea eliminar la tarea?',
    'Eliminar',
    'La tarea dejará de ejecutarse en ZKBioAccess',
    () => mutate(id)
  );

  return (
    <div className="space-y-5">
      <Title title="Tareas programadas" subtitle="Altas, movimientos y bajas pendientes de aplicar en ZKBioAccess" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterDrawer
          fields={[
            { name: 'pin', label: 'PIN', placeholder: 'Buscar por código de empleado' },
            { name: 'scheduled_at', label: 'Fecha programada', type: 'datetime-local' },
          ]}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

        <CustomFilledButton
          label="Cargar Excel"
          type="button"
          icon={<Upload className="h-4 w-4 text-white" />}
          onClick={() => setModal(true)}
        />
      </div>

      {isLoading && <LoadingData />}

      {data && (
        <>
          <Table>
            <Thead>
              <Th text="PIN" />
              <Th text="Tipo" />
              <Th text="Estado" />
              <Th text="Programada para" />
              <Th text="Programada por" />
              <Th text="Acciones" />
            </Thead>

            <Tbody>
              {data.data.map(task => (
                <Tr key={task.id}>
                  <Td>{task.pin}</Td>
                  <Td><TaskTypeBadge type={task.type} /></Td>
                  <Td><TaskStatusBadge status={task.status} /></Td>
                  <Td>{task.scheduled_at}</Td>
                  <Td>{task.created_by}</Td>
                  <Td>
                    <ActionsMenu
                      items={[
                        { label: 'Ver', icon: <EyeIcon />, onClick: () => navigate(`/tareas/${task.id}`) },
                        // Solo las tareas pendientes se pueden editar
                        { label: 'Editar', icon: <EditIcon />, disabled: task.status !== 'pendiente', onClick: () => navigate(`/tareas/${task.id}/editar`) },
                        { label: 'Eliminar', icon: <Trash2 />, onClick: () => handleDelete(task.id), destructive: true },
                      ]}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {data.data.length === 0 && (
            <p className="text-center text-sm text-slate-500 dark:text-gray-400">No se encontraron tareas</p>
          )}

          <Pagination
            count={data.total}
            page={page}
            rowsPerPage={rowsPerPage}
            setSearchParams={setSearchParams}
          />
        </>
      )}

      <Modal modal={modal} closeModal={() => setModal(false)} title="Programar tareas desde Excel" width="sm:max-w-xl">
        <UploadTasksForm onUploaded={() => setModal(false)} />
      </Modal>
    </div>
  )
}
