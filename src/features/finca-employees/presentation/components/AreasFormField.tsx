import type { UseFormRegister } from "react-hook-form";
import type { FincaArea, FincaEmployeeForm } from "@/features/finca-employees/finca-employees";

type Props = {
    register: UseFormRegister<FincaEmployeeForm>;
    areas: FincaArea[];
    errorMessage?: string;
}

export function AreasFormField({ register, areas, errorMessage }: Props) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Áreas</span>

            {areas.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-gray-400">No hay áreas registradas</p>
            ) : (
                <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
                    {areas.map(area => (
                        <label
                            key={area.id}
                            className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:border-gray-300 has-checked:border-blue-500 has-checked:bg-blue-50 has-checked:text-blue-800 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:has-checked:bg-blue-500/15 dark:has-checked:text-blue-200"
                        >
                            <input
                                type="checkbox"
                                value={area.id}
                                className="accent-blue-600"
                                {...register('area', {
                                    validate: (ids) => [ids].flat().filter(Boolean).length > 0 || 'Seleccione al menos un área'
                                })}
                            />
                            {area.area_name} ({area.area_code})
                        </label>
                    ))}
                </div>
            )}

            <p className="text-red-400 text-xs">{errorMessage}</p>
        </div>
    )
}
