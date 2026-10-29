import { TextFormField } from "@/features/shared/shared";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { PositionForm } from "@/features/positions/positions";

type Props = {
  register: UseFormRegister<PositionForm>;
  errors: FieldErrors<PositionForm>;
}

export function Form({ register, errors }: Props) {
  return (
    <>
      <TextFormField<PositionForm>
        label="Código"
        name="code"
        placeholder="Código único de la posición (ej. POS-001)"
        register={register}
        type="text"
        validation={{
          required: 'El código es requerido'
        }}
        errorMessage={errors.code?.message}
      />

      <TextFormField<PositionForm>
        label="Nombre"
        name="name"
        placeholder="Nombre de la posición"
        register={register}
        type="text"
        validation={{
          required: 'El nombre es requerido'
        }}
        errorMessage={errors.name?.message}
      />
    </>
  )
}
