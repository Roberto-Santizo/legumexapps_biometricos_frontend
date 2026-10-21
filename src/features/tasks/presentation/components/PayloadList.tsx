import { formatTaskValue, taskFieldLabels } from "@/features/tasks/tasks";

type Props = {
    values: Record<string, unknown>;
}

// El payload cambia según el tipo de tarea, por eso se recorre tal como lo envía el backend
export function PayloadList({ values }: Props) {
    const entries = Object.entries(values);

    if (entries.length === 0) return (
        <p className="rounded-2xl border border-slate-200 px-5 py-4 text-sm text-slate-500 dark:border-gray-700 dark:text-gray-400">Sin datos</p>
    )

    return (
        <dl className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 dark:divide-gray-800 dark:border-gray-700 dark:bg-gray-900">
            {entries.map(([key, value]) => (
                <div key={key} className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-[220px_1fr] sm:items-center">
                    <dt className="text-sm text-slate-500 dark:text-gray-400">{taskFieldLabels[key] ?? key}</dt>
                    <dd className="text-sm font-semibold break-all tabular-nums text-slate-900 dark:text-gray-100">{formatTaskValue(value)}</dd>
                </div>
            ))}
        </dl>
    )
}
