import { useState } from "react";
import { Hash, Search } from "lucide-react";
import { DateFormField, SearchSelectFormField } from "@/features/shared/shared";
import { useWatch, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { employeeFullName, searchEmployeeOptionsByName, useEmployeeByPin } from "@/features/employees/employees";
import { DiscountAmount, EmployeeCodeField, SelectedDiscountEmployee, MIN_DISCOUNT_AMOUNT, formatDiscountLongDate, parseDiscountAmount, type EmployeeDiscountForm } from "@/features/employee-discounts/employee-discounts";

// Resumen en lenguaje claro de lo que verá el empleado
function DiscountSummary({ control }: { control: Control<EmployeeDiscountForm> }) {
  const [code, amountText, date] = useWatch({ control, name: ['code', 'amount', 'date'] });
  const { data: employee } = useEmployeeByPin(code);
  const amount = parseDiscountAmount(amountText);
  const hasAmount = amountText !== '' && amount >= MIN_DISCOUNT_AMOUNT;
  const name = employee && employee.pin === code ? employeeFullName(employee) : null;

  return (
    <section aria-live="polite" className="rounded-2xl border border-rose-200 bg-rose-50/60 px-5 py-4 dark:border-rose-900/60 dark:bg-rose-950/30">
      <p className="text-xs font-semibold uppercase tracking-wider text-rose-700/80 dark:text-rose-300/80">Monto a descontar</p>
      <div className="mt-1 min-h-14">
        {hasAmount ? (
          <DiscountAmount amount={amount} size="lg" />
        ) : (
          <span className="text-5xl font-bold tabular-nums text-rose-300 dark:text-rose-900">−Q0.00</span>
        )}
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">
        {name ? <>A <strong className="font-semibold text-slate-900 dark:text-gray-100">{name}</strong></> : 'Seleccione el trabajador'}
        {date ? <> · {formatDiscountLongDate(date)}</> : ''}
      </p>
    </section>
  )
}

type SearchMode = 'code' | 'name';

const searchModes: { value: SearchMode; label: string; icon: React.ReactNode }[] = [
  { value: 'code', label: 'Por código', icon: <Hash className="h-3.5 w-3.5" aria-hidden /> },
  { value: 'name', label: 'Por nombre', icon: <Search className="h-3.5 w-3.5" aria-hidden /> }
];

type Props = {
  register: UseFormRegister<EmployeeDiscountForm>;
  control: Control<EmployeeDiscountForm>;
  errors: FieldErrors<EmployeeDiscountForm>;
}

export function Form({ register, control, errors }: Props) {
  const code = useWatch({ control, name: 'code' });
  const [mode, setMode] = useState<SearchMode>('code');
  // Etiqueta del trabajador ya elegido (edición o cambio de modo), que puede no venir en la primera página del buscador
  const { data: employee } = useEmployeeByPin(code);
  const selectedLabel = employee && employee.pin === code ? `${employeeFullName(employee)} (${employee.pin})` : undefined;

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Buscar trabajador</span>
          <div role="radiogroup" aria-label="Buscar trabajador" className="inline-flex rounded-lg bg-slate-100 p-0.5 dark:bg-gray-800">
            {searchModes.map(option => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={mode === option.value}
                onClick={() => setMode(option.value)}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${mode === option.value
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
                  : 'text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-gray-200'}`}
              >
                {option.icon} {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* En ambos modos al backend solo viaja el PIN (code); la foto es solo para confirmar a la persona */}
        {mode === 'code' ? (
          <EmployeeCodeField control={control} errorMessage={errors.code?.message} />
        ) : (
          <SearchSelectFormField<EmployeeDiscountForm>
            label="Nombre del trabajador"
            name="code"
            control={control}
            queryKey={['getEmployees', 'byName']}
            fetchOptions={searchEmployeeOptionsByName}
            placeholder="Buscar por nombre"
            emptyMessage="No se encontraron empleados"
            initialLabel={selectedLabel}
            validation={{ required: 'El trabajador es requerido' }}
            errorMessage={errors.code?.message}
          />
        )}
        <SelectedDiscountEmployee pin={code} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">Monto (Q)</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500 dark:text-gray-400">Q</span>
            <input
              id="amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min={MIN_DISCOUNT_AMOUNT}
              placeholder="0.00"
              aria-invalid={!!errors.amount}
              className={`${errors.amount ? 'text_form_field_error' : 'text_form_field'} pl-8! tabular-nums`}
              {...register('amount', {
                required: 'El monto es requerido',
                validate: (value) => {
                  const amount = parseDiscountAmount(value);
                  if (Number.isNaN(amount)) return 'Ingrese un monto válido';
                  if (amount < MIN_DISCOUNT_AMOUNT) return `El monto mínimo es Q${MIN_DISCOUNT_AMOUNT.toFixed(2)}`;
                  return true;
                }
              })}
            />
          </div>
          <p className="text-red-400 text-xs">{errors.amount?.message}</p>
        </div>

        <DateFormField<EmployeeDiscountForm>
          label="Fecha del descuento"
          name="date"
          register={register}
          validation={{ required: 'La fecha es requerida' }}
          errorMessage={errors.date?.message}
        />
      </div>

      <DiscountSummary control={control} />
    </>
  )
}
