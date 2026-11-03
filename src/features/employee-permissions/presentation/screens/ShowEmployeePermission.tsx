import { CustomFilledButton, Spinner, useNotification } from "@/features/shared/shared";
import { HrSignatureModal, PermissionSignaturesList, PermissionStatusBadge, employeePermissionsRepositoryProvider, formatPermissionDate, permissionTypeLabels, salaryStatusLabels } from "@/features/employee-permissions/employee-permissions";
import { ArrowLeft, Briefcase, Building2, CalendarClock, CalendarDays, Clock, EditIcon, FileText, Hash, PenLine, Tag, Trash2, User, UserPen, UserPlus, Users, Wallet } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

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

export function ShowEmployeePermission() {
    const params = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const notification = useNotification();
    const id = params.id!;
    const [signModal, setSignModal] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ['getPermissionById', id],
        queryFn: () => employeePermissionsRepositoryProvider.getPermissionById(id)
    });

    const { mutate: deletePermission, isPending: isDeleting } = useMutation({
        mutationFn: () => employeePermissionsRepositoryProvider.deletePermissionById(id),
        onSuccess: (message) => {
            notification.success(message);
            queryClient.invalidateQueries({ queryKey: ['getPermissions'] });
            queryClient.removeQueries({ queryKey: ['getPermissionById', id] });
            queryClient.removeQueries({ queryKey: ['getPermissionSignature', id] });
            navigate('/permisos');
        },
        onError: (err) => {
            notification.error(err.message);
        }
    });

    const { mutate: signByHr, isPending: isSigning } = useMutation({
        mutationFn: (signature: File) => employeePermissionsRepositoryProvider.signPermissionByHr(id, signature),
        onSuccess: (message) => {
            notification.success(message);
            setSignModal(false);
            queryClient.invalidateQueries({ queryKey: ['getPermissions'] });
            queryClient.invalidateQueries({ queryKey: ['getPermissionById', id] });
        },
        onError: (err) => {
            notification.error(err.message);
        }
    });

    if (isLoading) return <Spinner />
    if (error) return (
        <p className="text-center text-sm text-red-600 dark:text-red-400">No se pudo cargar el permiso: {error.message}</p>
    )
    if (data) {
        const handleDelete = () => notification.question(
            '¿Desea eliminar el permiso?',
            'Eliminar',
            'Esta acción no se puede deshacer',
            () => deletePermission()
        );

        const employeeRows: Row[] = [
            { icon: <User className="h-4 w-4" />, label: 'Trabajador', value: data.employee.name },
            { icon: <Hash className="h-4 w-4" />, label: 'Código', value: data.employee.pin },
            { icon: <Building2 className="h-4 w-4" />, label: 'Área de trabajo', value: data.employee.department || '—' },
            { icon: <Briefcase className="h-4 w-4" />, label: 'Posición', value: data.employee.position || '—' },
            { icon: <Users className="h-4 w-4" />, label: 'Comodín', value: data.substitute ? `${data.substitute.name} (${data.substitute.pin})` : 'Sin comodín' },
        ];

        const permissionRows: Row[] = [
            { icon: <CalendarDays className="h-4 w-4" />, label: 'Día del permiso', value: formatPermissionDate(data.date) },
            { icon: <Tag className="h-4 w-4" />, label: 'Tipo de permiso', value: permissionTypeLabels[data.type] },
            { icon: <Wallet className="h-4 w-4" />, label: 'Salario', value: salaryStatusLabels[data.salary_status] },
            { icon: <Clock className="h-4 w-4" />, label: 'Turno', value: `${data.shift_start} – ${data.shift_end}` },
            { icon: <FileText className="h-4 w-4" />, label: 'Motivo de salida', value: data.reason },
        ];

        const auditRows: Row[] = [
            { icon: <UserPlus className="h-4 w-4" />, label: 'Creado por', value: data.created_by },
            { icon: <CalendarClock className="h-4 w-4" />, label: 'Fecha de creación', value: formatDate(data.created_at) },
            { icon: <UserPen className="h-4 w-4" />, label: 'Actualizado por', value: data.updated_by || '—' },
            { icon: <CalendarClock className="h-4 w-4" />, label: 'Última actualización', value: formatDate(data.updated_at) },
        ];

        return (
            <div className="mx-auto w-full max-w-4xl space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <button type="button" onClick={() => navigate('/permisos')} className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer dark:text-gray-400 dark:hover:text-gray-100">
                        <ArrowLeft className="h-4 w-4" /> Permisos
                    </button>
                    {/* Con la firma de RRHH el permiso ya no se puede editar ni eliminar */}
                    {!data.is_valid && (
                        <CustomFilledButton
                            label="Editar"
                            type="button"
                            icon={<EditIcon className="h-4 w-4 text-white" />}
                            onClick={() => navigate(`/permisos/${id}/editar`)}
                        />
                    )}
                </div>

                <div className="space-y-3">
                    <h1 className="text-2xl font-bold leading-tight tracking-tight text-balance text-slate-900 sm:text-3xl dark:text-gray-100">Permiso folio {data.folio}</h1>
                    <PermissionStatusBadge isValid={data.is_valid} />
                </div>

                <PropertyList items={employeeRows} />
                <PropertyList items={permissionRows} />

                <PermissionSignaturesList permission={data} />

                {!data.is_valid && (
                    <div className="flex flex-col gap-4 rounded-2xl border border-emerald-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-emerald-500/30">
                        <div>
                            <h2 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Vo.Bo. de Recursos Humanos</h2>
                            <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">Firme para validar el permiso. Después ya no podrá editarse ni eliminarse.</p>
                        </div>
                        <CustomFilledButton
                            label="Firmar"
                            type="button"
                            icon={<PenLine className="h-4 w-4 text-white" />}
                            disabled={isSigning}
                            loading={isSigning}
                            className="flex-none"
                            onClick={() => setSignModal(true)}
                        />
                    </div>
                )}

                <PropertyList items={auditRows} />

                {!data.is_valid && (
                    <div className="flex flex-col gap-4 rounded-2xl border border-red-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-red-500/30">
                        <div>
                            <h2 className="text-sm font-semibold text-red-700 dark:text-red-300">Eliminar permiso</h2>
                            <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">Esta acción no se puede deshacer.</p>
                        </div>
                        <CustomFilledButton
                            label="Eliminar"
                            type="button"
                            icon={<Trash2 className="h-4 w-4 text-white" />}
                            disabled={isDeleting}
                            loading={isDeleting}
                            className="flex-none bg-red-600! hover:bg-red-700! focus:ring-red-500!"
                            onClick={handleDelete}
                        />
                    </div>
                )}

                <HrSignatureModal
                    open={signModal}
                    onClose={() => setSignModal(false)}
                    onConfirm={(signature) => signByHr(signature)}
                    loading={isSigning}
                    folio={data.folio}
                />
            </div>
        )
    }
}
