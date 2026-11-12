import { CustomFilledButton, Spinner, Title, useNotification } from "@/features/shared/shared";
import { Form, emptyDiscountForm, employeeDiscountsRepositoryProvider, toDiscountForm, toDiscountPayload, type EmployeeDiscountForm, type EmployeeDiscountPayload } from "@/features/employee-discounts/employee-discounts";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export function UpdateEmployeeDiscount() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notification = useNotification();
  const id = params.id!;

  const { data, isLoading, error } = useQuery({
    queryKey: ['getDiscountById', id],
    queryFn: () => employeeDiscountsRepositoryProvider.getDiscountById(id)
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset
  } = useForm<EmployeeDiscountForm>({ defaultValues: emptyDiscountForm });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: EmployeeDiscountPayload) => employeeDiscountsRepositoryProvider.updateDiscountById(payload, id),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getDiscounts'] });
      queryClient.invalidateQueries({ queryKey: ['getDiscountById', id] });
      navigate(`/descuentos/${id}`);
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  useEffect(() => {
    if (data) reset(toDiscountForm(data));
  }, [data, reset]);

  const onSubmit = (form: EmployeeDiscountForm) => mutate(toDiscountPayload(form));

  if (isLoading) return <Spinner />
  if (error) return (
    <p className="text-center text-sm text-red-600 dark:text-red-400">No se pudo cargar el descuento: {error.message}</p>
  )
  if (data) return (
    <div className="space-y-5">
      <Title title="Actualización de Descuento" subtitle="Verifique el monto: es lo que verá el trabajador" />

      <form className="form w-full mx-auto lg:w-2/3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form
          register={register}
          control={control}
          errors={errors}
        />

        <CustomFilledButton label="Guardar Cambios" type="submit" fullWitdh={true} disabled={isPending} loading={isPending} />
      </form>
    </div>
  )
}
