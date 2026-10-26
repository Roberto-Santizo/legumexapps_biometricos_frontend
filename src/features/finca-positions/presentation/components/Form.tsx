import { TextFormField } from "@/features/shared/shared";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { FincaPositionForm } from "@/features/finca-positions/finca-positions";

type Props = {
  register: UseFormRegister<FincaPositionForm>;
  errors: FieldErrors<FincaPositionForm>;
}

export function Form({ register, errors }: Props) {
  return (
    <>
      <TextFormField<FincaPositionForm>
        label="Código"
        name="position_code"
        placeholder="Código único de la posición (ej. SUP-01)"
        register={register}
        type="text"
        validation={{
          required: 'El código es requerido'
        }}
        errorMessage={errors.position_code?.message}
      />

      <TextFormField<FincaPositionForm>
        label="Nombre"
        name="position_name"
        placeholder="Nombre de la posición"
        register={register}
        type="text"
        validation={{
          required: 'El nombre es requerido'
        }}
        errorMessage={errors.position_name?.message}
      />
    </>
  )
}
