import { CustomFilledButton, Modal } from "@/features/shared/shared";
import { TriangleAlert, Trash2 } from "lucide-react";
import { useState } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
    pin: string;
    fullName: string;
}

// Segunda confirmación de la baja permanente: el usuario debe escribir el código del empleado
export function RemoveEmployeeModal({ open, onClose, onConfirm, loading, pin, fullName }: Props) {
    const [confirmation, setConfirmation] = useState('');
    const matches = confirmation.trim() === pin;

    const handleClose = () => {
        if (loading) return;
        setConfirmation('');
        onClose();
    }

    return (
        <Modal modal={open} closeModal={handleClose} title="Eliminar empleado permanentemente" width="sm:max-w-lg">
            <form
                className="space-y-5"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (matches && !loading) onConfirm();
                }}
            >
                <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
                    <TriangleAlert className="h-5 w-5 flex-none text-red-600 dark:text-red-400" />
                    <div className="space-y-2 text-sm text-red-800 dark:text-red-200">
                        <p className="font-semibold">Esta acción no se puede deshacer.</p>
                        <p>Al eliminar a <span className="font-semibold">{fullName}</span>:</p>
                        <ul className="list-disc space-y-1 pl-5">
                            <li>Se dará de baja en ZKBioAccess y se enviará el correo de notificación.</li>
                            <li>Se borrará su registro de empleados inactivos, por lo que no podrá reactivarse.</li>
                            <li>Se eliminará su fotografía.</li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="remove-employee-pin" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Escriba el código <span className="font-mono font-semibold text-slate-900 dark:text-gray-100">{pin}</span> para confirmar
                    </label>
                    <input
                        id="remove-employee-pin"
                        type="text"
                        autoComplete="off"
                        value={confirmation}
                        onChange={(e) => setConfirmation(e.target.value)}
                        placeholder={pin}
                        disabled={loading}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        Cancelar
                    </button>
                    <CustomFilledButton
                        label="Eliminar permanentemente"
                        type="submit"
                        icon={<Trash2 className="h-4 w-4 text-white" />}
                        disabled={!matches || loading}
                        loading={loading}
                        className="bg-red-600! hover:bg-red-700! focus:ring-red-500! disabled:bg-red-300! dark:disabled:bg-red-900!"
                    />
                </div>
            </form>
        </Modal>
    )
}
