import { CustomFilledButton, Title, useNotification } from "@/features/shared/shared";
import { type PositionForm, Form, positionsRepositoryProvider } from "@/features/positions/positions";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function CreatePosition() {
  const notification = useNotification();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<PositionForm>();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: PositionForm) => positionsRepositoryProvider.createPosition(payload),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getPositions'] });
      navigate('/posiciones');
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  const onSubmit = (payload: PositionForm) => mutate(payload);

  return (
    <div className="space-y-5">
      <Title title="Creación de Posición" subtitle="Formulario para creación de una nueva posición" />

      <form className="form w-full mx-auto lg:w-2/3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form register={register} errors={errors} />

        <CustomFilledButton label="Crear Posición" type="submit" fullWitdh={true} disabled={isPending} />
      </form>
    </div>
  )
}
