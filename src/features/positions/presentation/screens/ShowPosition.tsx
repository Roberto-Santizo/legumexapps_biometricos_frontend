import { CustomFilledButton, Spinner } from "@/features/shared/shared";
import { positionsRepositoryProvider } from "@/features/positions/positions";
import { ArrowLeft, EditIcon, Hash, IdCard, UserPen, UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export function ShowPosition() {
    const params = useParams();
    const navigate = useNavigate();
    const id = params.id!;

    const { data, isLoading } = useQuery({
        queryKey: ['getPositionById', id],
        queryFn: () => positionsRepositoryProvider.getPositionById(id)
    });

    if (isLoading) return <Spinner />
    if (data) {
        const rows = [
            { icon: <Hash className="h-4 w-4" />, label: 'Código', value: data.code },
            { icon: <IdCard className="h-4 w-4" />, label: 'Empleado asignado', value: data.employee ?? 'Sin empleado asignado' },
            { icon: <UserPlus className="h-4 w-4" />, label: 'Creado por', value: data.createdBy || '—' },
            { icon: <UserPen className="h-4 w-4" />, label: 'Actualizado por', value: data.updatedBy || '—' },
        ];

        return (
            <div className="mx-auto w-full max-w-4xl space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <button type="button" onClick={() => navigate('/posiciones')} className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer dark:text-gray-400 dark:hover:text-gray-100">
                        <ArrowLeft className="h-4 w-4" /> Posiciones
                    </button>
                    {/* El backend no permite editar posiciones con un empleado asignado */}
                    {!data.employee && (
                        <CustomFilledButton
                            label="Editar"
                            type="button"
                            icon={<EditIcon className="h-4 w-4 text-white" />}
                            onClick={() => navigate(`/posiciones/${id}/editar`)}
                        />
                    )}
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
            </div>
        )
    }
}
