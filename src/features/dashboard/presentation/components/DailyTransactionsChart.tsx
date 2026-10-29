import { formatDay, formatNumber, type DashboardTransactions } from "@/features/dashboard/dashboard";
import { EmptyState } from "./Panel";

type Props = {
    transactions: DashboardTransactions;
}

const DAY_MS = 24 * 60 * 60 * 1000;

// El backend omite los días sin marcajes; se completa el rango para que la serie no salte días
const fillDays = ({ start_date, end_date, daily }: DashboardTransactions) => {
    const byDate = new Map(daily.map(day => [day.date.slice(0, 10), day]));
    const start = Date.parse(`${start_date}T00:00:00Z`);
    const end = Date.parse(`${end_date}T00:00:00Z`);

    if (Number.isNaN(start) || Number.isNaN(end) || end < start) return daily;

    const days = [];
    for (let time = start; time <= end; time += DAY_MS) {
        const date = new Date(time).toISOString().slice(0, 10);
        days.push(byDate.get(date) ?? { date, total: 0, unique_employees: 0 });
    }
    return days;
}

export function DailyTransactionsChart({ transactions }: Props) {
    if (transactions.daily.length === 0) return <EmptyState message="No hay marcajes en el rango seleccionado" />

    const days = fillDays(transactions);
    const max = Math.max(...days.map(day => day.total), 1);
    // Con rangos largos solo se rotulan algunas fechas del eje para que no se encimen
    const labelEvery = Math.max(1, Math.ceil(days.length / 8));

    return (
        <div>
            <div className="flex h-48 items-end gap-px sm:gap-0.5" role="img" aria-label={`Marcajes diarios del ${formatDay(transactions.start_date)} al ${formatDay(transactions.end_date)}`}>
                {days.map(day => (
                    <div key={day.date} className="group relative flex h-full flex-1 items-end">
                        <div
                            className="w-full rounded-t-sm bg-blue-500/80 transition-colors group-hover:bg-blue-600 dark:bg-blue-400/70 dark:group-hover:bg-blue-300"
                            style={{ height: `${Math.max((day.total / max) * 100, day.total > 0 ? 2 : 0)}%` }}
                        />
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-md group-hover:block dark:border-gray-700 dark:bg-gray-800">
                            <p className="font-semibold text-slate-900 dark:text-gray-100">{formatDay(day.date, { weekday: 'short', day: '2-digit', month: 'short' })}</p>
                            <p className="text-slate-600 dark:text-gray-300">{formatNumber(day.total)} marcajes</p>
                            <p className="text-slate-500 dark:text-gray-400">{formatNumber(day.unique_employees)} empleados</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-2 flex gap-px border-t border-slate-200 pt-1.5 sm:gap-0.5 dark:border-gray-700">
                {days.map((day, index) => (
                    <span key={day.date} className="flex-1 overflow-visible whitespace-nowrap text-[10px] text-slate-500 tabular-nums dark:text-gray-400">
                        {index % labelEvery === 0 ? formatDay(day.date) : ''}
                    </span>
                ))}
            </div>
        </div>
    )
}
