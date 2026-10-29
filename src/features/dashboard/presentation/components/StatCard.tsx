import { Link } from "react-router-dom";

type Tone = 'blue' | 'green' | 'amber' | 'red' | 'slate' | 'violet';

// Tonos -600 de la paleta: suficiente contraste para el icono blanco del distintivo
const toneColors: Record<Tone, string> = {
    blue: 'oklch(54.6% 0.245 262.881)',
    green: 'oklch(62.7% 0.194 149.214)',
    amber: 'oklch(66.6% 0.179 58.318)',
    red: 'oklch(57.7% 0.245 27.325)',
    slate: 'oklch(55.4% 0.046 257.417)',
    violet: 'oklch(54.1% 0.281 293.009)'
};

type Props = {
    icon: React.ReactNode;
    label: string;
    value: string;
    hint?: string;
    tone?: Tone;
    to?: string;
    /** Métrica principal: tarjeta teñida con su tono. Si no, fila compacta neutra */
    primary?: boolean;
}

export function StatCard({ icon, label, value, hint, tone = 'slate', to, primary = false }: Props) {
    const content = primary ? (
        <>
            <div className="flex items-center gap-3">
                <span className="stat-card__chip rounded-xl p-2 [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
                <span className="text-sm font-medium text-slate-700 dark:text-gray-200">{label}</span>
            </div>

            <p className="stat-card__value mt-4 text-3xl font-bold tabular-nums tracking-tight">{value}</p>
            {hint && <p className="mt-1 text-xs text-slate-600 dark:text-gray-300">{hint}</p>}
        </>
    ) : (
        <>
            <span className="shrink-0 text-slate-400 dark:text-gray-500 [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
            <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-slate-600 dark:text-gray-300">{label}</span>
                {hint && <span className="block truncate text-xs text-slate-500 dark:text-gray-400">{hint}</span>}
            </span>
            <span className="text-xl font-semibold tabular-nums text-slate-900 dark:text-gray-100">{value}</span>
        </>
    );

    const className = primary
        ? "stat-card flex flex-col rounded-2xl border p-5"
        : "flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-gray-700/70 dark:bg-gray-900/60";
    const style = primary ? { '--tone': toneColors[tone] } as React.CSSProperties : undefined;

    if (to) {
        const interactive = primary ? "" : "hover:border-slate-300 hover:bg-white dark:hover:border-gray-600 dark:hover:bg-gray-900";
        return (
            <Link to={to} style={style} className={`${className} ${interactive} transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}>
                {content}
            </Link>
        )
    }

    return <div style={style} className={className}>{content}</div>
}

export function StatCardSkeleton() {
    return (
        <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-gray-700" />
                <div className="h-3 w-24 rounded bg-slate-200 dark:bg-gray-700" />
            </div>
            <div className="mt-4 h-6 w-20 rounded bg-slate-200 dark:bg-gray-700" />
        </div>
    )
}
