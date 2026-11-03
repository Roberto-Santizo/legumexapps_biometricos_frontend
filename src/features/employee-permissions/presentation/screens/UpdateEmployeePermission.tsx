import { CustomFilledButton, Spinner, Title, useNotification } from "@/features/shared/shared";
import { Form, emptyPermissionForm, employeePermissionsRepositoryProvider, toPermissionForm, toUpdatePermissionPayload, type EmployeePermissionForm, type UpdateEmployeePermissionForm } from "@/features/employee-permissions/employee-permissions";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export function UpdateEmployeePermission() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notification = useNotification();
  const id = params.id!;

  const { data, isLoading, error } = useQuery({
    queryKey: ['getPermissionById', id],
    queryFn: () => employeePermissionsRepositoryProvider.getPermissionById(id)
  });

  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors },
    reset
  } = useForm<EmployeePermissionForm>({ defaultValues: emptyPermissionForm });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: UpdateEmployeePermissionForm) => employeePermissionsRepositoryProvider.updatePermissionById(payload, id),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getPermissions'] });
      queryClient.invalidateQueries({ queryKey: ['getPermissionById', id] });
      navigate(`/permisos/${id}`);
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  useEffect(() => {
    if (data) reset(toPermissionForm(data));
  }, [data, reset]);

  const onSubmit = (form: EmployeePermissionForm) => mutate(toUpdatePermissionPayload(form));

  if (isLoading) return <Spinner />
  if (error) return (
    <p className="text-center text-sm text-red-600 dark:text-red-400">No se pudo cargar el permiso: {error.message}</p>
  )
  if (data) return (
    <div className="space-y-5">
      <Title title={`Actualización de permiso folio ${data.folio}`} subtitle={`${data.employee.name} (${data.employee.pin})${data.substitute ? ` · Comodín: ${data.substitute.name}` : ''}`} />

      {data.is_valid ? (
        // PATCH /permissions/:id responde 400 si el permiso ya tiene la firma de RRHH
        <p className="text-center text-sm text-slate-600 dark:text-gray-400">El permiso ya tiene el Vo.Bo. de RRHH y no se puede editar.</p>
      ) : (
        <form className="form w-full mx-auto lg:w-2/3" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Form register={register} control={control} setValue={setValue} errors={errors} isEdit={true} />

          <CustomFilledButton label="Guardar Cambios" type="submit" fullWitdh={true} disabled={isPending} loading={isPending} />
        </form>
      )}
    </div>
  )
}
