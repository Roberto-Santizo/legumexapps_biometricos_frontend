import type { UseFormRegister } from "react-hook-form";
import { roleOptions, type UserForm } from "@/features/users/users";

type Props = {
    register: UseFormRegister<UserForm>;
    errorMessage?: string;
}

export function RolesFormField({ register, errorMessage }: Props) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Roles</span>

            <div className="flex flex-wrap gap-3">
                {roleOptions().map(option => (
                    <label
                        key={option.value}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:border-gray-300 has-checked:border-blue-500 has-checked:bg-blue-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:has-checked:bg-blue-500/15"
                    >
                        <input
                            type="checkbox"
                            value={option.value}
                            className="accent-blue-600"
                            {...register('roles', {
                                validate: (roles) => (Array.isArray(roles) && roles.length > 0) || 'Seleccione al menos un rol'
                            })}
                        />
                        {option.label}
                    </label>
                ))}
            </div>

            <p className="text-red-400 text-xs">{errorMessage}</p>
        </div>
    )
}
