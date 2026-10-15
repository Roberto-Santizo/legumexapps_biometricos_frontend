import { CustomFilledButton, Title, useNotification } from "@/features/shared/shared";
import { type AccessLevelForm, Form, accessLevelsRepositoryProvider } from "@/features/access-levels/access-levels";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function CreateAccessLevel() {
  const notification = useNotification();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<AccessLevelForm>();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: AccessLevelForm) => accessLevelsRepositoryProvider.createAccessLevel(payload),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getAccessLevels'] });
      navigate('/niveles-acceso');
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  const onSubmit = (payload: AccessLevelForm) => mutate({ name: payload.name.trim() });

  return (
    <div className="space-y-5">
      <Title title="Creación de Nivel de Acceso" subtitle="Formulario para creación de un nuevo nivel de acceso" />

      <form className="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form register={register} errors={errors} />

        <CustomFilledButton label="Crear Nivel de Acceso" type="submit" fullWitdh={true} disabled={isPending} />
      </form>
    </div>
  )
}
