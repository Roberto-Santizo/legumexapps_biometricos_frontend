import { CustomFilledButton, Spinner, Title, useNotification } from "@/features/shared/shared";
import { Form, positionsRepositoryProvider, type PositionForm } from "@/features/positions/positions";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export function UpdatePosition() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notification = useNotification();
  const id = params.id!;

  const { data, isLoading } = useQuery({
    queryKey: ['getPositionById', id],
    queryFn: () => positionsRepositoryProvider.getPositionById(id)
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm<PositionForm>();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: PositionForm) => positionsRepositoryProvider.updatePositionById(payload, id),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getPositions'] });
      queryClient.invalidateQueries({ queryKey: ['getPositionById', id] });
      navigate('/posiciones');
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  useEffect(() => {
    if (data) {
      const { code, name } = data;
      reset({ code, name });
    }
  }, [data, reset]);

  const onSubmit = (payload: PositionForm) => mutate(payload);

  if (isLoading) return <Spinner />
  if (data) return (
    <div className="space-y-5">
      <Title title="Actualización de posición" subtitle="Actualización de información relacionada a la posición" />

      <form className="form w-full mx-auto lg:w-2/3" noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* El backend no permite editar posiciones con un empleado asignado */}
        {data.employee && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            Esta posición tiene un empleado asignado y no puede actualizarse.
          </p>
        )}

        <Form register={register} errors={errors} />

        <CustomFilledButton label="Guardar Cambios" type="submit" fullWitdh={true} disabled={isPending || !!data.employee} />
      </form>
    </div>
  )
}
