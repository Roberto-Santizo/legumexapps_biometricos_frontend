import { CustomFilledButton, LoadingData, Modal, Table, Tbody, Td, Th, Thead, Tr, useNotification } from "@/features/shared/shared";
import { AssignAreaForm, fincaEmployeesRepositoryProvider, type FincaEmployeeArea } from "@/features/finca-employees/finca-employees";
import { MapPin, PlusIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Props = {
  employeeId: string;
  areas: FincaEmployeeArea[];
}

export function FincaEmployeeAreas({ employeeId, areas }: Props) {
  const notification = useNotification();
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(false);

  const { data: catalog } = useQuery({
    queryKey: ['getFincaAreas'],
    queryFn: () => fincaEmployeesRepositoryProvider.getFincaAreas(),
    enabled: modal
  });

  const { mutate, isPending, variables } = useMutation({
    mutationFn: (id: string) => fincaEmployeesRepositoryProvider.deleteFincaEmployeeArea(id),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getFincaEmployeeById', employeeId] });
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  // El detalle no devuelve el ID del área: se excluyen las ya asignadas por código
  const assignedCodes = new Set(areas.map(area => area.area_code));
  const availableAreas = catalog?.filter(area => !assignedCodes.has(area.area_code));

  const handleRemove = (id: string, name: string) => notification.question(
    `¿Desea quitar el área ${name} del empleado?`,
    'Quitar',
    'El empleado dejará de estar asignado a esta área',
    () => mutate(id)
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-slate-800 dark:text-gray-100">
          <MapPin size={20} />
          <h2 className="text-xl font-semibold">Áreas asignadas</h2>
        </div>

        <CustomFilledButton
          label="Asignar Área"
          type="button"
          icon={<PlusIcon className="text-white" />}
          onClick={() => setModal(true)}
        />
      </div>

      <Table>
        <Thead>
          <Th text="Área" />
          <Th text="Acciones" />
        </Thead>

        <Tbody>
          {areas.map(area => (
            <Tr key={area.id}>
              <Td>{area.area_name}</Td>
              <Td>
                <button
                  type="button"
                  aria-label={`Quitar área ${area.area_name}`}
                  disabled={isPending && variables === String(area.id)}
                  onClick={() => handleRemove(String(area.id), area.area_name)}
                  className="grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100 active:scale-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-500/15 dark:text-red-400 dark:hover:bg-red-500/25"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {areas.length === 0 && (
        <p className="text-center text-sm text-slate-500 dark:text-gray-400">Este empleado no tiene áreas asignadas</p>
      )}

      <Modal modal={modal} closeModal={() => setModal(false)} title="Asignar área" width="sm:max-w-lg">
        {availableAreas ? (
          <AssignAreaForm employeeId={employeeId} areas={availableAreas} onAssigned={() => setModal(false)} />
        ) : (
          <LoadingData />
        )}
      </Modal>
    </section>
  )
}
