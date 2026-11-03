import { CustomFilledButton, Spinner, useNotification } from "@/features/shared/shared";
import { PayloadList, TaskStatusBadge, TaskTypeBadge, taskTypeLabels, tasksRepositoryProvider } from "@/features/tasks/tasks";
import { ArrowLeft, CalendarClock, CalendarRange, EditIcon, Hash, Trash2, UserPlus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";

type Row = { icon: React.ReactNode; label: string; value: React.ReactNode };

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

export function ShowTask() {
    const params = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const notification = useNotification();
    const id = params.id!;

    const { data, isLoading, error } = useQuery({
        queryKey: ['getTaskById', id],
        queryFn: () => tasksRepositoryProvider.getTaskById(id)
    });

    const { mutate, isPending } = useMutation({
        mutationFn: () => tasksRepositoryProvider.deleteTask(id),
        onSuccess: (message) => {
            notification.success(message);
            queryClient.invalidateQueries({ queryKey: ['getTasks'] });
            queryClient.invalidateQueries({ queryKey: ['getPlanifications'] });
            queryClient.invalidateQueries({ queryKey: ['getPlanificationTasks'] });
            queryClient.removeQueries({ queryKey: ['getTaskById', id] });
            navigate('/tareas');
        },
        onError: (err) => {
            notification.error(err.message);
        }
    });

    const handleDelete = () => notification.question(
        '¿Desea eliminar la tarea?',
        'Eliminar',
        'La tarea dejará de ejecutarse en ZKBioAccess',
        () => mutate()
    );

    if (isLoading) return <Spinner />
    if (error) return (
        <p className="text-center text-sm text-red-600 dark:text-red-400">No se pudo cargar la tarea: {error.message}</p>
    )
    if (data) {
        const rows: Row[] = [
            { icon: <Hash className="h-4 w-4" />, label: 'PIN', value: data.pin },
            { icon: <CalendarClock className="h-4 w-4" />, label: 'Programada para', value: data.scheduled_at },
            { icon: <UserPlus className="h-4 w-4" />, label: 'Programada por', value: data.created_by },
            {
                icon: <CalendarRange className="h-4 w-4" />,
                label: 'Planificación',
                // Las tareas cargadas por Excel no tienen planificación
                value: data.planification_id
                    ? <Link to={`/planificaciones/${data.planification_id}`} className="text-blue-600 hover:underline dark:text-blue-400">Ver semana</Link>
                    : 'Sin planificación (Excel)'
            },
        ];

        return (
            <div className="mx-auto w-full max-w-4xl space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <button type="button" onClick={() => navigate('/tareas')} className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer dark:text-gray-400 dark:hover:text-gray-100">
                        <ArrowLeft className="h-4 w-4" /> Tareas
                    </button>
                    {/* Solo las tareas pendientes se pueden editar */}
                    {data.status === 'pendiente' && (
                        <CustomFilledButton
                            label="Editar"
                            type="button"
                            icon={<EditIcon className="h-4 w-4 text-white" />}
                            loading={false}
                            onClick={() => navigate(`/tareas/${id}/editar`)}
                        />
                    )}
                </div>

                <div className="space-y-3">
                    <h1 className="text-2xl font-bold leading-tight tracking-tight text-balance text-slate-900 sm:text-3xl dark:text-gray-100">{taskTypeLabels[data.type]} · PIN {data.pin}</h1>
                    <div className="flex flex-wrap gap-2">
                        <TaskTypeBadge type={data.type} />
                        <TaskStatusBadge status={data.status} />
                    </div>
                </div>

                <PropertyList items={rows} />

                {data.previous ? (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <section className="space-y-3">
                            <h2 className="text-base font-semibold text-slate-900 dark:text-gray-100">Antes</h2>
                            <PayloadList values={data.previous} />
                        </section>
                        <section className="space-y-3">
                            <h2 className="text-base font-semibold text-slate-900 dark:text-gray-100">Después</h2>
                            <PayloadList values={data.payload} />
                        </section>
                    </div>
                ) : (
                    <section className="space-y-3">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-gray-100">Datos a enviar</h2>
                        <PayloadList values={data.payload} />
                    </section>
                )}

                <div className="flex flex-col gap-4 rounded-2xl border border-red-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-red-500/30">
                    <div>
                        <h2 className="text-sm font-semibold text-red-700 dark:text-red-300">Eliminar tarea</h2>
                        <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">La tarea dejará de ejecutarse en ZKBioAccess.</p>
                    </div>
                    <CustomFilledButton
                        label="Eliminar"
                        type="button"
                        icon={<Trash2 className="h-4 w-4 text-white" />}
                        disabled={isPending}
                        loading={isPending}
                        className="flex-none bg-red-600! hover:bg-red-700! focus:ring-red-500! disabled:bg-red-400!"
                        onClick={handleDelete}
                    />
                </div>
            </div>
        )
    }
}
