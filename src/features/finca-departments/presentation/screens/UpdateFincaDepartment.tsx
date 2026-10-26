import { CustomFilledButton, Spinner, Title, useNotification } from "@/features/shared/shared";
import { Form, fincaDepartmentsRepositoryProvider, type FincaDepartmentForm } from "@/features/finca-departments/finca-departments";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export function UpdateFincaDepartment() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notification = useNotification();
  const id = params.id!;

  const { data, isLoading } = useQuery({
    queryKey: ['getFincaDepartmentById', id],
    queryFn: () => fincaDepartmentsRepositoryProvider.getFincaDepartmentById(id)
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm<FincaDepartmentForm>();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: FincaDepartmentForm) => fincaDepartmentsRepositoryProvider.updateFincaDepartmentById(payload, id),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getFincaDepartments'] });
      queryClient.invalidateQueries({ queryKey: ['getFincaDepartmentById', id] });
      navigate('/departamentos-fincas');
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  useEffect(() => {
    if (data) {
      const { dept_code, dept_name } = data;
      reset({ dept_code, dept_name });
    }
  }, [data, reset]);

  const onSubmit = (payload: FincaDepartmentForm) => mutate(payload);

  if (isLoading) return <Spinner />
  if (data) return (
    <div className="space-y-5">
      <Title title="Actualización de departamento de finca" subtitle="Actualización de información relacionada a departamento de finca" />

      <form className="form w-full mx-auto lg:w-2/3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form register={register} errors={errors} />

        <CustomFilledButton label="Guardar Cambios" type="submit" fullWitdh={true} disabled={isPending} />
      </form>
    </div>
  )
}
