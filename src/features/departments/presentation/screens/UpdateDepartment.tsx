import { CustomFilledButton, Spinner, Title, useNotification } from "@/features/shared/shared";
import { Form, departmentsRepositoryProvider, type DepartmentForm } from "@/features/departments/departments";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export function UpdateDepartment() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notification = useNotification();
  const id = params.id!;

  const { data, isLoading } = useQuery({
    queryKey: ['getDepartmentById', id],
    queryFn: () => departmentsRepositoryProvider.getDepartmentById(id)
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm<DepartmentForm>();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: DepartmentForm) => departmentsRepositoryProvider.updateDepartmentById(payload, id),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getDepartments'] });
      queryClient.invalidateQueries({ queryKey: ['getDepartmentById', id] });
      navigate('/departamentos');
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

  const onSubmit = (payload: DepartmentForm) => mutate(payload);

  if (isLoading) return <Spinner />
  if (data) return (
    <div className="space-y-5">
      <Title title="Actualización de departamento" subtitle="Actualización de información relacionada a departamento" />

      <form className="form w-full mx-auto lg:w-2/3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form register={register} errors={errors} />

        <CustomFilledButton label="Guardar Cambios" type="submit" fullWitdh={true} disabled={isPending} />
      </form>
    </div>
  )
}
