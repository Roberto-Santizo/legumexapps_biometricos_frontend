import { CustomFilledButton, Spinner, useNotification } from "@/features/shared/shared";
import { departmentsRepositoryProvider } from "@/features/departments/departments";
import { ArrowLeft, CalendarClock, EditIcon, Hash, Trash2, UserPen, UserPlus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

const formatDate = (value?: string | null) => value ? new Date(value).toLocaleString('es-GT') : '—';

export function ShowDepartment() {
    const params = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const notification = useNotification();
    const id = params.id!;

    const { data, isLoading } = useQuery({
        queryKey: ['getDepartmentById', id],
        queryFn: () => departmentsRepositoryProvider.getDepartmentById(id)
    });

    const { mutate, isPending } = useMutation({
        mutationFn: () => departmentsRepositoryProvider.deleteDepartmentById(id),
        onSuccess: (message) => {
            notification.success(message);
            queryClient.invalidateQueries({ queryKey: ['getDepartments'] });
            queryClient.removeQueries({ queryKey: ['getDepartmentById', id] });
            navigate('/departamentos');
        },
        onError: (err) => {
            notification.error(err.message);
        }
    });

    if (isLoading) return <Spinner />
    if (data) {
        const handleDelete = () => notification.question(
            '¿Desea eliminar el departamento?',
            'Eliminar',
            'Esta acción no se puede deshacer. No es posible eliminar departamentos con empleados asociados',
            () => mutate()
        );

        const rows = [
            { icon: <Hash className="h-4 w-4" />, label: 'Código', value: data.code },
            { icon: <UserPlus className="h-4 w-4" />, label: 'Creado por', value: data.creater_name || '—' },
            { icon: <CalendarClock className="h-4 w-4" />, label: 'Fecha de creación', value: formatDate(data.create_time) },
            { icon: <UserPen className="h-4 w-4" />, label: 'Actualizado por', value: data.updater_name || '—' },
            { icon: <CalendarClock className="h-4 w-4" />, label: 'Última actualización', value: formatDate(data.update_time) },
        ];

        return (
            <div className="mx-auto w-full max-w-4xl space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <button type="button" onClick={() => navigate('/departamentos')} className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer dark:text-gray-400 dark:hover:text-gray-100">
                        <ArrowLeft className="h-4 w-4" /> Departamentos
                    </button>
                    <CustomFilledButton
                        label="Editar"
                        type="button"
                        icon={<EditIcon className="h-4 w-4 text-white" />}
                        onClick={() => navigate(`/departamentos/${id}/editar`)}
                    />
                </div>

                <h1 className="text-2xl font-bold leading-tight tracking-tight text-balance text-slate-900 sm:text-3xl dark:text-gray-100">{data.name}</h1>

                <dl className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 dark:divide-gray-800 dark:border-gray-700 dark:bg-gray-900">
                    {rows.map(row => (
                        <div key={row.label} className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-[220px_1fr] sm:items-center">
                            <dt className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">{row.icon}{row.label}</dt>
                            <dd className="text-sm font-semibold tabular-nums text-slate-900 dark:text-gray-100">{row.value}</dd>
                        </div>
                    ))}
                </dl>

                <div className="flex flex-col gap-4 rounded-2xl border border-red-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-red-500/30">
                    <div>
                        <h2 className="text-sm font-semibold text-red-700 dark:text-red-300">Eliminar departamento</h2>
                        <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">Esta acción no se puede deshacer. No es posible eliminar departamentos con empleados asociados.</p>
                    </div>
                    <CustomFilledButton
                        label="Eliminar"
                        type="button"
                        icon={<Trash2 className="h-4 w-4 text-white" />}
                        disabled={isPending}
                        loading={isPending}
                        className="flex-none bg-red-600! hover:bg-red-700! focus:ring-red-500!"
                        onClick={handleDelete}
                    />
                </div>
            </div>
        )
    }
}
