import { TextFormField } from "@/features/shared/shared";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { DepartmentForm } from "@/features/departments/departments";

type Props = {
  register: UseFormRegister<DepartmentForm>;
  errors: FieldErrors<DepartmentForm>;
}

export function Form({ register, errors }: Props) {
  return (
    <>
      <TextFormField<DepartmentForm>
        label="Código"
        name="code"
        placeholder="Código único del departamento (ej. PROD01)"
        register={register}
        type="text"
        validation={{
          required: 'El código es requerido',
          minLength: { value: 5, message: 'El código debe tener al menos 5 caracteres' }
        }}
        errorMessage={errors.code?.message}
      />

      <TextFormField<DepartmentForm>
        label="Nombre"
        name="name"
        placeholder="Nombre del departamento"
        register={register}
        type="text"
        validation={{
          required: 'El nombre es requerido',
          minLength: { value: 5, message: 'El nombre debe tener al menos 5 caracteres' }
        }}
        errorMessage={errors.name?.message}
      />
    </>
  )
}
