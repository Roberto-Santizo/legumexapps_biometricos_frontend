import { PasswordFormField, TextFormField } from "@/features/shared/shared";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { RolesFormField, type UserForm } from "@/features/users/users";

type Props = {
  register: UseFormRegister<UserForm>;
  errors: FieldErrors<UserForm>;
  isEdit?: boolean;
}

export function Form({ register, errors, isEdit = false }: Props) {
  return (
    <>
      <TextFormField<UserForm>
        label="Nombre"
        name="name"
        placeholder="Nombre completo del usuario"
        register={register}
        type="text"
        validation={{
          required: 'El nombre es requerido',
          minLength: { value: 10, message: 'El nombre debe tener al menos 10 caracteres' }
        }}
        errorMessage={errors.name?.message}
      />

      <TextFormField<UserForm>
        label="Correo Electrónico"
        name="email"
        placeholder="correo@legumex.com"
        register={register}
        type="email"
        validation={{
          required: 'El correo electrónico es requerido',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'El correo electrónico no es válido' }
        }}
        errorMessage={errors.email?.message}
      />

      <RolesFormField register={register} errorMessage={errors.roles?.message} />

      <PasswordFormField<UserForm>
        label={isEdit ? "Contraseña (dejar vacío para no cambiarla)" : "Contraseña"}
        name="password"
        placeholder="Contraseña del usuario"
        register={register}
        validation={{
          required: isEdit ? false : 'La contraseña es requerida',
          minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
          maxLength: { value: 50, message: 'La contraseña debe tener máximo 50 caracteres' }
        }}
        errorMessage={errors.password?.message}
      />
    </>
  )
}
