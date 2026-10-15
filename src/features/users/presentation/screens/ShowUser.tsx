import { CustomFilledButton, Spinner, useNotification } from "@/features/shared/shared";
import { roleLabel, UserStatusBadge, usersRepositoryProvider } from "@/features/users/users";
import { ArrowLeft, EditIcon, Mail, Power, Shield, User } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export function ShowUser() {
    const params = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const notification = useNotification();
    const id = params.id!;

    const { data, isLoading } = useQuery({
        queryKey: ['getUserById', id],
        queryFn: () => usersRepositoryProvider.getUserById(id)
    });

    const { mutate, isPending } = useMutation({
        mutationFn: () => usersRepositoryProvider.toggleUserStatus(id),
        onSuccess: (message) => {
            notification.success(message);
            queryClient.invalidateQueries({ queryKey: ['getUsers'] });
            queryClient.invalidateQueries({ queryKey: ['getUserById', id] });
        },
        onError: (err) => {
            notification.error(err.message);
        }
    });

    if (isLoading) return <Spinner />
    if (data) {
        const action = data.isActive ? 'Desactivar' : 'Activar';
        const consequence = data.isActive ? 'El usuario no podrá iniciar sesión' : 'El usuario podrá volver a iniciar sesión';
        const handleToggleStatus = () => notification.question(
            `¿Desea ${action.toLowerCase()} el usuario?`,
            action,
            consequence,
            () => mutate()
        );

        const backLink = (
            <button type="button" onClick={() => navigate('/usuarios')} className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer dark:text-gray-400 dark:hover:text-gray-100">
                <ArrowLeft className="h-4 w-4" /> Usuarios
            </button>
        );
        const editButton = (
            <CustomFilledButton
                label="Editar"
                type="button"
                icon={<EditIcon className="h-4 w-4 text-white" />}
                onClick={() => navigate(`/usuarios/${id}/editar`)}
            />
        );
        const toggleButton = (
            <CustomFilledButton
                label={action}
                type="button"
                icon={<Power className="h-4 w-4 text-white" />}
                disabled={isPending}
                loading={isPending}
                className={`flex-none ${data.isActive ? "bg-red-600! hover:bg-red-700! focus:ring-red-500!" : ""}`}
                onClick={handleToggleStatus}
            />
        );
        const roleChips = (
            <div className="flex flex-wrap gap-1.5">
                {data.roles.map(role => (
                    <span key={role} className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">{roleLabel(role)}</span>
                ))}
            </div>
        );

        return (
            <div className="mx-auto w-full max-w-4xl space-y-6">
                <div className="flex items-center justify-between gap-4">{backLink}{editButton}</div>

                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold leading-tight tracking-tight text-balance text-slate-900 sm:text-3xl dark:text-gray-100">{data.name}</h1>
                    <UserStatusBadge isActive={data.isActive} />
                </div>

                <dl className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 dark:divide-gray-800 dark:border-gray-700 dark:bg-gray-900">
                    <div className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-[220px_1fr] sm:items-center">
                        <dt className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400"><User className="h-4 w-4" />Nombre</dt>
                        <dd className="text-sm font-semibold text-slate-900 dark:text-gray-100">{data.name}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-[220px_1fr] sm:items-center">
                        <dt className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400"><Mail className="h-4 w-4" />Correo electrónico</dt>
                        <dd className="text-sm font-semibold text-slate-900 dark:text-gray-100 break-all">{data.email}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-[220px_1fr] sm:items-center">
                        <dt className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400"><Shield className="h-4 w-4" />Roles</dt>
                        <dd>{roleChips}</dd>
                    </div>
                </dl>

                <div className={`flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${data.isActive ? 'border-red-200 dark:border-red-500/30' : 'border-slate-200 dark:border-gray-700'}`}>
                    <div>
                        <h2 className={`text-sm font-semibold ${data.isActive ? 'text-red-700 dark:text-red-300' : 'text-slate-900 dark:text-gray-100'}`}>{action} usuario</h2>
                        <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">{consequence}.</p>
                    </div>
                    {toggleButton}
                </div>
            </div>
        )
    }
}
