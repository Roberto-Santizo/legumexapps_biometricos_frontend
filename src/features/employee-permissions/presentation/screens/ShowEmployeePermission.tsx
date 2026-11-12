import { CustomFilledButton, Spinner, useNotification } from "@/features/shared/shared";
import { HrSignatureModal, PermissionStatusBadge, SignatureImage, employeePermissionsRepositoryProvider, formatPermissionDate, permissionTypeLabels, salaryStatusLabels, signerLabels, type EmployeePermission, type PermissionSigner, type SalaryStatus } from "@/features/employee-permissions/employee-permissions";
import { ArrowLeft, Check, EditIcon, PenLine, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const LOGO_URL = "https://legumexappsapi-storage.s3.us-east-1.amazonaws.com/resources/LOGO_LX_V2.png";

const formatDate = (value?: string | null) => value ? new Date(value).toLocaleString('es-GT') : '—';

// Mismo orden que las casillas de la boleta impresa (ODC-RH-09)
const salaryOptions: SalaryStatus[] = ['con_goce', 'falta_injustificada', 'sin_goce'];

// La boleta se dibuja como papel (claro) también en modo oscuro: las firmas son trazos oscuros sobre fondo transparente
function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={`flex min-w-0 items-end gap-2 ${className}`}>
            <span className="shrink-0 text-sm text-slate-700">{label}</span>
            <span className="min-w-0 flex-1 border-b border-slate-700 px-1 pb-0.5 font-semibold uppercase tracking-wide break-words text-blue-800">{children}</span>
        </div>
    );
}

function SignatureField({ label, permission, signer }: { label: string; permission: EmployeePermission; signer: PermissionSigner }) {
    return (
        <div className="flex min-w-0 items-end gap-2">
            <span className="shrink-0 text-sm text-slate-700">{label}</span>
            <div className="h-14 min-w-0 flex-1 border-b border-slate-700">
                {permission.signatures[signer] ? (
                    <SignatureImage permissionId={permission.id} signer={signer} alt={`Firma: ${signerLabels[signer]}`} bare />
                ) : (
                    <span className="flex h-full items-end pb-0.5 text-xs text-slate-400">Sin firma</span>
                )}
            </div>
        </div>
    );
}

function SalaryCheckbox({ status, selected }: { status: SalaryStatus; selected: boolean }) {
    return (
        <div className="flex items-center gap-2">
            <span aria-hidden className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 ${selected ? 'border-blue-800' : 'border-slate-700'}`}>
                {selected && <Check className="h-3.5 w-3.5 text-blue-800" strokeWidth={3} />}
            </span>
            <span className={`text-sm ${selected ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                {salaryStatusLabels[status]}
                {selected && <span className="sr-only"> (seleccionado)</span>}
            </span>
        </div>
    );
}

function AuthorizationSlot({ permission, signer, children }: { permission: EmployeePermission; signer: PermissionSigner; children?: React.ReactNode }) {
    return (
        <div className="flex flex-col">
            <div className="flex h-20 items-end justify-center border-b border-slate-700">
                {permission.signatures[signer] ? (
                    <SignatureImage permissionId={permission.id} signer={signer} alt={`Firma: ${signerLabels[signer]}`} bare />
                ) : children ?? (
                    <span className="pb-1 text-xs text-slate-400">Sin firma</span>
                )}
            </div>
            <p className="mt-1.5 text-center text-sm text-slate-700">{signerLabels[signer]}</p>
        </div>
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

        return (
            <div className="mx-auto w-full max-w-5xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button type="button" onClick={() => navigate('/permisos')} className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer dark:text-gray-400 dark:hover:text-gray-100">
                            <ArrowLeft className="h-4 w-4" /> Permisos
                        </button>
                        <PermissionStatusBadge isValid={data.is_valid} />
                    </div>
                    {/* Con la firma de RRHH el permiso ya no se puede editar ni eliminar */}
                    {!data.is_valid && (
                        <div className="flex gap-2">
                            <CustomFilledButton
                                label="Eliminar"
                                type="button"
                                icon={<Trash2 className="h-4 w-4 text-white" />}
                                disabled={isDeleting}
                                loading={isDeleting}
                                className="bg-red-600! hover:bg-red-700! focus:ring-red-500!"
                                onClick={handleDelete}
                            />
                            <CustomFilledButton
                                label="Editar"
                                type="button"
                                icon={<EditIcon className="h-4 w-4 text-white" />}
                                onClick={() => navigate(`/permisos/${id}/editar`)}
                            />
                        </div>
                    )}
                </div>

                <article aria-label={`Control de ausencias, folio ${data.folio}`} className="rounded-sm bg-[#fdfdfb] p-3 text-slate-900 shadow-lg ring-1 ring-slate-200 sm:p-5 dark:ring-0">
                    <div className="rounded-2xl border-2 border-slate-800 p-4 sm:p-6">
                        <header className="grid grid-cols-1 items-start gap-4 border-b border-slate-300 pb-4 md:grid-cols-[1fr_auto_1fr]">
                            <div className="flex items-center gap-3">
                                <img src={LOGO_URL} alt="Legumex" className="h-14 w-14 flex-none object-contain" />
                                <div className="text-xs leading-snug text-slate-600">
                                    <p className="font-bold text-slate-900">LEGUMEX, S.A.</p>
                                    <p>12 Avenida 6-15 Zona 2 Sector,</p>
                                    <p>Las Majadas El Tejar, Chimaltenango</p>
                                    <p>Teléfono: 7963-0888</p>
                                </div>
                            </div>

                            <div className="text-center">
                                <h1 className="text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">CONTROL DE AUSENCIAS</h1>
                                <p className="mt-1 font-mono text-xl tracking-[0.2em] text-red-600 tabular-nums">Nº {String(data.folio).padStart(6, '0')}</p>
                            </div>

                            <div className="flex flex-col items-start gap-2 md:items-end">
                                <p className="text-sm font-semibold text-slate-700">ODC-RH-09</p>
                                <div className="flex items-end gap-2 rounded-md border-2 border-slate-800 px-3 py-1.5">
                                    <span className="text-sm text-slate-700">Fecha:</span>
                                    <span className="border-b border-slate-700 px-1 font-semibold tabular-nums text-blue-800">{formatPermissionDate(data.date)}</span>
                                </div>
                            </div>
                        </header>

                        <div className="mt-6 space-y-5">
                            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-[minmax(0,1fr)_18rem]">
                                <Field label="Nombre del Trabajador:">{data.employee.name}</Field>
                                <Field label="Código:"><span className="tabular-nums">{data.employee.pin}</span></Field>

                                <Field label="Área de trabajo:">{data.employee.department || '—'}</Field>
                                <SignatureField label="Firma:" permission={data} signer="employee" />

                                <Field label="Motivo de Salida:">{data.reason}</Field>
                                <Field label="Tipo:">{permissionTypeLabels[data.type]}</Field>
                            </div>

                            <div className="flex flex-col gap-3 py-1 sm:flex-row sm:justify-around">
                                {salaryOptions.map(status => (
                                    <SalaryCheckbox key={status} status={status} selected={data.salary_status === status} />
                                ))}
                            </div>

                            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-[minmax(0,1fr)_18rem]">
                                <Field label="Nombre comodín:">{data.substitute ? `${data.substitute.name} (${data.substitute.pin})` : '—'}</Field>
                                {data.substitute ? (
                                    <SignatureField label="Firma:" permission={data} signer="substitute" />
                                ) : (
                                    <Field label="Firma:">—</Field>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_12rem_12rem]">
                                <Field label="Posición de trabajo:" className="sm:col-span-2 lg:col-span-1">{data.employee.position || '—'}</Field>
                                <Field label="Inicio de turno:"><span className="tabular-nums">{data.shift_start}</span></Field>
                                <Field label="Fin de turno:"><span className="tabular-nums">{data.shift_end}</span></Field>
                            </div>

                            <div className="pt-2">
                                <p className="text-sm text-slate-700">Autorizado por:</p>
                                <div className="mt-2 grid grid-cols-1 gap-8 sm:grid-cols-3">
                                    <AuthorizationSlot permission={data} signer="supervisor" />
                                    <AuthorizationSlot permission={data} signer="hr">
                                        <button
                                            type="button"
                                            onClick={() => setSignModal(true)}
                                            disabled={isSigning}
                                            className="mb-2 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-emerald-600 px-3 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-60 cursor-pointer"
                                        >
                                            <PenLine className="h-4 w-4" /> Firmar Vo.Bo.
                                        </button>
                                    </AuthorizationSlot>
                                    <AuthorizationSlot permission={data} signer="floor_auditor" />
                                </div>
                                {data.hr_signed_at && (
                                    <p className="mt-3 text-center text-xs text-slate-500">
                                        Vo.Bo. de {data.hr_signed_by ?? 'RRHH'} el <span className="tabular-nums">{formatDate(data.hr_signed_at)}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </article>

                <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-xs text-slate-500 sm:grid-cols-2 dark:text-gray-400">
                    <div className="flex gap-1.5"><dt>Creado por</dt><dd className="font-medium text-slate-700 dark:text-gray-300">{data.created_by} · <span className="tabular-nums">{formatDate(data.created_at)}</span></dd></div>
                    <div className="flex gap-1.5 sm:justify-end"><dt>Actualizado por</dt><dd className="font-medium text-slate-700 dark:text-gray-300">{data.updated_by || '—'} · <span className="tabular-nums">{formatDate(data.updated_at)}</span></dd></div>
                </dl>

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
