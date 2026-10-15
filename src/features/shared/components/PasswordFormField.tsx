import { Eye, EyeClosed } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { FieldValues, Path, RegisterOptions, UseFormRegister } from "react-hook-form";

type Props<T extends FieldValues> = {
    label: string;
    name: Path<T>;
    placeholder: string;
    errorMessage?: string;
    register: UseFormRegister<T>;
    validation: RegisterOptions<T, Path<T>>;
    icon?: ReactNode;
    autoComplete?: string;
    readOnly?: boolean;
}


export function PasswordFormField<T extends FieldValues>({ label, name, placeholder, errorMessage, register, validation, icon, autoComplete = "off", readOnly }: Props<T>) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

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
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    readOnly={readOnly}
                    aria-invalid={!!errorMessage}
                    className={`${errorMessage ? "text_form_field_error" : "text_form_field"} pr-10! ${icon ? "pl-10!" : ""}`}
                />

                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors dark:text-gray-500 dark:hover:text-gray-300"
                >
                    {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                </button>
            </div>

            <p className="text-red-400 text-xs">{errorMessage}</p>
        </div>
    )
}
