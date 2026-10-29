import { Link } from "react-router-dom";

type Tone = 'blue' | 'green' | 'amber' | 'red' | 'slate' | 'violet';

const toneClasses: Record<Tone, string> = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
    green: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
    red: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
    slate: "bg-slate-100 text-slate-600 dark:bg-gray-700/60 dark:text-gray-300",
    violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"
};

type Props = {
    icon: React.ReactNode;
    label: string;
    value: string;
    hint?: string;
    tone?: Tone;
    to?: string;
}

export function StatCard({ icon, label, value, hint, tone = 'slate', to }: Props) {
    const content = (
        <>
            <div className="flex items-center gap-3">
                <span className={`rounded-xl p-2 [&>svg]:h-5 [&>svg]:w-5 ${toneClasses[tone]}`}>{icon}</span>
                <span className="text-sm font-medium text-slate-500 dark:text-gray-400">{label}</span>
            </div>

            <p className="mt-3 text-2xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-gray-100">{value}</p>
            {hint && <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">{hint}</p>}
        </>
    );

    const className = "block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:shadow-none";

    if (to) {
        return (
            <Link to={to} className={`${className} transition hover:border-slate-300 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:border-gray-600`}>
                {content}
            </Link>
        )
    }

    return <div className={className}>{content}</div>
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
