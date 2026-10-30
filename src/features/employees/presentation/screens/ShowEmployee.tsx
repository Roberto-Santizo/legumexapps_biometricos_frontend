import { CustomFilledButton, ImageUploader, Spinner, useNotification, ZoomablePhoto } from "@/features/shared/shared";
import { EmployeeLevels, employeeFullName, employeesRepositoryProvider, RemoveEmployeeModal } from "@/features/employees/employees";
import { ArrowLeft, Building2, EditIcon, Hash, IdCard, ShieldCheck, Trash2, User, UserMinus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

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

    const { data, isLoading, error, dataUpdatedAt } = useQuery({
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
            queryClient.invalidateQueries({ queryKey: ['getPositions'] });
            navigate('/empleados');
        },
        onError: (err) => {
            notification.error(err.message);
        }
    });

    const { mutateAsync: uploadPhoto, isPending: isUploading } = useMutation({
        mutationFn: ({ pin, file }: { pin: string; file: File }) => employeesRepositoryProvider.updateEmployeePhoto(pin, file),
        onSuccess: (message) => {
            notification.success(message);
            queryClient.invalidateQueries({ queryKey: ['getEmployeeById', id] });
            queryClient.invalidateQueries({ queryKey: ['getEmployees'] });
        },
        onError: (err) => {
            notification.error(err.message);
        }
    });

    const [removeModal, setRemoveModal] = useState(false);

    const { mutate: removeEmployee, isPending: isRemoving } = useMutation({
        mutationFn: (pin: string) => employeesRepositoryProvider.removeEmployee(pin),
        onSuccess: (message) => {
            notification.success(message);
            setRemoveModal(false);
            queryClient.invalidateQueries({ queryKey: ['getEmployees'] });
            queryClient.invalidateQueries({ queryKey: ['getInactiveEmployees'] });
            queryClient.removeQueries({ queryKey: ['getEmployeeById', id] });
            queryClient.removeQueries({ queryKey: ['getEmployeeLevels', id] });
            queryClient.invalidateQueries({ queryKey: ['getPositions'] });
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

    // Primera confirmación; la segunda (escribir el código) ocurre en el modal
    const handleRemove = () => notification.question(
        '¿Desea eliminar permanentemente al empleado?',
        'Continuar',
        'Esta acción no se puede deshacer: el empleado no podrá reactivarse',
        () => setRemoveModal(true)
    );

    if (isLoading) return <Spinner />
    if (error) return (
        <p className="text-center text-sm text-red-600 dark:text-red-400">No se pudo cargar el empleado: {error.message}</p>
    )
    if (data) {
        const hasPhoto = data.hasPhoto;
        const photoSrc = data.hasPhoto && data.photoUrl
            ? `${data.photoUrl}${data.photoUrl.includes('?') ? '&' : '?'}v=${dataUpdatedAt}`
            : null;
        const rows: Row[] = [
            { icon: <Hash className="h-4 w-4" />, label: 'Código', value: data.pin },
            { icon: <User className="h-4 w-4" />, label: 'Nombres', value: data.name },
            { icon: <User className="h-4 w-4" />, label: 'Apellidos', value: data.last_name || '—' },
            { icon: <IdCard className="h-4 w-4" />, label: 'Posición', value: data.position_id ? data.position : 'Sin posición asignada' },
            { icon: <Building2 className="h-4 w-4" />, label: 'Departamento', value: data.department || '—' },
            { icon: <ShieldCheck className="h-4 w-4" />, label: 'Credencial', value: hasPhoto ? 'Habilitada' : 'Deshabilitada' },
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

                <div className="flex items-center gap-5">
                    <ZoomablePhoto key={photoSrc} src={photoSrc} alt={`Fotografía de ${employeeFullName(data)}`} caption={employeeFullName(data)} />
                    <div className="space-y-3">
                        <h1 className="text-2xl font-bold leading-tight tracking-tight text-balance text-slate-900 sm:text-3xl dark:text-gray-100">{employeeFullName(data)}</h1>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${hasPhoto ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'}`}>
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Credencial {hasPhoto ? 'habilitada' : 'deshabilitada'}
                        </span>
                    </div>
                </div>

                <PropertyList items={rows} />

                <ImageUploader
                    label="Fotografía"
                    description="Se enviará a ZKBioAccess; el rostro debe verse con claridad."
                    submitLabel={data.hasPhoto ? 'Actualizar foto' : 'Subir foto'}
                    loading={isUploading}
                    onUpload={(file) => uploadPhoto({ pin: data.pin, file })}
                />

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

                <div className="flex flex-col gap-4 rounded-2xl border border-red-300 bg-red-50/50 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-red-500/40 dark:bg-red-500/5">
                    <div>
                        <h2 className="text-sm font-semibold text-red-700 dark:text-red-300">Eliminar permanentemente</h2>
                        <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">Da de baja al empleado y borra su registro de inactivos y su fotografía. No se puede deshacer.</p>
                    </div>
                    <CustomFilledButton
                        label="Eliminar"
                        type="button"
                        icon={<Trash2 className="h-4 w-4 text-white" />}
                        disabled={isRemoving || isPending}
                        loading={isRemoving}
                        className="flex-none bg-red-700! hover:bg-red-800! focus:ring-red-600!"
                        onClick={handleRemove}
                    />
                </div>

                <RemoveEmployeeModal
                    open={removeModal}
                    onClose={() => setRemoveModal(false)}
                    onConfirm={() => removeEmployee(data.pin)}
                    loading={isRemoving}
                    pin={data.pin}
                    fullName={employeeFullName(data)}
                />
            </div>
        )
    }
}
