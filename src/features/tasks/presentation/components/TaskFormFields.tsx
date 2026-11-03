import { DateFormField, SearchSelectFormField, TextFormField, type SelectOption } from "@/features/shared/shared";
import { departmentsRepositoryProvider, type Department } from "@/features/departments/departments";
import type { AccessLevel } from "@/features/access-levels/access-levels";
import { positionsRepositoryProvider, type Position } from "@/features/positions/positions";
import { employeeFullName, employeesRepositoryProvider, type Employee } from "@/features/employees/employees";
import { inactivationTypeLabels, type InactivationType, type TaskForm } from "@/features/tasks/tasks";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useController, useWatch, type Control, type FieldErrors, type UseFormRegister, type UseFormSetValue } from "react-hook-form";
import { ImageUp, User, X } from "lucide-react";

type FieldProps = {
  register: UseFormRegister<TaskForm>;
  errors: FieldErrors<TaskForm>;
}

type ScheduledAtProps = FieldProps & {
  min: string;
  max?: string;
}

export function ScheduledAtField({ register, errors, min, max }: ScheduledAtProps) {
  return (
    <DateFormField<TaskForm>
      label="Fecha programada"
      name="scheduled_at"
      register={register}
      min={min}
      max={max}
      validation={{
        required: 'La fecha es requerida',
        validate: (scheduledAt) => {
          const value = String(scheduledAt ?? '');
          if (value < min) return 'La fecha debe ser hoy o posterior y estar dentro de la semana';
          if (max && value > max) return 'La fecha debe estar dentro de la semana de la planificación';
          return true;
        }
      }}
      errorMessage={errors.scheduled_at?.message}
    />
  )
}

export function InactivationTypeField({ register, errors }: FieldProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de baja</legend>

      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(inactivationTypeLabels) as InactivationType[]).map(option => (
          <label
            key={option}
            className="cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-center text-sm font-medium text-gray-700 hover:border-gray-300 has-checked:border-red-500 has-checked:bg-red-50 has-checked:text-red-700 has-focus-visible:ring-2 has-focus-visible:ring-red-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:has-checked:bg-red-500/15 dark:has-checked:text-red-200"
          >
            <input
              type="radio"
              value={option}
              className="sr-only"
              {...register('inactivationType', { required: 'Seleccione el tipo de baja' })}
            />
            {inactivationTypeLabels[option]}
          </label>
        ))}
      </div>

      <p className="text-red-400 text-xs">{errors.inactivationType?.message}</p>
    </fieldset>
  )
}

type SelectProps<T> = FieldProps & {
  items: T[];
  // En edición el valor vacío mantiene el actual
  optional?: boolean;
}

export function DepartmentField({ register, errors, items, optional = false }: SelectProps<Department>) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="auth_dept_id">
        Departamento
      </label>

      <select
        id="auth_dept_id"
        aria-invalid={!!errors.auth_dept_id}
        className={errors.auth_dept_id ? 'text_form_field_error' : 'text_form_field'}
        {...register('auth_dept_id', { required: optional ? false : 'Seleccione un departamento' })}
      >
        <option value="" disabled={!optional}>{optional ? 'Mantener departamento actual' : 'Seleccione un departamento'}</option>
        {items.map(department => (
          <option key={department.id} value={department.id}>{department.name} ({department.code})</option>
        ))}
      </select>

      <p className="text-red-400 text-xs">{errors.auth_dept_id?.message}</p>
    </div>
  )
}

type PositionProps = SelectProps<Position> & {
  // Texto de la opción vacía cuando el campo es opcional (en el alta: sin posición)
  emptyLabel?: string;
}

export function PositionField({ register, errors, items, optional = false, emptyLabel = 'Mantener posición actual' }: PositionProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="position_id">
        Posición
      </label>

      <select
        id="position_id"
        aria-invalid={!!errors.position_id}
        className={errors.position_id ? 'text_form_field_error' : 'text_form_field'}
        {...register('position_id', { required: optional ? false : 'Seleccione una posición' })}
      >
        <option value="" disabled={!optional}>{optional ? emptyLabel : 'Seleccione una posición'}</option>
        {/* La disponibilidad se valida al ejecutar la tarea: una posición ocupada puede liberarse antes */}
        {items.map(position => (
          <option key={position.id} value={position.id}>
            {position.name} ({position.code}){position.employee ? ` · ocupada por ${position.employee}` : ''}
          </option>
        ))}
      </select>

      <p className="text-red-400 text-xs">{errors.position_id?.message}</p>
    </div>
  )
}

// Los departamentos se buscan por nombre en el backend en lugar de cargar el catálogo completo
const DEPARTMENTS_SEARCH_LIMIT = 20;
const POSITIONS_LIMIT = 1000;

// auth_dept_id espera el ID del departamento (el formulario de empleados usa el código)
const searchDepartments = async (name: string): Promise<SelectOption[]> => {
  const { data } = await departmentsRepositoryProvider.getDepartments(0, DEPARTMENTS_SEARCH_LIMIT, { name });
  return data.map(department => ({ value: department.id, label: `${department.name} (${department.code})` }));
}

type DepartmentPositionProps = FieldProps & {
  control: Control<TaskForm>;
  setValue: UseFormSetValue<TaskForm>;
  // En el alta la posición es opcional
  optionalPosition?: boolean;
}

// Departamento con búsqueda y posiciones filtradas por el código del departamento elegido
export function DepartmentPositionFields({ register, control, setValue, errors, optionalPosition = false }: DepartmentPositionProps) {
  const departmentId = useWatch({ control, name: 'auth_dept_id' });

  // Las posiciones se filtran por código, así que se obtiene el departamento elegido
  const { data: department, isLoading: isLoadingDepartment } = useQuery({
    queryKey: ['getDepartmentById', departmentId],
    queryFn: () => departmentsRepositoryProvider.getDepartmentById(departmentId),
    enabled: !!departmentId
  });

  const deptCode = department?.code;

  const { data: positions = [], isLoading: isLoadingPositions } = useQuery({
    queryKey: ['getPositions', 'byDepartment', deptCode],
    queryFn: () => positionsRepositoryProvider.getPositions(0, POSITIONS_LIMIT, { code: deptCode }),
    select: (response) => response.data,
    enabled: !!deptCode
  });

  const loading = isLoadingDepartment || isLoadingPositions;

  return (
    <>
      <SearchSelectFormField<TaskForm>
        label="Departamento"
        name="auth_dept_id"
        control={control}
        queryKey={['getDepartments', 'byId']}
        fetchOptions={searchDepartments}
        placeholder="Buscar departamento por nombre"
        emptyMessage="No se encontraron departamentos"
        validation={{ required: 'Seleccione un departamento' }}
        errorMessage={errors.auth_dept_id?.message}
        // La posición elegida pertenece al departamento anterior
        onValueChange={() => setValue('position_id', '')}
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="position_id">
          Posición {optionalPosition && <span className="font-normal text-gray-400 dark:text-gray-500">(opcional)</span>}
        </label>

        <select
          // Se remonta al cargar las posiciones para que react-hook-form aplique el valor actual sobre las nuevas opciones
          key={loading ? 'loading' : deptCode}
          id="position_id"
          disabled={!departmentId || loading}
          aria-invalid={!!errors.position_id}
          className={errors.position_id ? 'text_form_field_error' : 'text_form_field'}
          {...register('position_id', { required: optionalPosition ? false : 'Seleccione una posición' })}
        >
          <option value="" disabled={!optionalPosition}>
            {!departmentId
              ? 'Seleccione un departamento primero'
              : loading
                ? 'Cargando posiciones...'
                : positions.length === 0
                  ? 'El departamento no tiene posiciones'
                  : optionalPosition ? 'Sin posición' : 'Seleccione una posición'}
          </option>
          {/* La disponibilidad se valida al ejecutar la tarea: una posición ocupada puede liberarse antes */}
          {positions.map(position => (
            <option key={position.id} value={position.id}>
              {position.name} ({position.code}){position.employee ? ` · ocupada por ${position.employee}` : ''}
            </option>
          ))}
        </select>

        <p className="text-red-400 text-xs">{errors.position_id?.message}</p>
      </div>
    </>
  )
}

export function TaskAccessLevelsField({ register, errors, items }: SelectProps<AccessLevel>) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Niveles de acceso</span>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-gray-400">No hay niveles de acceso registrados</p>
      ) : (
        <div className="grid max-h-56 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
          {items.map(level => (
            <label
              key={level.id}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:border-gray-300 has-checked:border-blue-500 has-checked:bg-blue-50 has-checked:text-blue-800 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:has-checked:bg-blue-500/15 dark:has-checked:text-blue-200"
            >
              <input
                type="checkbox"
                value={level.id}
                className="accent-blue-600"
                {...register('accLevelIds', {
                  validate: (ids) => [ids].flat().filter(Boolean).length > 0 || 'Seleccione al menos un nivel de acceso'
                })}
              />
              {level.name}
            </label>
          ))}
        </div>
      )}

      <p className="text-red-400 text-xs">{errors.accLevelIds?.message}</p>
    </div>
  )
}

function EmployeePreviewPhoto({ employee }: { employee: Employee }) {
  const [failed, setFailed] = useState(false);

  if (!employee.hasPhoto || !employee.photoUrl || failed) return (
    <div className="flex h-14 w-14 flex-none items-center justify-center rounded-xl bg-slate-100 dark:bg-gray-800">
      <User className="h-6 w-6 text-slate-400 dark:text-gray-500" aria-label="Sin fotografía" />
    </div>
  )

  return (
    <img
      src={employee.photoUrl}
      alt={`Fotografía de ${employeeFullName(employee)}`}
      onError={() => setFailed(true)}
      className="h-14 w-14 flex-none rounded-xl border border-slate-200 object-cover dark:border-gray-700"
    />
  )
}

type EmployeePinProps = FieldProps & {
  control: Control<TaskForm>;
}

// El PIN se escribe a mano: la existencia del empleado se valida al ejecutar la tarea,
// así que admite empleados con alta programada en la misma semana.
// Si el PIN ya existe en ZKBioAccess se muestran sus datos como referencia
export function EmployeePinField({ register, control, errors }: EmployeePinProps) {
  const pin = useWatch({ control, name: 'pin' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(pin.trim()), 400);
    return () => clearTimeout(timeout);
  }, [pin]);

  // Un 404 solo significa que el empleado aún no existe: no se reintenta ni se muestra error
  const { data: employee } = useQuery({
    queryKey: ['getEmployeeByPin', search],
    queryFn: () => employeesRepositoryProvider.getEmployeeByPin(search),
    enabled: !!search,
    retry: false
  });

  // Evita mostrar el empleado del PIN anterior mientras se escribe
  const found = employee && employee.pin === pin.trim() ? employee : null;

  return (
    <div className="flex flex-col gap-3">
      <TextFormField<TaskForm>
        label="Código del empleado"
        name="pin"
        placeholder="PIN del empleado"
        register={register}
        type="text"
        validation={{ required: 'El PIN es requerido' }}
        errorMessage={errors.pin?.message}
      />

      {found && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-gray-700">
          <EmployeePreviewPhoto key={found.pin} employee={found} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-gray-100">{employeeFullName(found)}</p>
            <p className="truncate text-xs text-slate-500 dark:text-gray-400">
              PIN {found.pin} · {found.position_id ? found.position : 'Sin posición asignada'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// Formatos aceptados por POST /tasks/creation
const PHOTO_ACCEPT = ['image/jpeg', 'image/png', 'image/gif'];
const PHOTO_MAX_SIZE_MB = 5;

// La foto del alta es opcional: si no existe al ejecutar la tarea, el error queda en la tarea
export function TaskPhotoField({ control }: { control: Control<TaskForm> }) {
  const { field: { value: file, onChange, onBlur, name, ref }, fieldState: { error } } = useController({
    control,
    name: 'file',
    rules: {
      validate: (file) => {
        if (!file) return true;
        if (!PHOTO_ACCEPT.includes(file.type)) return 'Formato no permitido. Use JPG, PNG o GIF';
        if (file.size > PHOTO_MAX_SIZE_MB * 1024 * 1024) return `La imagen supera el máximo de ${PHOTO_MAX_SIZE_MB} MB`;
        return true;
      }
    }
  });

  const previewUrl = useMemo(() => file ? URL.createObjectURL(file) : null, [file]);

  // libera la URL de la vista previa al cambiarla o al desmontar
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fotografía (opcional)</span>

      <div className="flex items-center gap-4">
        {previewUrl ? (
          <img src={previewUrl} alt="Vista previa" className="h-16 w-16 flex-none rounded-xl border border-slate-200 object-cover dark:border-gray-700" />
        ) : (
          <div className="flex h-16 w-16 flex-none items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-gray-700">
            <ImageUp className="h-5 w-5 text-slate-400 dark:text-gray-500" />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
          <input
            id="task-file"
            name={name}
            ref={ref}
            type="file"
            accept={PHOTO_ACCEPT.join(',')}
            aria-invalid={!!error}
            onBlur={onBlur}
            onChange={(event) => {
              onChange(event.target.files?.[0] ?? null);
              // permite volver a elegir el mismo archivo
              event.target.value = '';
            }}
            className="peer sr-only"
          />
          <label htmlFor="task-file" className="inline-flex cursor-pointer items-center rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
            {file ? 'Cambiar foto' : 'Seleccionar foto'}
          </label>
          {file ? (
            <div className="flex min-w-0 items-center gap-2 text-xs">
              <span className="truncate text-slate-600 dark:text-gray-400" title={file.name}>{file.name}</span>
              <button type="button" onClick={() => onChange(null)} className="inline-flex flex-none items-center gap-1 font-medium text-red-600 hover:text-red-700 cursor-pointer dark:text-red-400 dark:hover:text-red-300">
                <X className="h-3.5 w-3.5" /> Quitar
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-gray-400">JPG, PNG o GIF · máx. {PHOTO_MAX_SIZE_MB} MB. Se guarda como foto del PIN.</p>
          )}
        </div>
      </div>

      <p className="text-red-400 text-xs">{error?.message}</p>
    </div>
  )
}
