import { FilterDrawer, Title, useRoles, WorkingOnIt } from "@/features/shared/shared";
import { useSelector } from "react-redux";
import type { RootState } from "@/config/config";
import { ValidRoles } from "@/features/auth/auth";
import { Building2, Briefcase, CalendarClock, Fingerprint, Images, TriangleAlert, UserX, Users } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { dashboardRepositoryProvider, formatDay, formatNumber, Panel, PanelError, PanelSkeleton, percentage, SegmentBar, StatCard, StatCardSkeleton, TaskList, type DashboardFilters } from "@/features/dashboard/dashboard";

export function Dashboard() {
    const user = useSelector((state: RootState) => state.auth.user)!;
    const { hasRole } = useRoles();

    return (
        <div className="space-y-5">
            <Title title={`Bienvenido, ${user.name}`} subtitle="Plataforma de Biométricos" />
            {/* Los endpoints del dashboard solo están disponibles para admin y rrhh */}
            {hasRole(ValidRoles.admin, ValidRoles.rrhh) ? <DashboardMetrics /> : <WorkingOnIt />}
        </div>
    )
}

function DashboardMetrics() {
    const [searchParams, setSearchParams] = useSearchParams();
    const filters: DashboardFilters = {
        start_date: searchParams.get('start_date') ?? '',
        end_date: searchParams.get('end_date') ?? ''
    };

    const summary = useQuery({
        queryKey: ['getDashboardSummary', filters],
        queryFn: () => dashboardRepositoryProvider.getSummary(filters)
    });

    const tasks = useQuery({
        queryKey: ['getDashboardTasks', filters],
        queryFn: () => dashboardRepositoryProvider.getTasks(filters)
    });

    const positions = useQuery({
        queryKey: ['getDashboardPositions'],
        queryFn: () => dashboardRepositoryProvider.getPositions()
    });

    // El rango aplicado lo devuelve el backend (por defecto últimos 30 días)
    const range = tasks.data;
    const rangeLabel = range ? `${formatDay(range.start_date, { dateStyle: 'medium' })} – ${formatDay(range.end_date, { dateStyle: 'medium' })}` : 'Últimos 30 días';

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <FilterDrawer
                    title="Rango de fechas"
                    fields={[
                        { name: 'start_date', label: 'Fecha de inicio', type: 'date' },
                        { name: 'end_date', label: 'Fecha de fin', type: 'date' },
                    ]}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />
                <p className="text-sm text-slate-500 dark:text-gray-400">Periodo: <span className="font-medium text-slate-700 dark:text-gray-300">{rangeLabel}</span></p>
            </div>

            {summary.isError && <PanelError message={summary.error.message} />}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summary.isLoading && [...Array(8)].map((_, index) => <StatCardSkeleton key={index} />)}

                {summary.data && (
                    <>
                        <StatCard primary tone="blue" icon={<Users />} label="Empleados activos" value={formatNumber(summary.data.employees_total)} to="/empleados" />
                        <StatCard
                            primary
                            tone="green"
                            icon={<Fingerprint />}
                            label="Marcajes hoy"
                            value={formatNumber(summary.data.transactions_today)}
                            hint={`${formatNumber(summary.data.employees_marked_today)} empleados marcaron (${percentage(summary.data.employees_marked_today, summary.data.employees_total)}%)`}
                            to="/transacciones-empleados"
                        />
                        <StatCard
                            primary
                            tone="violet"
                            icon={<Briefcase />}
                            label="Posiciones vacantes"
                            value={formatNumber(summary.data.positions_vacant)}
                            hint={`${formatNumber(summary.data.positions_occupied)} de ${formatNumber(summary.data.positions_total)} ocupadas`}
                            to="/posiciones"
                        />
                        <StatCard
                            primary
                            tone={summary.data.tasks_failed > 0 ? 'red' : 'amber'}
                            icon={summary.data.tasks_failed > 0 ? <TriangleAlert /> : <CalendarClock />}
                            label="Tareas pendientes"
                            value={formatNumber(summary.data.tasks_pending)}
                            hint={`${formatNumber(summary.data.tasks_failed)} fallidas`}
                            to="/tareas"
                        />
                        <StatCard icon={<UserX />} label="Bajas en el periodo" value={formatNumber(summary.data.inactive_employees_in_range)} to="/empleados-inactivos" />
                        <StatCard icon={<Building2 />} label="Departamentos" value={formatNumber(summary.data.departments_total)} to="/departamentos" />
                        <StatCard icon={<Briefcase />} label="Posiciones" value={formatNumber(summary.data.positions_total)} to="/posiciones" />
                        <StatCard
                            icon={<Images />}
                            label="Fotos registradas"
                            value={formatNumber(summary.data.photos_total)}
                            hint={`${percentage(summary.data.photos_total, summary.data.employees_total)}% de los empleados activos`}
                            to="/fotos"
                        />
                    </>
                )}
            </div>

            {/* Tareas */}
            {tasks.isLoading && (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <PanelSkeleton />
                    <PanelSkeleton />
                </div>
            )}
            {tasks.isError && <PanelError message={tasks.error.message} />}
            {tasks.data && (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <Panel title="Próximas tareas" subtitle="Pendientes desde hoy" action={<Link to="/tareas" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Ver todas</Link>}>
                        <TaskList tasks={tasks.data.upcoming} emptyMessage="No hay tareas pendientes" />
                    </Panel>

                    <Panel title="Últimas tareas fallidas" subtitle="Requieren revisión">
                        <TaskList tasks={tasks.data.recent_failed} emptyMessage="No hay tareas fallidas" showError />
                    </Panel>
                </div>
            )}

            {/* Posiciones */}
            {positions.isLoading && <PanelSkeleton />}
            {positions.isError && <PanelError message={positions.error.message} />}
            {positions.data && (
                <Panel
                    title="Ocupación de posiciones"
                    subtitle={`${formatNumber(positions.data.total)} posiciones registradas`}
                    action={<Link to="/posiciones" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Ver todas</Link>}
                >
                    <div className="space-y-5">
                        <SegmentBar
                            segments={[
                                { label: 'Ocupadas', value: positions.data.occupied, color: 'bg-violet-500' },
                                { label: 'Vacantes', value: positions.data.vacant, color: 'bg-slate-300 dark:bg-gray-600' },
                            ]}
                        />

                        {positions.data.vacant_list.length > 0 && (
                            <div>
                                <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-gray-300">
                                    Vacantes
                                    {positions.data.vacant > positions.data.vacant_list.length && <span className="ml-1 text-xs font-normal text-slate-500 dark:text-gray-400">(primeras {positions.data.vacant_list.length} de {formatNumber(positions.data.vacant)})</span>}
                                </h3>
                                <ul className="flex flex-wrap gap-2">
                                    {positions.data.vacant_list.map(position => (
                                        <li key={position.id}>
                                            <Link to={`/posiciones/${position.id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800">
                                                <span className="font-semibold tabular-nums">{position.code}</span>
                                                <span className="text-slate-500 dark:text-gray-400">{position.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </Panel>
            )}
        </div>
    )
}
