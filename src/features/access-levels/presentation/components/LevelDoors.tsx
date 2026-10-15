import { CustomFilledButton, LoadingData, Modal, Table, Tbody, Td, Th, Thead, Tr, useNotification } from "@/features/shared/shared";
import { AssignDoorForm, accessLevelsRepositoryProvider } from "@/features/access-levels/access-levels";
import { DoorOpen, PlusIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Props = {
  levelId: string;
}

export function LevelDoors({ levelId }: Props) {
  const notification = useNotification();
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(false);

  const { data: levelDoors, isLoading } = useQuery({
    queryKey: ['getLevelDoors', levelId],
    queryFn: () => accessLevelsRepositoryProvider.getLevelDoors(levelId)
  });

  const { data: doors } = useQuery({
    queryKey: ['getDoors'],
    queryFn: () => accessLevelsRepositoryProvider.getDoors(),
    enabled: modal
  });

  const { mutate, isPending, variables } = useMutation({
    mutationFn: (id: string) => accessLevelsRepositoryProvider.removeDoorFromLevel(id),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getLevelDoors', levelId] });
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  // getLevelDoors no devuelve el ID de la puerta: se excluyen las ya asignadas por dispositivo
  const assignedDevices = new Set(levelDoors?.map(door => door.dev_id));
  const availableDoors = doors?.filter(door => !assignedDevices.has(door.dev_id));

  const handleRemove = (id: string, alias: string) => notification.question(
    `¿Desea quitar la puerta ${alias} del nivel?`,
    'Quitar',
    'Los empleados con este nivel dejarán de tener acceso por esta puerta',
    () => mutate(id)
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-slate-800 dark:text-gray-100">
          <DoorOpen size={20} />
          <h2 className="text-xl font-semibold">Puertas asignadas</h2>
        </div>

        <CustomFilledButton
          label="Asignar Puerta"
          type="button"
          icon={<PlusIcon className="text-white" />}
          onClick={() => setModal(true)}
        />
      </div>

      {isLoading && <LoadingData />}

      {levelDoors && (
        <>
          <Table>
            <Thead>
              <Th text="Dispositivo" />
              <Th text="ID dispositivo" />
              <Th text="Acciones" />
            </Thead>

            <Tbody>
              {levelDoors.map(door => (
                <Tr key={door.id}>
                  <Td>{door.dev_alias}</Td>
                  <Td>{door.dev_id}</Td>
                  <Td>
                    <button
                      type="button"
                      aria-label={`Quitar puerta ${door.dev_alias}`}
                      disabled={isPending && variables === door.id}
                      onClick={() => handleRemove(door.id, door.dev_alias)}
                      className="grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100 active:scale-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-500/15 dark:text-red-400 dark:hover:bg-red-500/25"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {levelDoors.length === 0 && (
            <p className="text-center text-sm text-slate-500 dark:text-gray-400">Este nivel no tiene puertas asignadas</p>
          )}
        </>
      )}

      <Modal modal={modal} closeModal={() => setModal(false)} title="Asignar puerta" width="sm:max-w-lg">
        {availableDoors ? (
          <AssignDoorForm levelId={levelId} doors={availableDoors} onAssigned={() => setModal(false)} />
        ) : (
          <LoadingData />
        )}
      </Modal>
    </section>
  )
}
