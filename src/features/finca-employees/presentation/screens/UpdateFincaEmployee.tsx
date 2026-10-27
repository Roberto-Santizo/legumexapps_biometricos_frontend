import { CustomFilledButton, Spinner, Title, useNotification } from "@/features/shared/shared";
import { type FincaEmployeeForm, type UpdateFincaEmployeePayload, Form, fincaEmployeesRepositoryProvider, toFincaEmployeeForm, toFincaEmployeePayload } from "@/features/finca-employees/finca-employees";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export function UpdateFincaEmployee() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notification = useNotification();
  const id = params.id!;

  const { data, isLoading } = useQuery({
    queryKey: ['getFincaEmployeeById', id],
    queryFn: () => fincaEmployeesRepositoryProvider.getFincaEmployeeById(id)
  });

  // Mismo catálogo (y query key) que usa el formulario, para marcar las áreas asignadas
  const { data: areas } = useQuery({
    queryKey: ['getFincaAreas'],
    queryFn: () => fincaEmployeesRepositoryProvider.getFincaAreas()
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm<FincaEmployeeForm>();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: UpdateFincaEmployeePayload) => fincaEmployeesRepositoryProvider.updateFincaEmployeeById(payload, id),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getFincaEmployees'] });
      queryClient.invalidateQueries({ queryKey: ['getFincaEmployeeById', id] });
      navigate(`/empleados-fincas/${id}`);
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  useEffect(() => {
    if (data && areas) {
      reset(toFincaEmployeeForm(data, areas));
    }
  }, [data, areas, reset]);

  const onSubmit = (form: FincaEmployeeForm) => mutate(toFincaEmployeePayload(form));

  if (isLoading || (data && !areas)) return <Spinner />
  if (data) return (
    <div className="space-y-5">
      <Title title="Actualización de Empleado de Finca" subtitle={`Código de empleado ${data.emp_code}`} />

      <form className="form w-full mx-auto lg:w-2/3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form register={register} errors={errors} />

        <CustomFilledButton label="Guardar Cambios" type="submit" fullWitdh={true} disabled={isPending} loading={isPending} />
      </form>
    </div>
  )
}
