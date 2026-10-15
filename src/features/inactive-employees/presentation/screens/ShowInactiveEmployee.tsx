import { CustomFilledButton, Spinner, useNotification } from "@/features/shared/shared";
import { inactiveEmployeesRepositoryProvider } from "@/features/inactive-employees/inactive-employees";
import { employeeFullName } from "@/features/employees/employees";
import { ArrowLeft, Building2, CalendarX, Hash, IdCard, User, UserCheck, UserPen, UserPlus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

const formatDate = (value?: string | null) => value ? new Date(value).toLocaleString('es-GT') : '—';

// Los usuarios de auditoría se muestran como "Nombre (código)" cuando hay código
const formatUser = (name?: string | null, code?: string | null) => {
    if (!name) return code || '—';
    return code ? `${name} (${code})` : name;
}

type Row = { icon: React.ReactNode; label: string; value: string | number };

function PropertyList({ items }: { items: Row[] }) {
    return (
        <dl className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 dark:divide-gray-800 dark:border-gray-700 dark:bg-gray-900">
            {items.map(row => (
                <div key={row.label} className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-[220px_1fr] sm:items-center">
                    <dt className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">{row.icon}{row.label}</dt>
                    <dd className="text-sm font-semibold tabular-nums text-slate-900 dark:text-gray-100">{row.value}</dd>
                </div>
            ))}
        </dl>
    );
}

export function ShowInactiveEmployee() {
    const params = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const notification = useNotification();
    const id = params.id!;

    const { data, isLoading, error } = useQuery({
        queryKey: ['getInactiveEmployeeById', id],
        queryFn: () => inactiveEmployeesRepositoryProvider.getInactiveEmployeeById(id)
    });

    const { mutate, isPending } = useMutation({
        mutationFn: () => inactiveEmployeesRepositoryProvider.reActivateEmployee(id),
        onSuccess: (message) => {
            notification.success(message);
            queryClient.invalidateQueries({ queryKey: ['getInactiveEmployees'] });
            queryClient.invalidateQueries({ queryKey: ['getEmployees'] });
            queryClient.removeQueries({ queryKey: ['getInactiveEmployeeById', id] });
            navigate('/empleados-inactivos');
        },
        onError: (err) => {
            notification.error(err.message);
        }
    });

    const handleReActivate = () => notification.question(
        '¿Desea reactivar al empleado?',
        'Reactivar',
        'El empleado será dado de alta nuevamente en ZKBioAccess',
        () => mutate()
    );

    if (isLoading) return <Spinner />
    if (error) return (
        <p className="text-center text-sm text-red-600 dark:text-red-400">No se pudo cargar el empleado: {error.message}</p>
    )
    if (data) {
        const rows: Row[] = [
            { icon: <Hash className="h-4 w-4" />, label: 'PIN', value: data.pin },
            { icon: <User className="h-4 w-4" />, label: 'Nombres', value: data.name },
            { icon: <IdCard className="h-4 w-4" />, label: 'Apellidos', value: data.last_name || '—' },
            { icon: <Building2 className="h-4 w-4" />, label: 'Departamento', value: data.department || '—' },
            { icon: <CalendarX className="h-4 w-4" />, label: 'Fecha de baja', value: formatDate(data.leave_date) },
        ];
        const audit: Row[] = [
            { icon: <UserPlus className="h-4 w-4" />, label: 'Creado por', value: formatUser(data.creater_name, data.creater_code) },
            { icon: <UserPen className="h-4 w-4" />, label: 'Actualizado por', value: formatUser(data.updater_name, data.updater_code) },
        ];

        return (
            <div className="mx-auto w-full max-w-4xl space-y-6">
                <button type="button" onClick={() => navigate('/empleados-inactivos')} className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer dark:text-gray-400 dark:hover:text-gray-100">
                    <ArrowLeft className="h-4 w-4" /> Empleados inactivos
                </button>

                <div className="space-y-3">
                    <h1 className="text-2xl font-bold leading-tight tracking-tight text-balance text-slate-900 sm:text-3xl dark:text-gray-100">{employeeFullName(data)}</h1>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-300">
                        <CalendarX className="h-3.5 w-3.5" />
                        Dado de baja
                    </span>
                </div>

                <PropertyList items={rows} />

                <section className="space-y-3">
                    <h2 className="text-base font-semibold text-slate-900 dark:text-gray-100">Registro</h2>
                    <PropertyList items={audit} />
                </section>

                <div className="flex flex-col gap-4 rounded-2xl border border-emerald-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-emerald-500/30">
                    <div>
                        <h2 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Reactivar empleado</h2>
                        <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">El empleado será dado de alta nuevamente en ZKBioAccess.</p>
                    </div>
                    <CustomFilledButton
                        label="Reactivar"
                        type="button"
                        icon={<UserCheck className="h-4 w-4 text-white" />}
                        disabled={isPending}
                        loading={isPending}
                        className="flex-none bg-emerald-600! hover:bg-emerald-700! focus:ring-emerald-500!"
                        onClick={handleReActivate}
                    />
                </div>
            </div>
        )
    }
}
