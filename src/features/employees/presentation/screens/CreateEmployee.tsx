import { CustomFilledButton, Title, useNotification } from "@/features/shared/shared";
import { type EmployeeForm, type EmployeePayload, Form, PhotoFormField, emptyEmployeeForm, employeesRepositoryProvider, toEmployeePayload } from "@/features/employees/employees";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function CreateEmployee() {
  const notification = useNotification();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors }
  } = useForm<EmployeeForm>({ defaultValues: emptyEmployeeForm });

  // POST /employees es multipart y exige la fotografía; ZKBioAccess la rechaza si no detecta el rostro
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: EmployeePayload) => employeesRepositoryProvider.saveEmployee(payload),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getEmployees'] });
      navigate('/empleados');
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  const onSubmit = (form: EmployeeForm) => mutate(toEmployeePayload(form));

  return (
    <div className="space-y-5">
      <Title title="Creación de Empleado" subtitle="Si el PIN ya existe en ZKBioAccess, el empleado se actualiza" />

      <form className="form w-full mx-auto lg:w-2/3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form register={register} errors={errors} />

        <PhotoFormField control={control} />

        <CustomFilledButton label="Crear Empleado" type="submit" fullWitdh={true} disabled={isPending} loading={isPending} />
      </form>
    </div>
  )
}
