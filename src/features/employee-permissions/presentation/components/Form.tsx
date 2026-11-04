import { DateFormField, SearchSelectFormField, TextFormField, type SelectOption } from "@/features/shared/shared";
import { useWatch, type Control, type FieldErrors, type UseFormRegister, type UseFormSetValue } from "react-hook-form";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { EmployeePreviewCard, employeeFullName, employeesRepositoryProvider } from "@/features/employees/employees";
import { permissionTypeOptions, salaryStatusOptions, type EmployeePermissionForm } from "@/features/employee-permissions/employee-permissions";

// Los empleados se buscan en el backend en lugar de cargar el catálogo completo
const EMPLOYEES_SEARCH_LIMIT = 20;

// Un texto numérico se busca como código (PIN); cualquier otro, por nombre
const searchEmployees = async (search: string): Promise<SelectOption[]> => {
  const filters = /^\d+$/.test(search) ? { pin: search } : { name: search };
  const { data } = await employeesRepositoryProvider.getEmployees(0, EMPLOYEES_SEARCH_LIMIT, filters);
  return data.map(employee => ({ value: employee.pin, label: `${employeeFullName(employee)} (${employee.pin})` }));
}

// El PIN viene del buscador, así que el empleado existe; se muestran sus datos como referencia
function SelectedEmployeePreview({ pin }: { pin: string }) {
  const { data: employee } = useQuery({
    queryKey: ['getEmployeeByPin', pin],
    queryFn: () => employeesRepositoryProvider.getEmployeeByPin(pin),
    enabled: !!pin,
    retry: false
  });

  // Evita mostrar el empleado anterior mientras carga el nuevo
  if (!pin || !employee || employee.pin !== pin) return null;

  return <EmployeePreviewCard employee={employee} />
}

type Props = {
  register: UseFormRegister<EmployeePermissionForm>;
  control: Control<EmployeePermissionForm>;
  setValue: UseFormSetValue<EmployeePermissionForm>;
  errors: FieldErrors<EmployeePermissionForm>;
  // En edición el backend no permite cambiar al trabajador ni al comodín
  isEdit?: boolean;
}

export function Form({ register, control, setValue, errors, isEdit = false }: Props) {
  const employeePin = useWatch({ control, name: 'employee_pin' });
  const substitutePin = useWatch({ control, name: 'substitute_pin' });

  return (
    <>
      {!isEdit && (
        <>
          <div className="flex flex-col gap-3">
            <SearchSelectFormField<EmployeePermissionForm>
              label="Trabajador"
              name="employee_pin"
              control={control}
              queryKey={['getEmployees', 'byPin']}
              fetchOptions={searchEmployees}
              placeholder="Buscar por nombre o código"
              emptyMessage="No se encontraron empleados"
              validation={{ required: 'El trabajador es requerido' }}
              errorMessage={errors.employee_pin?.message}
            />
            <SelectedEmployeePreview pin={employeePin} />
          </div>

          <div className="flex flex-col gap-3">
            <SearchSelectFormField<EmployeePermissionForm>
              label="Comodín (opcional)"
              name="substitute_pin"
              control={control}
              queryKey={['getEmployees', 'byPin']}
              fetchOptions={searchEmployees}
              placeholder="Buscar por nombre o código"
              emptyMessage="No se encontraron empleados"
              validation={{
                validate: (value, form) => !value || value !== form.employee_pin || 'El comodín debe ser distinto al trabajador'
              }}
              errorMessage={errors.substitute_pin?.message}
            />
            <SelectedEmployeePreview pin={substitutePin} />
            {substitutePin && (
              <button
                type="button"
                onClick={() => setValue('substitute_pin', '', { shouldValidate: true })}
                className="inline-flex items-center gap-1 self-start text-xs font-medium text-red-600 hover:text-red-700 cursor-pointer dark:text-red-400 dark:hover:text-red-300"
              >
                <X className="h-3.5 w-3.5" /> Quitar comodín
              </button>
            )}
          </div>
        </>
      )}

      <DateFormField<EmployeePermissionForm>
        label="Día del permiso"
        name="date"
        register={register}
        validation={{ required: 'La fecha es requerida' }}
        errorMessage={errors.date?.message}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="type" className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de permiso</label>
          <select
            id="type"
            aria-invalid={!!errors.type}
            className={errors.type ? 'text_form_field_error' : 'text_form_field'}
            {...register('type', { required: 'Seleccione el tipo de permiso' })}
          >
            <option value="" disabled>Seleccione el tipo de permiso</option>
            {permissionTypeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <p className="text-red-400 text-xs">{errors.type?.message}</p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="salary_status" className="text-sm font-medium text-gray-700 dark:text-gray-300">Salario</label>
          <select
            id="salary_status"
            aria-invalid={!!errors.salary_status}
            className={errors.salary_status ? 'text_form_field_error' : 'text_form_field'}
            {...register('salary_status', { required: 'Seleccione el estado de salario' })}
          >
            <option value="" disabled>Seleccione el estado de salario</option>
            {salaryStatusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <p className="text-red-400 text-xs">{errors.salary_status?.message}</p>
        </div>
      </div>

      {/* El fin puede ser menor que el inicio si el turno cruza medianoche */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextFormField<EmployeePermissionForm>
          label="Inicio de turno"
          name="shift_start"
          placeholder="HH:mm"
          register={register}
          type="time"
          validation={{ required: 'El inicio de turno es requerido' }}
          errorMessage={errors.shift_start?.message}
        />

        <TextFormField<EmployeePermissionForm>
          label="Fin de turno"
          name="shift_end"
          placeholder="HH:mm"
          register={register}
          type="time"
          validation={{
            required: 'El fin de turno es requerido',
            validate: (value, form) => value !== form.shift_start || 'El fin de turno debe ser distinto al inicio'
          }}
          errorMessage={errors.shift_end?.message}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="reason" className="text-sm font-medium text-gray-700 dark:text-gray-300">Motivo de salida</label>
        <textarea
          id="reason"
          rows={3}
          placeholder="Describa el motivo del permiso"
          aria-invalid={!!errors.reason}
          className={errors.reason ? 'text_form_field_error' : 'text_form_field'}
          {...register('reason', {
            required: 'El motivo es requerido',
            validate: (value) => value.trim() !== '' || 'El motivo es requerido'
          })}
        />
        <p className="text-red-400 text-xs">{errors.reason?.message}</p>
      </div>
    </>
  )
}
