import { formatNumber, percentage } from "@/features/dashboard/dashboard";

export type Segment = {
    label: string;
    value: number;
    // Clase de fondo de Tailwind para el segmento y su marcador en la leyenda
    color: string;
}

// Barra apilada con leyenda para mostrar la composición de un total (ocupadas/vacantes, estados de tareas)
export function SegmentBar({ segments }: { segments: Segment[] }) {
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);

    return (
        <div className="space-y-3">
            <div className="flex h-3 gap-0.5 overflow-hidden rounded-full bg-slate-100 dark:bg-gray-800">
                {total > 0 && segments.filter(segment => segment.value > 0).map(segment => (
                    <div key={segment.label} className={segment.color} style={{ width: `${(segment.value / total) * 100}%` }} title={`${segment.label}: ${formatNumber(segment.value)}`} />
                ))}
            </div>

            <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
                {segments.map(segment => (
                    <li key={segment.label} className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
                        <span className={`h-2.5 w-2.5 rounded-full ${segment.color}`} />
                        {segment.label}
                        <span className="font-semibold tabular-nums text-slate-900 dark:text-gray-100">{formatNumber(segment.value)}</span>
                        <span className="text-xs tabular-nums">({percentage(segment.value, total)}%)</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
