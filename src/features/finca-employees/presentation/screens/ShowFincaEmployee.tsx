import { CustomFilledButton, Spinner, useNotification } from "@/features/shared/shared";
import { FincaEmployeeAreas, ResignBadge, fincaEmployeeFullName, fincaEmployeesRepositoryProvider } from "@/features/finca-employees/finca-employees";
import { ArrowLeft, Building2, IdCard, User, UserCheck, UserMinus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export function ShowFincaEmployee() {
    const params = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const notification = useNotification();
    const id = params.id!;

    const { data, isLoading, error } = useQuery({
        queryKey: ['getFincaEmployeeById', id],
        queryFn: () => fincaEmployeesRepositoryProvider.getFincaEmployeeById(id)
    });

    // Según el estado actual se da de baja o se reincorpora al empleado en BioTime
    const { mutate, isPending } = useMutation({
        mutationFn: (resign: boolean) => resign
            ? fincaEmployeesRepositoryProvider.reinstateFincaEmployee(id)
            : fincaEmployeesRepositoryProvider.resignFincaEmployee(id),
        onSuccess: (message) => {
            notification.success(message);
            queryClient.invalidateQueries({ queryKey: ['getFincaEmployees'] });
            queryClient.invalidateQueries({ queryKey: ['getFincaEmployeeById', id] });
        },
        onError: (err) => {
            notification.error(err.message);
        }
    });

    if (isLoading) return <Spinner />
    if (error) return (
        <p className="text-center text-sm text-red-600 dark:text-red-400">No se pudo cargar el empleado: {error.message}</p>
    )
    if (data) {
        const handleStatus = () => data.resign
            ? notification.question(
                '¿Desea dar de alta al empleado?',
                'Dar de alta',
                'El empleado será reincorporado en BioTime',
                () => mutate(data.resign)
            )
            : notification.question(
                '¿Desea dar de baja al empleado?',
                'Dar de baja',
                'El empleado será dado de baja en BioTime con la fecha actual y se deshabilitará su asistencia',
                () => mutate(data.resign)
            );

        const rows = [
            { icon: <User className="h-4 w-4" />, label: 'Nombres', value: data.first_name },
            { icon: <User className="h-4 w-4" />, label: 'Código', value: data.last_name || '—' },
            { icon: <Building2 className="h-4 w-4" />, label: 'Departamento', value: data.department },
            { icon: <IdCard className="h-4 w-4" />, label: 'Posición', value: data.position },
        ];

        return (
            <div className="mx-auto w-full max-w-4xl space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <button type="button" onClick={() => navigate('/empleados-fincas')} className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer dark:text-gray-400 dark:hover:text-gray-100">
                        <ArrowLeft className="h-4 w-4" /> Empleados Fincas
                    </button>
                </div>

                <div className="space-y-3">
                    <h1 className="text-2xl font-bold leading-tight tracking-tight text-balance text-slate-900 sm:text-3xl dark:text-gray-100">{fincaEmployeeFullName(data)}</h1>
                    <ResignBadge resign={data.resign} />
                </div>

                <dl className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 dark:divide-gray-800 dark:border-gray-700 dark:bg-gray-900">
                    {rows.map(row => (
                        <div key={row.label} className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-[220px_1fr] sm:items-center">
                            <dt className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">{row.icon}{row.label}</dt>
                            <dd className="text-sm font-semibold tabular-nums text-slate-900 dark:text-gray-100">{row.value}</dd>
                        </div>
                    ))}
                </dl>

                <FincaEmployeeAreas employeeId={id} areas={data.areas} />

                {data.resign ? (
                    <div className="flex flex-col gap-4 rounded-2xl border border-emerald-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-emerald-500/30">
                        <div>
                            <h2 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Dar de alta empleado</h2>
                            <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">El empleado será reincorporado en BioTime.</p>
                        </div>
                        <CustomFilledButton
                            label="Dar de alta"
                            type="button"
                            icon={<UserCheck className="h-4 w-4 text-white" />}
                            disabled={isPending}
                            loading={isPending}
                            className="flex-none"
                            onClick={handleStatus}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 rounded-2xl border border-red-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-red-500/30">
                        <div>
                            <h2 className="text-sm font-semibold text-red-700 dark:text-red-300">Dar de baja empleado</h2>
                            <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">El empleado será dado de baja en BioTime con la fecha actual y se deshabilitará su asistencia.</p>
                        </div>
                        <CustomFilledButton
                            label="Dar de baja"
                            type="button"
                            icon={<UserMinus className="h-4 w-4 text-white" />}
                            disabled={isPending}
                            loading={isPending}
                            className="flex-none bg-red-600! hover:bg-red-700! focus:ring-red-500!"
                            onClick={handleStatus}
                        />
                    </div>
                )}
            </div>
        )
    }
}
