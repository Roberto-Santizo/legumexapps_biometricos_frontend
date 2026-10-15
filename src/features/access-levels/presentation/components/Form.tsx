import { TextFormField } from "@/features/shared/shared";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { AccessLevelForm } from "@/features/access-levels/access-levels";

type Props = {
  register: UseFormRegister<AccessLevelForm>;
  errors: FieldErrors<AccessLevelForm>;
}

export function Form({ register, errors }: Props) {
  return (
    <TextFormField<AccessLevelForm>
      label="Nombre"
      name="name"
      placeholder="Nombre del nivel de acceso (ej. Acceso general)"
      register={register}
      type="text"
      validation={{
        required: 'El nombre es requerido',
        validate: (value) => value.trim().length > 0 || 'El nombre es requerido'
      }}
      errorMessage={errors.name?.message}
    />
  )
}
