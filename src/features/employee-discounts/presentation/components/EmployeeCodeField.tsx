import { useEffect, useState } from "react";
import { Controller, type Control } from "react-hook-form";
import { CheckCircle2, Hash, Loader2 } from "lucide-react";
import { useDebounce } from "@/features/shared/shared";
import { useEmployeeByPin } from "@/features/employees/employees";
import type { EmployeeDiscountForm } from "@/features/employee-discounts/employee-discounts";

const sameCode = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

type InputProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  errorMessage?: string;
}

// Lo escrito se valida con GET /employees/:code; el campo `code` del formulario solo toma valor cuando el empleado existe
function EmployeeCodeInput({ value, onChange, onBlur, errorMessage }: InputProps) {
  const [text, setText] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const search = useDebounce(text.trim(), 400);
  const { data: employee, isFetching, error } = useEmployeeByPin(search);
  const found = !!employee && !!search && sameCode(employee.pin, search);

  // Valor fijado desde fuera (reset en edición o selección por nombre): se refleja en el input
  if (value !== prevValue) {
    setPrevValue(value);
    if (value && !sameCode(text, value)) setText(value);
  }

  // Al confirmarse el empleado se guarda su PIN tal como lo tiene el backend
  useEffect(() => {
    if (found && sameCode(search, text) && value !== employee.pin) onChange(employee.pin);
  }, [found, employee, search, text, value, onChange]);

  const handleChange = (next: string) => {
    setText(next);
    // Mientras no se confirme el nuevo código, el formulario no tiene trabajador
    if (value) onChange('');
  }

  const loading = !!text.trim() && (text.trim() !== search || isFetching);
  const notFound = !!search && !loading && !!error;
  const message = notFound ? `No existe un empleado con código ${search}` : errorMessage;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="code" className="text-sm font-medium text-gray-700 dark:text-gray-300">Código del trabajador</label>
      <div className="relative">
        <Hash className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" aria-hidden />
        <input
          id="code"
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="Ingrese el código, ej. LEG0001"
          value={text}
          onChange={(event) => handleChange(event.target.value)}
          onBlur={onBlur}
          aria-invalid={!!message}
          aria-describedby="code-status"
          className={`${message ? 'text_form_field_error' : 'text_form_field'} pl-10! pr-10! tabular-nums`}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" aria-label="Buscando empleado" />
          ) : found ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-label="Empleado encontrado" />
          ) : null}
        </span>
      </div>
      <p id="code-status" role="status" className="text-red-400 text-xs">{message}</p>
    </div>
  )
}

export function EmployeeCodeField({ control, errorMessage }: { control: Control<EmployeeDiscountForm>; errorMessage?: string }) {
  return (
    <Controller
      name="code"
      control={control}
      rules={{ required: 'Ingrese el código de un trabajador existente' }}
      render={({ field }) => (
        <EmployeeCodeInput value={field.value} onChange={field.onChange} onBlur={field.onBlur} errorMessage={errorMessage} />
      )}
    />
  )
}
