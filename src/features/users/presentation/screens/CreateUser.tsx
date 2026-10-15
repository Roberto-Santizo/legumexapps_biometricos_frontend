import { CustomFilledButton, Title, useNotification } from "@/features/shared/shared";
import { type UserForm, Form, usersRepositoryProvider } from "@/features/users/users";
import { ValidRoles } from "@/features/auth/auth";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function CreateUser() {
  const notification = useNotification();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<UserForm>({ defaultValues: { roles: [ValidRoles.user] } });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: UserForm) => usersRepositoryProvider.createUser(payload),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getUsers'] });
      navigate('/usuarios');
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  const onSubmit = (payload: UserForm) => mutate(payload);

  return (
    <div className="space-y-5">
      <Title title="Creación de Usuario" subtitle="Formulario para creación de un nuevo usuario" />

      <form className="form w-full mx-auto lg:w-2/3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form register={register} errors={errors} />

        <CustomFilledButton label="Crear Usuario" type="submit" fullWitdh={true} disabled={isPending} />
      </form>
    </div>
  )
}
