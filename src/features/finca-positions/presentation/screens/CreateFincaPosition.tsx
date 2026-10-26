import { CustomFilledButton, Title, useNotification } from "@/features/shared/shared";
import { type FincaPositionForm, Form, fincaPositionsRepositoryProvider } from "@/features/finca-positions/finca-positions";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function CreateFincaPosition() {
  const notification = useNotification();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<FincaPositionForm>();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: FincaPositionForm) => fincaPositionsRepositoryProvider.createFincaPosition(payload),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getFincaPositions'] });
      navigate('/posiciones-fincas');
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  const onSubmit = (payload: FincaPositionForm) => mutate(payload);

  return (
    <div className="space-y-5">
      <Title title="Creación de Posición de Finca" subtitle="Formulario para creación de una nueva posición de finca" />

      <form className="form w-full mx-auto lg:w-2/3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form register={register} errors={errors} />

        <CustomFilledButton label="Crear Posición" type="submit" fullWitdh={true} disabled={isPending} />
      </form>
    </div>
  )
}
