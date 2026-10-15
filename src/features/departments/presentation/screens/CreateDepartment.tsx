import { CustomFilledButton, Title, useNotification } from "@/features/shared/shared";
import { type DepartmentForm, Form, departmentsRepositoryProvider } from "@/features/departments/departments";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function CreateDepartment() {
  const notification = useNotification();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<DepartmentForm>();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: DepartmentForm) => departmentsRepositoryProvider.createDepartment(payload),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getDepartments'] });
      navigate('/departamentos');
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  const onSubmit = (payload: DepartmentForm) => mutate(payload);

  return (
    <div className="space-y-5">
      <Title title="Creación de Departamento" subtitle="Formulario para creación de un nuevo departamento" />

      <form className="form w-full mx-auto lg:w-2/3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form register={register} errors={errors} />

        <CustomFilledButton label="Crear Departamento" type="submit" fullWitdh={true} disabled={isPending} />
      </form>
    </div>
  )
}
