import { CustomFilledButton, Title, useNotification } from "@/features/shared/shared";
import { type EmployeeDiscountForm, type EmployeeDiscountPayload, Form, emptyDiscountForm, employeeDiscountsRepositoryProvider, toDiscountPayload } from "@/features/employee-discounts/employee-discounts";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function CreateEmployeeDiscount() {
  const notification = useNotification();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors }
  } = useForm<EmployeeDiscountForm>({ defaultValues: emptyDiscountForm });

  // POST /discounts (JSON) solo recibe el PIN del trabajador como `code`
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: EmployeeDiscountPayload) => employeeDiscountsRepositoryProvider.createDiscount(payload),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getDiscounts'] });
      navigate('/descuentos');
    },
    onError: (err) => {
      notification.error(err.message);
    }
  });

  const onSubmit = (form: EmployeeDiscountForm) => mutate(toDiscountPayload(form));

  return (
    <div className="space-y-5">
      <Title title="Creación de Descuento" subtitle="Verifique el monto: es lo que verá el trabajador" />

      <form className="form w-full mx-auto lg:w-2/3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form register={register} control={control} errors={errors} />

        <CustomFilledButton label="Crear Descuento" type="submit" fullWitdh={true} disabled={isPending} loading={isPending} />
      </form>
    </div>
  )
}
