import type { ReactNode } from "react";
import type { FieldValues, Path, PathValue, RegisterOptions, UseFormRegister } from "react-hook-form";

type Props<T extends FieldValues> = {
    label: string;
    name: Path<T>;
    placeholder: string;
    type: string;
    errorMessage?: string;
    register: UseFormRegister<T>;
    validation: RegisterOptions<T, Path<T>>;
    value?: PathValue<T, Path<T>>
    icon?: ReactNode;
    autoComplete?: string;
    readOnly?: boolean;
}


export function TextFormField<T extends FieldValues>({ label, name, placeholder, type, errorMessage, register, validation, value, icon, autoComplete = "off", readOnly }: Props<T>) {
    return (
        <div className="flex flex-col gap-2">
            <label
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                htmlFor={name}
            >
                {label}
            </label>

            <div className="relative w-full">
                {icon && (
                    <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-gray-400 dark:text-gray-500">
                        {icon}
                    </span>
                )}

                <input
                    {...register(name, validation)}
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    readOnly={readOnly}
                    aria-invalid={!!errorMessage}
                    className={`${errorMessage ? 'text_form_field_error' : 'text_form_field'} ${icon ? 'pl-10!' : ''}`}
                    value={value}
                />
            </div>
            <p className="text-red-400 text-xs">{errorMessage}</p>
        </div>
    )
}
