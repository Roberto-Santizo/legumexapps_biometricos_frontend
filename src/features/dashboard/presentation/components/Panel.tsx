type Props = {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

export function Panel({ title, subtitle, action, className = '', children }: Props) {
    return (
        <section className={`flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:shadow-none ${className}`}>
            <header className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-gray-100">{title}</h2>
                    {subtitle && <p className="mt-0.5 text-xs text-slate-500 dark:text-gray-400">{subtitle}</p>}
                </div>
                {action}
            </header>

            <div className="flex-1">{children}</div>
        </section>
    )
}

export function PanelSkeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900 ${className}`}>
            <div className="h-4 w-40 rounded bg-slate-200 dark:bg-gray-700" />
            <div className="mt-6 space-y-3">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-3 rounded bg-slate-200 dark:bg-gray-700" style={{ width: `${90 - index * 12}%` }} />
                ))}
            </div>
        </div>
    )
}

export function PanelError({ message }: { message: string }) {
    return (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
            {message}
        </p>
    )
}

export function EmptyState({ message }: { message: string }) {
    return <p className="py-6 text-center text-sm text-slate-500 dark:text-gray-400">{message}</p>
}
