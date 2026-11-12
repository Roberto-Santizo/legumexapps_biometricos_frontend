import { CustomFilledButton, Title, useNotification } from "@/features/shared/shared";
import { type EmployeePermissionForm, type EmployeePermissionPayload, Form, SignaturesFormFields, emptyPermissionForm, employeePermissionsRepositoryProvider, toPermissionPayload } from "@/features/employee-permissions/employee-permissions";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function CreateEmployeePermission() {
  const notification = useNotification();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors }
  } = useForm<EmployeePermissionForm>({ defaultValues: emptyPermissionForm });

  // POST /permissions es multipart; el backend rechaza permisos duplicados para el trabajador o el comodín en esa fecha
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: EmployeePermissionPayload) => employeePermissionsRepositoryProvider.createPermission(payload),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getPermissions'] });
      navigate('/permisos');
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  const onSubmit = (form: EmployeePermissionForm) => mutate(toPermissionPayload(form));

  return (
    <div className="space-y-5">
      <Title title="Creación de Permiso" subtitle="El permiso será válido cuando Recursos Humanos dé su Vo.Bo." />

      <form className="form w-full mx-auto lg:w-2/3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form register={register} control={control} setValue={setValue} errors={errors} />

        <SignaturesFormFields control={control} />

        <CustomFilledButton label="Crear Permiso" type="submit" fullWitdh={true} disabled={isPending} loading={isPending} />
      </form>
    </div>
  )
}
