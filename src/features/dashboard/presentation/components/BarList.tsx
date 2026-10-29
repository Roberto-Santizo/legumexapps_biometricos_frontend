import { useState } from "react";
import { formatNumber } from "@/features/dashboard/dashboard";
import { EmptyState } from "./Panel";

export type BarListItem = {
    key: string;
    label: string;
    value: number;
    detail?: string;
}

type Props = {
    items: BarListItem[];
    emptyMessage: string;
    // Cantidad visible antes de "Ver todos"
    limit?: number;
    barClassName?: string;
}

// Lista de barras horizontales proporcionales al valor máximo; el backend ya entrega los datos en orden descendente
export function BarList({ items, emptyMessage, limit = 8, barClassName = 'bg-blue-500/80 dark:bg-blue-400/70' }: Props) {
    const [expanded, setExpanded] = useState(false);

    if (items.length === 0) return <EmptyState message={emptyMessage} />

    const max = Math.max(...items.map(item => item.value), 1);
    const visible = expanded ? items : items.slice(0, limit);

    return (
        <div className="space-y-2.5">
            <ul className="space-y-2.5">
                {visible.map(item => (
                    <li key={item.key}>
                        <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                            <span className="truncate text-slate-700 dark:text-gray-300" title={item.label}>
                                {item.label}
                                {item.detail && <span className="ml-1.5 text-xs text-slate-400 dark:text-gray-500">{item.detail}</span>}
                            </span>
                            <span className="shrink-0 font-semibold tabular-nums text-slate-900 dark:text-gray-100">{formatNumber(item.value)}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-gray-800">
                            <div className={`h-full rounded-full ${barClassName}`} style={{ width: `${(item.value / max) * 100}%` }} />
                        </div>
                    </li>
                ))}
            </ul>

            {items.length > limit && (
                <button type="button" onClick={() => setExpanded(value => !value)} className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer dark:text-blue-400 dark:hover:text-blue-300">
                    {expanded ? 'Ver menos' : `Ver todos (${items.length})`}
                </button>
            )}
        </div>
    )
}
