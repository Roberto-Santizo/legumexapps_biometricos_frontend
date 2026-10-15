import { CustomFilledButton, Spinner, useNotification } from "@/features/shared/shared";
import { EmployeeLevels, employeeFullName, employeesRepositoryProvider } from "@/features/employees/employees";
import { ArrowLeft, Building2, CalendarClock, EditIcon, Hash, IdCard, ShieldCheck, User, UserMinus, UserPen, UserPlus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

const formatDate = (value?: string | null) => value ? new Date(value).toLocaleString('es-GT') : '—';

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

export function ShowEmployee() {
    const params = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const notification = useNotification();
    const id = params.id!;

    const { data, isLoading, error } = useQuery({
        queryKey: ['getEmployeeById', id],
        queryFn: () => employeesRepositoryProvider.getEmployeeById(id)
    });

    const { mutate, isPending } = useMutation({
        mutationFn: () => employeesRepositoryProvider.inactiveEmployee(id),
        onSuccess: (message) => {
            notification.success(message);
            queryClient.invalidateQueries({ queryKey: ['getEmployees'] });
            queryClient.removeQueries({ queryKey: ['getEmployeeById', id] });
            queryClient.removeQueries({ queryKey: ['getEmployeeLevels', id] });
            navigate('/empleados');
        },
        onError: (err) => {
            notification.error(err.message);
        }
    });

    const handleInactive = () => notification.question(
        '¿Desea dar de baja al empleado?',
        'Dar de baja',
        'El empleado será dado de baja en ZKBioAccess',
        () => mutate()
    );

    if (isLoading) return <Spinner />
    if (error) return (
        <p className="text-center text-sm text-red-600 dark:text-red-400">No se pudo cargar el empleado: {error.message}</p>
    )
    if (data) {
        const enabled = data.enabled_credential === 1;
        const rows: Row[] = [
            { icon: <Hash className="h-4 w-4" />, label: 'PIN', value: data.pin },
            { icon: <User className="h-4 w-4" />, label: 'Nombres', value: data.name },
            { icon: <IdCard className="h-4 w-4" />, label: 'Apellidos', value: data.last_name || '—' },
            { icon: <Building2 className="h-4 w-4" />, label: 'Departamento', value: data.authDepartment?.name || '—' },
            { icon: <ShieldCheck className="h-4 w-4" />, label: 'Credencial', value: enabled ? 'Habilitada' : 'Deshabilitada' },
        ];
        const audit: Row[] = [
            { icon: <UserPlus className="h-4 w-4" />, label: 'Creado por', value: data.creater_name || '—' },
            { icon: <CalendarClock className="h-4 w-4" />, label: 'Fecha de creación', value: formatDate(data.create_time) },
            { icon: <UserPen className="h-4 w-4" />, label: 'Actualizado por', value: data.updater_name || '—' },
            { icon: <CalendarClock className="h-4 w-4" />, label: 'Última actualización', value: formatDate(data.update_time) },
        ];

        return (
            <div className="mx-auto w-full max-w-4xl space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <button type="button" onClick={() => navigate('/empleados')} className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer dark:text-gray-400 dark:hover:text-gray-100">
                        <ArrowLeft className="h-4 w-4" /> Empleados
                    </button>
                    <CustomFilledButton
                        label="Editar"
                        type="button"
                        icon={<EditIcon className="h-4 w-4 text-white" />}
                        onClick={() => navigate(`/empleados/${id}/editar`)}
                    />
                </div>

                <div className="space-y-3">
                    <h1 className="text-2xl font-bold leading-tight tracking-tight text-balance text-slate-900 sm:text-3xl dark:text-gray-100">{employeeFullName(data)}</h1>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${enabled ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'}`}>
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Credencial {enabled ? 'habilitada' : 'deshabilitada'}
                    </span>
                </div>

                <PropertyList items={rows} />

                <section className="space-y-3">
                    <h2 className="text-base font-semibold text-slate-900 dark:text-gray-100">Registro</h2>
                    <PropertyList items={audit} />
                </section>

                <EmployeeLevels employeeId={id} />

                <div className="flex flex-col gap-4 rounded-2xl border border-red-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-red-500/30">
                    <div>
                        <h2 className="text-sm font-semibold text-red-700 dark:text-red-300">Dar de baja empleado</h2>
                        <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">El empleado será dado de baja en ZKBioAccess.</p>
                    </div>
                    <CustomFilledButton
                        label="Dar de baja"
                        type="button"
                        icon={<UserMinus className="h-4 w-4 text-white" />}
                        disabled={isPending}
                        loading={isPending}
                        className="flex-none bg-red-600! hover:bg-red-700! focus:ring-red-500!"
                        onClick={handleInactive}
                    />
                </div>
            </div>
        )
    }
}
