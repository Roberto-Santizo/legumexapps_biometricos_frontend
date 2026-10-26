import { CustomFilledButton, Title, useNotification } from "@/features/shared/shared";
import { type FincaDepartmentForm, Form, fincaDepartmentsRepositoryProvider } from "@/features/finca-departments/finca-departments";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function CreateFincaDepartment() {
  const notification = useNotification();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<FincaDepartmentForm>();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: FincaDepartmentForm) => fincaDepartmentsRepositoryProvider.createFincaDepartment(payload),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getFincaDepartments'] });
      navigate('/departamentos-fincas');
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  const onSubmit = (payload: FincaDepartmentForm) => mutate(payload);

  return (
    <div className="space-y-5">
      <Title title="Creación de Departamento de Finca" subtitle="Formulario para creación de un nuevo departamento de finca" />

      <form className="form w-full mx-auto lg:w-2/3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form register={register} errors={errors} />

        <CustomFilledButton label="Crear Departamento" type="submit" fullWitdh={true} disabled={isPending} />
      </form>
    </div>
  )
}
