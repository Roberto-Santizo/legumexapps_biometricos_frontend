import { LoadingData, TextFormField } from "@/features/shared/shared";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { fincaDepartmentsRepositoryProvider } from "@/features/finca-departments/finca-departments";
import { fincaPositionsRepositoryProvider } from "@/features/finca-positions/finca-positions";
import { AreasFormField, fincaEmployeesRepositoryProvider, type FincaEmployeeForm } from "@/features/finca-employees/finca-employees";

// Los catálogos se usan completos en los selectores; el backend no expone un endpoint sin paginar
const CATALOG_LIMIT = 1000;

type Props = {
  register: UseFormRegister<FincaEmployeeForm>;
  errors: FieldErrors<FincaEmployeeForm>;
}

export function Form({ register, errors }: Props) {
  const { data: departments } = useQuery({
    queryKey: ['getFincaDepartments', 'catalog'],
    queryFn: () => fincaDepartmentsRepositoryProvider.getFincaDepartments(0, CATALOG_LIMIT),
    select: (response) => response.data
  });

  const { data: positions } = useQuery({
    queryKey: ['getFincaPositions', 'catalog'],
    queryFn: () => fincaPositionsRepositoryProvider.getFincaPositions(0, CATALOG_LIMIT),
    select: (response) => response.data
  });

  const { data: areas } = useQuery({
    queryKey: ['getFincaAreas'],
    queryFn: () => fincaEmployeesRepositoryProvider.getFincaAreas()
  });

  if (!departments || !positions || !areas) return <LoadingData />

  return (
    <>
      <TextFormField<FincaEmployeeForm>
        label="Nombres"
        name="first_name"
        placeholder="Nombres del empleado"
        register={register}
        type="text"
        validation={{
          required: 'Los nombres son requeridos',
          minLength: { value: 5, message: 'Los nombres deben tener al menos 5 caracteres' }
        }}
        errorMessage={errors.first_name?.message}
      />

      <TextFormField<FincaEmployeeForm>
        label="Apellidos"
        name="last_name"
        placeholder="Apellidos del empleado"
        register={register}
        type="text"
        validation={{
          required: 'Los apellidos son requeridos',
          minLength: { value: 5, message: 'Los apellidos deben tener al menos 5 caracteres' }
        }}
        errorMessage={errors.last_name?.message}
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="department">
          Departamento
        </label>

        <select
          id="department"
          aria-invalid={!!errors.department}
          className={errors.department ? 'text_form_field_error' : 'text_form_field'}
          {...register('department', { required: 'Seleccione un departamento' })}
        >
          <option value="" disabled>Seleccione un departamento</option>
          {departments.map(department => (
            <option key={department.id} value={department.id}>{department.dept_name} ({department.dept_code})</option>
          ))}
        </select>

        <p className="text-red-400 text-xs">{errors.department?.message}</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="position">
          Posición
        </label>

        <select
          id="position"
          aria-invalid={!!errors.position}
          className={errors.position ? 'text_form_field_error' : 'text_form_field'}
          {...register('position', { required: 'Seleccione una posición' })}
        >
          <option value="" disabled>Seleccione una posición</option>
          {positions.map(position => (
            <option key={position.id} value={position.id}>{position.position_name} ({position.position_code})</option>
          ))}
        </select>

        <p className="text-red-400 text-xs">{errors.position?.message}</p>
      </div>

      <AreasFormField register={register} areas={areas} errorMessage={errors.area?.message} />
    </>
  )
}
