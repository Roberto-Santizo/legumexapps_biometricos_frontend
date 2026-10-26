import { TextFormField } from "@/features/shared/shared";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { FincaDepartmentForm } from "@/features/finca-departments/finca-departments";

type Props = {
  register: UseFormRegister<FincaDepartmentForm>;
  errors: FieldErrors<FincaDepartmentForm>;
}

export function Form({ register, errors }: Props) {
  return (
    <>
      <TextFormField<FincaDepartmentForm>
        label="Código"
        name="dept_code"
        placeholder="Código único del departamento (ej. RRHH)"
        register={register}
        type="text"
        validation={{
          required: 'El código es requerido'
        }}
        errorMessage={errors.dept_code?.message}
      />

      <TextFormField<FincaDepartmentForm>
        label="Nombre"
        name="dept_name"
        placeholder="Nombre del departamento"
        register={register}
        type="text"
        validation={{
          required: 'El nombre es requerido'
        }}
        errorMessage={errors.dept_name?.message}
      />
    </>
  )
}
