import type { UseFormRegister } from "react-hook-form";
import type { AccessLevel } from "@/features/access-levels/access-levels";
import type { EmployeeForm } from "@/features/employees/employees";

type Props = {
    register: UseFormRegister<EmployeeForm>;
    levels: AccessLevel[];
    errorMessage?: string;
    // En edición solo se permite un nivel de acceso
    single?: boolean;
}

export function AccessLevelsFormField({ register, levels, errorMessage, single = false }: Props) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{single ? 'Nivel de acceso' : 'Niveles de acceso'}</span>

            {levels.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-gray-400">No hay niveles de acceso registrados</p>
            ) : (
                <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
                    {levels.map(level => (
                        <label
                            key={level.id}
                            className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:border-gray-300 has-checked:border-blue-500 has-checked:bg-blue-50 has-checked:text-blue-800 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:has-checked:bg-blue-500/15 dark:has-checked:text-blue-200"
                        >
                            <input
                                type={single ? "radio" : "checkbox"}
                                value={level.id}
                                className="accent-blue-600"
                                {...register('accLevelIds', {
                                    validate: (ids) => [ids].flat().filter(Boolean).length > 0 || (single ? 'Seleccione un nivel de acceso' : 'Seleccione al menos un nivel de acceso')
                                })}
                            />
                            {level.name}
                        </label>
                    ))}
                </div>
            )}

            <p className="text-red-400 text-xs">{errorMessage}</p>
        </div>
    )
}
