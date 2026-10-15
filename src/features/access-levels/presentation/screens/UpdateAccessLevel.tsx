import { CustomFilledButton, Spinner, Title, useNotification } from "@/features/shared/shared";
import { Form, accessLevelsRepositoryProvider, type AccessLevelForm } from "@/features/access-levels/access-levels";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export function UpdateAccessLevel() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notification = useNotification();
  const id = params.id!;

  const { data, isLoading } = useQuery({
    queryKey: ['getAccessLevelById', id],
    queryFn: () => accessLevelsRepositoryProvider.getAccessLevelById(id)
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm<AccessLevelForm>();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: AccessLevelForm) => accessLevelsRepositoryProvider.updateAccessLevelById(payload, id),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getAccessLevels'] });
      queryClient.invalidateQueries({ queryKey: ['getAccessLevelById', id] });
      queryClient.invalidateQueries({ queryKey: ['getLevelDoors', id] });
      navigate(`/niveles-acceso/${id}`);
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  useEffect(() => {
    if (data) {
      reset({ name: data.name });
    }
  }, [data, reset]);

  const onSubmit = (payload: AccessLevelForm) => mutate({ name: payload.name.trim() });

  if (isLoading) return <Spinner />
  if (data) return (
    <div className="space-y-5">
      <Title title="Actualización de nivel de acceso" subtitle="Actualización de información relacionada a nivel de acceso" />

      <form className="form w-full mx-auto lg:w-2/3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form register={register} errors={errors} />

        <CustomFilledButton label="Guardar Cambios" type="submit" fullWitdh={true} disabled={isPending} />
      </form>
    </div>
  )
}
