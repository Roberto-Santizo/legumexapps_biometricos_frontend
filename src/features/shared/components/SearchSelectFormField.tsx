import { useState } from "react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Controller, type Control, type FieldValues, type Path, type RegisterOptions } from "react-hook-form";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useDebounce } from "@/features/shared/shared";

export type SelectOption = {
    value: string;
    label: string;
}

type Props<T extends FieldValues> = {
    label: string;
    name: Path<T>;
    control: Control<T>;
    // Prefijo del queryKey; usar el mismo de la entidad para que sus invalidaciones refresquen las opciones
    queryKey: string;
    // Recibe el texto buscado y devuelve las opciones a mostrar (búsqueda en el backend)
    fetchOptions: (search: string) => Promise<SelectOption[]>;
    placeholder?: string;
    errorMessage?: string;
    validation?: Omit<RegisterOptions<T, Path<T>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    // Etiqueta del valor precargado (edición), que puede no venir en la primera página de resultados
    initialLabel?: string;
    emptyMessage?: string;
    // Se ejecuta solo cuando el usuario selecciona una opción (no con reset/setValue)
    onValueChange?: (value: string) => void;
}

export function SearchSelectFormField<T extends FieldValues>({ label, name, control, validation, ...rest }: Props<T>) {
    return (
        <Controller
            name={name}
            control={control}
            rules={validation}
            render={({ field }) => (
                <SearchSelect
                    {...rest}
                    id={name}
                    label={label}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                />
            )}
        />
    )
}

type SearchSelectProps = Omit<Props<FieldValues>, 'name' | 'control' | 'validation'> & {
    id: string;
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
}

function SearchSelect({ id, label, value, onChange, onBlur, queryKey, fetchOptions, placeholder = 'Buscar...', errorMessage, initialLabel, emptyMessage = 'Sin resultados', onValueChange }: SearchSelectProps) {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<SelectOption | null>(null);
    const debouncedSearch = useDebounce(search.trim());

    const { data: options = [], isFetching } = useQuery({
        queryKey: [queryKey, 'search', debouncedSearch],
        queryFn: () => fetchOptions(debouncedSearch),
        placeholderData: keepPreviousData
    });

    const labelFor = (optionValue: string) => {
        if (!optionValue) return '';
        return options.find(option => option.value === optionValue)?.label
            ?? (selected?.value === optionValue ? selected.label : undefined)
            ?? initialLabel
            ?? optionValue;
    }

    const handleChange = (optionValue: string | null) => {
        setSelected(options.find(option => option.value === optionValue) ?? null);
        onChange(optionValue ?? '');
        onValueChange?.(optionValue ?? '');
    }

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor={id}>
                {label}
            </label>

            <Combobox value={value} onChange={handleChange} onClose={() => setSearch('')} immediate>
                <div className="relative w-full">
                    <ComboboxInput
                        id={id}
                        autoComplete="off"
                        placeholder={placeholder}
                        aria-invalid={!!errorMessage}
                        className={`${errorMessage ? 'text_form_field_error' : 'text_form_field'} pr-10!`}
                        displayValue={labelFor}
                        onChange={(e) => setSearch(e.target.value)}
                        onBlur={onBlur}
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 dark:text-gray-500">
                        <ChevronDownIcon size={18} aria-hidden="true" />
                    </ComboboxButton>
                </div>

                <ComboboxOptions
                    anchor="bottom start"
                    transition
                    className="z-50 max-h-64 w-(--input-width) overflow-y-auto rounded-xl bg-white p-1 shadow-xl ring-1 ring-black/5 [--anchor-gap:6px] transition duration-150 ease-out empty:invisible data-closed:opacity-0 dark:bg-gray-800 dark:ring-white/10"
                >
                    {options.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-slate-500 dark:text-gray-400">
                            {isFetching ? 'Buscando...' : emptyMessage}
                        </div>
                    ) : options.map(option => (
                        <ComboboxOption
                            key={option.value}
                            value={option.value}
                            className="group flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-slate-900 select-none data-focus:bg-black/5 dark:text-gray-100 dark:data-focus:bg-white/10"
                        >
                            {option.label}
                            <CheckIcon size={16} className="invisible text-green-600 group-data-selected:visible dark:text-green-400" aria-hidden="true" />
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </Combobox>

            <p className="text-red-400 text-xs">{errorMessage}</p>
        </div>
    )
}
