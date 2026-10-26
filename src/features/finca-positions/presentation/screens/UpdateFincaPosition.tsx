import { CustomFilledButton, Spinner, Title, useNotification } from "@/features/shared/shared";
import { Form, fincaPositionsRepositoryProvider, type FincaPositionForm } from "@/features/finca-positions/finca-positions";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export function UpdateFincaPosition() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notification = useNotification();
  const id = params.id!;

  const { data, isLoading } = useQuery({
    queryKey: ['getFincaPositionById', id],
    queryFn: () => fincaPositionsRepositoryProvider.getFincaPositionById(id)
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm<FincaPositionForm>();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: FincaPositionForm) => fincaPositionsRepositoryProvider.updateFincaPositionById(payload, id),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getFincaPositions'] });
      queryClient.invalidateQueries({ queryKey: ['getFincaPositionById', id] });
      navigate('/posiciones-fincas');
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  useEffect(() => {
    if (data) {
      const { position_code, position_name } = data;
      reset({ position_code, position_name });
    }
  }, [data, reset]);

  const onSubmit = (payload: FincaPositionForm) => mutate(payload);

  if (isLoading) return <Spinner />
  if (data) return (
    <div className="space-y-5">
      <Title title="Actualización de posición de finca" subtitle="Actualización de información relacionada a la posición de finca" />

      <form className="form w-full mx-auto lg:w-2/3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form register={register} errors={errors} />

        <CustomFilledButton label="Guardar Cambios" type="submit" fullWitdh={true} disabled={isPending} />
      </form>
    </div>
  )
}
