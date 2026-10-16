import { LoadingData, TextFormField } from "@/features/shared/shared";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { departmentsRepositoryProvider } from "@/features/departments/departments";
import { accessLevelsRepositoryProvider } from "@/features/access-levels/access-levels";
import { AccessLevelsFormField, type EmployeeForm } from "@/features/employees/employees";

// Los catálogos se usan completos en los selectores; el backend no expone un endpoint sin paginar
const CATALOG_LIMIT = 1000;

type Props = {
  register: UseFormRegister<EmployeeForm>;
  errors: FieldErrors<EmployeeForm>;
  isEdit?: boolean;
}

export function Form({ register, errors, isEdit = false }: Props) {
  const { data: departments } = useQuery({
    queryKey: ['getDepartments', 'catalog'],
    queryFn: () => departmentsRepositoryProvider.getDepartments(0, CATALOG_LIMIT)
  });

  const { data: levels } = useQuery({
    queryKey: ['getAccessLevels', 'catalog'],
    queryFn: () => accessLevelsRepositoryProvider.getAccessLevels(0, CATALOG_LIMIT)
  });

  if (!departments || !levels) return <LoadingData />

  return (
    <>
      <TextFormField<EmployeeForm>
        label="Nombres"
        name="name"
        placeholder="Nombres del empleado"
        register={register}
        type="text"
        validation={{
          required: 'El nombre es requerido',
          minLength: { value: 10, message: 'El nombre debe tener al menos 10 caracteres' }
        }}
        errorMessage={errors.name?.message}
      />

      <TextFormField<EmployeeForm>
        label="Posición"
        name="lastName"
        placeholder="Posición del empleado"
        register={register}
        type="text"
        validation={{
          required: 'Los apellidos son requeridos',
          minLength: { value: 5, message: 'Los apellidos deben tener al menos 5 caracteres' }
        }}
        errorMessage={errors.lastName?.message}
      />

      <TextFormField<EmployeeForm>
        label={isEdit ? "PIN (no editable)" : "Código del empleado"}
        name="pin"
        placeholder="Código del empleado"
        register={register}
        type="text"
        readOnly={isEdit}
        validation={{
          required: 'El PIN es requerido',
          minLength: { value: 5, message: 'El PIN debe tener al menos 5 caracteres' }
        }}
        errorMessage={errors.pin?.message}
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="deptCode">
          Departamento
        </label>

        <select
          id="deptCode"
          aria-invalid={!!errors.deptCode}
          className={errors.deptCode ? 'text_form_field_error' : 'text_form_field'}
          {...register('deptCode', { required: 'Seleccione un departamento' })}
        >
          <option value="" disabled>Seleccione un departamento</option>
          {departments.map(department => (
            <option key={department.id} value={department.code}>{department.name} ({department.code})</option>
          ))}
        </select>

        <p className="text-red-400 text-xs">{errors.deptCode?.message}</p>
      </div>

      <AccessLevelsFormField register={register} levels={levels} single={isEdit} errorMessage={errors.accLevelIds?.message} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextFormField<EmployeeForm>
          label="Inicio de vigencia (opcional)"
          name="accStartTime"
          placeholder=""
          register={register}
          type="datetime-local"
          validation={{}}
          errorMessage={errors.accStartTime?.message}
        />

        <TextFormField<EmployeeForm>
          label="Fin de vigencia (opcional)"
          name="accEndTime"
          placeholder=""
          register={register}
          type="datetime-local"
          validation={{
            validate: (end, { accStartTime }) =>
              !end || !accStartTime || end > accStartTime || 'El fin debe ser posterior al inicio'
          }}
          errorMessage={errors.accEndTime?.message}
        />
      </div>
    </>
  )
}
