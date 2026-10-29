import { CustomFilledButton, Spinner, Title, useNotification } from "@/features/shared/shared";
import { Form, emptyEmployeeForm, employeeFullName, employeesRepositoryProvider, toUpdateEmployeePayload, type EmployeeForm, type UpdateEmployeePayload } from "@/features/employees/employees";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export function UpdateEmployee() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notification = useNotification();
  const id = params.id!;

  const { data, isLoading } = useQuery({
    queryKey: ['getEmployeeById', id],
    queryFn: () => employeesRepositoryProvider.getEmployeeById(id)
  });

  const { data: levels, isLoading: isLoadingLevels } = useQuery({
    queryKey: ['getEmployeeLevels', id],
    queryFn: () => employeesRepositoryProvider.getEmployeeLevels(id)
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm<EmployeeForm>({ defaultValues: emptyEmployeeForm });

  // PATCH /employees/:id; el PIN no es editable y no se envía
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: UpdateEmployeePayload) => employeesRepositoryProvider.updateEmployeeById(payload, id),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getEmployees'] });
      queryClient.invalidateQueries({ queryKey: ['getEmployeeById', id] });
      queryClient.invalidateQueries({ queryKey: ['getEmployeeLevels', id] });
      queryClient.invalidateQueries({ queryKey: ['getPositions'] });
      navigate(`/empleados/${id}`);
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  useEffect(() => {
    if (data && levels) {
      reset({
        ...emptyEmployeeForm,
        name: data.name,
        lastName: data.last_name ?? '',
        pin: data.pin,
        deptCode: data.departmentCode ?? '',
        position_id: data.position_id ?? '',
        // Solo se permite un nivel: se preselecciona el primero asignado
        accLevelIds: levels[0]?.level_id ?? ''
      });
    }
  }, [data, levels, reset]);

  const onSubmit = (form: EmployeeForm) => mutate(toUpdateEmployeePayload(form));

  if (isLoading || isLoadingLevels) return <Spinner />
  if (data && levels) return (
    <div className="space-y-5">
      <Title title="Actualización de empleado" subtitle={`${employeeFullName(data)} · PIN ${data.pin}`} />

      <form className="form w-full mx-auto lg:w-2/3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form register={register} errors={errors} isEdit={true} currentPositionId={data.position_id} />

        <CustomFilledButton label="Guardar Cambios" type="submit" fullWitdh={true} disabled={isPending} />
      </form>
    </div>
  )
}
