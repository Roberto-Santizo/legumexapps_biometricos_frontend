import { CustomFilledButton, Spinner, Title, useNotification } from "@/features/shared/shared";
import { Form, usersRepositoryProvider, type UpdateUserForm, type UserForm } from "@/features/users/users";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export function UpdateUser() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notification = useNotification();
  const id = params.id!;

  const { data, isLoading } = useQuery({
    queryKey: ['getUserById', id],
    queryFn: () => usersRepositoryProvider.getUserById(id)
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm<UserForm>();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: UpdateUserForm) => usersRepositoryProvider.updateUserById(payload, id),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getUsers'] });
      queryClient.invalidateQueries({ queryKey: ['getUserById', id] });
      navigate('/usuarios');
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  useEffect(() => {
    if (data) {
      const { name, email, roles } = data;
      reset({ name, email, roles, password: '' });
    }
  }, [data, reset]);

  // La contraseña solo se envía si se escribió una nueva
  const onSubmit = ({ password, ...rest }: UserForm) => mutate(password ? { ...rest, password } : rest);

  if (isLoading) return <Spinner />
  if (data) return (
    <div className="space-y-5">
      <Title title="Actualización de usuario" subtitle="Actualización de información relacionada a usuario" />

      <form className="form w-full mx-auto lg:w-2/3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form register={register} errors={errors} isEdit={true} />

        <CustomFilledButton label="Guardar Cambios" type="submit" fullWitdh={true} disabled={isPending} />
      </form>
    </div>
  )
}
