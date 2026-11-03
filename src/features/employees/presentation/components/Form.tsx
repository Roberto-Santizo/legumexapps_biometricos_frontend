import { LoadingData, SearchSelectFormField, TextFormField, type SelectOption } from "@/features/shared/shared";
import { useWatch, type Control, type FieldErrors, type UseFormRegister, type UseFormSetValue } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { departmentsRepositoryProvider } from "@/features/departments/departments";
import { accessLevelsRepositoryProvider } from "@/features/access-levels/access-levels";
import { positionsRepositoryProvider } from "@/features/positions/positions";
import { AccessLevelsFormField, type EmployeeForm } from "@/features/employees/employees";

// Los catálogos se usan completos en los selectores; el backend no expone un endpoint sin paginar
const CATALOG_LIMIT = 1000;

// Los departamentos se buscan por nombre en el backend en lugar de cargar el catálogo completo
const DEPARTMENTS_SEARCH_LIMIT = 20;

const searchDepartments = async (name: string): Promise<SelectOption[]> => {
  const { data } = await departmentsRepositoryProvider.getDepartments(0, DEPARTMENTS_SEARCH_LIMIT, { name });
  return data.map(department => ({ value: department.code, label: `${department.name} (${department.code})` }));
}

type Props = {
  register: UseFormRegister<EmployeeForm>;
  control: Control<EmployeeForm>;
  setValue: UseFormSetValue<EmployeeForm>;
  errors: FieldErrors<EmployeeForm>;
  isEdit?: boolean;
  // Posición actual del empleado en edición: se mantiene seleccionable aunque ya tenga empleado
  currentPositionId?: string | null;
  // Etiqueta del departamento actual en edición, puede no estar en la primera página de la búsqueda
  currentDepartment?: string;
}

export function Form({ register, control, setValue, errors, isEdit = false, currentPositionId, currentDepartment }: Props) {
  const { data: levels } = useQuery({
    queryKey: ['getAccessLevels', 'catalog'],
    queryFn: () => accessLevelsRepositoryProvider.getAccessLevels(0, CATALOG_LIMIT),
    select: (response) => response.data
  });

  const deptCode = useWatch({ control, name: 'deptCode' });

  // Las posiciones se filtran por el código del departamento; sin departamento la lista queda vacía
  const { data: positions = [], isLoading: isLoadingPositions } = useQuery({
    queryKey: ['getPositions', 'byDepartment', deptCode],
    queryFn: () => positionsRepositoryProvider.getPositions(0, CATALOG_LIMIT, { code: deptCode }),
    select: (response) => response.data,
    enabled: !!deptCode
  });

  if (!levels) return <LoadingData />

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
        label="Apellidos"
        name="lastName"
        placeholder="Apellidos del empleado"
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

      <SearchSelectFormField<EmployeeForm>
        label="Departamento"
        name="deptCode"
        control={control}
        queryKey="getDepartments"
        fetchOptions={searchDepartments}
        placeholder="Buscar departamento por nombre"
        emptyMessage="No se encontraron departamentos"
        initialLabel={currentDepartment}
        validation={{ required: 'Seleccione un departamento' }}
        errorMessage={errors.deptCode?.message}
        // La posición elegida pertenece al departamento anterior
        onValueChange={() => setValue('position_id', '')}
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="position_id">
          Posición {!isEdit && <span className="font-normal text-gray-400 dark:text-gray-500">(opcional)</span>}
        </label>

        <select
          // Se remonta al cargar las posiciones para que react-hook-form aplique el valor actual sobre las nuevas opciones
          key={isLoadingPositions ? 'loading' : deptCode}
          id="position_id"
          disabled={!deptCode || isLoadingPositions}
          aria-invalid={!!errors.position_id}
          className={errors.position_id ? 'text_form_field_error' : 'text_form_field'}
          {...register('position_id', { required: isEdit ? 'Seleccione una posición' : false })}
        >
          {/* Al crear, la posición es opcional y puede asignarse después */}
          <option value="" disabled={isEdit}>
            {!deptCode
              ? 'Seleccione un departamento primero'
              : isLoadingPositions
                ? 'Cargando posiciones...'
                : positions.length === 0
                  ? 'El departamento no tiene posiciones'
                  : isEdit ? 'Seleccione una posición' : 'Sin posición'}
          </option>
          {/* El backend rechaza posiciones que ya tienen un empleado asignado */}
          {positions.map(position => {
            const taken = !!position.employee && position.id !== currentPositionId;
            return (
              <option key={position.id} value={position.id} disabled={taken}>
                {position.name} ({position.code}){taken ? ` · ocupada por ${position.employee}` : ''}
              </option>
            );
          })}
        </select>

        <p className="text-red-400 text-xs">{errors.position_id?.message}</p>
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
