import { DateFormField } from "@/features/shared/shared";
import type { Department } from "@/features/departments/departments";
import type { AccessLevel } from "@/features/access-levels/access-levels";
import type { Position } from "@/features/positions/positions";
import { employeesRepositoryProvider, type EmployeeListItem } from "@/features/employees/employees";
import type { TaskForm } from "@/features/tasks/tasks";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useController, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { ImageUp, Search, X } from "lucide-react";

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

const employeeFullName = (employee: EmployeeListItem) => [employee.name, employee.last_name].filter(Boolean).join(' ');

// Busca empleados activos por nombre y guarda su ID en employee_id
export function EmployeeSearchField({ control }: { control: Control<TaskForm> }) {
  const { field: { onChange }, fieldState: { error } } = useController({
    control,
    name: 'employee_id',
    rules: { required: 'Seleccione un empleado' }
  });
  const [term, setTerm] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<EmployeeListItem | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(term.trim()), 300);
    return () => clearTimeout(timeout);
  }, [term]);

  const { data, isFetching } = useQuery({
    queryKey: ['getEmployees', 0, 8, search],
    queryFn: () => employeesRepositoryProvider.getEmployees(0, 8, { name: search }),
    select: (response) => response.data,
    enabled: search.length >= 2
  });

  const select = (employee: EmployeeListItem | null) => {
    setSelected(employee);
    onChange(employee?.id ?? '');
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="employee-search" className="text-sm font-medium text-gray-700 dark:text-gray-300">Empleado</label>

      {selected ? (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-gray-700">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-gray-100">{employeeFullName(selected)}</p>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              PIN {selected.pin} · {selected.position} · {selected.department}
            </p>
          </div>
          <button type="button" onClick={() => select(null)} aria-label="Cambiar empleado" className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-red-600 cursor-pointer dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-400">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              id="employee-search"
              type="search"
              autoComplete="off"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Buscar por nombre (mín. 2 letras)"
              aria-invalid={!!error}
              className={`${error ? 'text_form_field_error' : 'text_form_field'} pl-10!`}
            />
          </div>

          {search.length >= 2 && (
            <ul className="max-h-56 divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200 dark:divide-gray-800 dark:border-gray-700">
              {isFetching && !data && <li className="px-4 py-3 text-sm text-slate-500 dark:text-gray-400">Buscando…</li>}
              {data?.length === 0 && <li className="px-4 py-3 text-sm text-slate-500 dark:text-gray-400">Sin resultados</li>}
              {data?.map(employee => (
                <li key={employee.id}>
                  <button type="button" onClick={() => select(employee)} className="w-full px-4 py-2.5 text-left hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50 cursor-pointer dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
                    <p className="text-sm font-medium text-slate-900 dark:text-gray-100">{employeeFullName(employee)}</p>
                    <p className="text-xs text-slate-500 dark:text-gray-400">PIN {employee.pin} · {employee.department}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <p className="text-red-400 text-xs">{error?.message}</p>
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
