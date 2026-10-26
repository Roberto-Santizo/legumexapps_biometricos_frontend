import { CustomFilledButton, Title, useNotification } from "@/features/shared/shared";
import { type FincaEmployeeForm, type FincaEmployeePayload, Form, emptyFincaEmployeeForm, fincaEmployeesRepositoryProvider, toFincaEmployeePayload } from "@/features/finca-employees/finca-employees";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function CreateFincaEmployee() {
  const notification = useNotification();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<FincaEmployeeForm>({ defaultValues: emptyFincaEmployeeForm });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: FincaEmployeePayload) => fincaEmployeesRepositoryProvider.createFincaEmployee(payload),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getFincaEmployees'] });
      navigate('/empleados-fincas');
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  const onSubmit = (form: FincaEmployeeForm) => mutate(toFincaEmployeePayload(form));

  return (
    <div className="space-y-5">
      <Title title="Creación de Empleado de Finca" subtitle="El código de empleado se asigna automáticamente en BioTime" />

      <form className="form w-full mx-auto lg:w-2/3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form register={register} errors={errors} />

        <CustomFilledButton label="Crear Empleado" type="submit" fullWitdh={true} disabled={isPending} loading={isPending} />
      </form>
    </div>
  )
}
