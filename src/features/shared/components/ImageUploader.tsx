import { CustomFilledButton } from "@/features/shared/shared";
import { ImageUp, RefreshCw, Upload, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

const DEFAULT_ACCEPT = ['image/jpeg', 'image/png', 'image/gif'];

interface ImageUploaderProps {
    /** Recibe el archivo al confirmar. Si devuelve una promesa, la selección se limpia al resolverse y se conserva si falla. */
    onUpload: (file: File) => Promise<unknown> | void;
    loading?: boolean;
    disabled?: boolean;
    label?: string;
    description?: string;
    submitLabel?: string;
    /** Tipos MIME permitidos. */
    accept?: string[];
    maxSizeMB?: number;
    className?: string;
}

type Selection = { file: File; url: string };

const formatSize = (bytes: number) => bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const formatTypes = (accept: string[]) => accept.map(type => type.split('/')[1]?.toUpperCase()).filter(Boolean).join(', ');

export function ImageUploader({
    onUpload,
    loading = false,
    disabled = false,
    label = "Imagen",
    description,
    submitLabel = "Subir imagen",
    accept = DEFAULT_ACCEPT,
    maxSizeMB = 5,
    className = "",
}: ImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const inputId = useId();
    const [selection, setSelection] = useState<Selection | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const locked = disabled || loading;

    // libera la URL de la vista previa al cambiarla o al desmontar
    useEffect(() => () => { if (selection) URL.revokeObjectURL(selection.url); }, [selection]);

    const selectFile = (file: File | undefined) => {
        if (!file) return;
        if (!accept.includes(file.type)) {
            setError(`Formato no permitido. Use ${formatTypes(accept)}.`);
            return;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`La imagen supera el máximo de ${maxSizeMB} MB.`);
            return;
        }
        setError(null);
        setSelection({ file, url: URL.createObjectURL(file) });
    };

    const clear = () => {
        setSelection(null);
        setError(null);
    };

    const openPicker = () => inputRef.current?.click();

    const handleUpload = async () => {
        if (!selection) return;
        try {
            await onUpload(selection.file);
            clear();
        } catch {
            // quien sube notifica el error; se conserva la selección para reintentar
        }
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setDragging(false);
        if (!locked) selectFile(event.dataTransfer.files[0]);
    };

    return (
        <div className={`rounded-2xl border border-slate-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900 ${className}`}>
            <div className="mb-4">
                <label htmlFor={inputId} className="text-sm font-semibold text-slate-900 dark:text-gray-100">{label}</label>
                {description && <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">{description}</p>}
            </div>

            <input
                ref={inputRef}
                id={inputId}
                type="file"
                accept={accept.join(',')}
                className="sr-only"
                disabled={locked}
                onChange={(event) => {
                    selectFile(event.target.files?.[0]);
                    // permite volver a elegir el mismo archivo
                    event.target.value = '';
                }}
            />

            {selection ? (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <img src={selection.url} alt="Vista previa" className="h-24 w-24 flex-none rounded-xl border border-slate-200 object-cover dark:border-gray-700" />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-gray-100" title={selection.file.name}>{selection.file.name}</p>
                        <p className="text-xs tabular-nums text-slate-500 dark:text-gray-400">{formatSize(selection.file.size)}</p>
                        <div className="mt-2 flex gap-3">
                            <button type="button" onClick={openPicker} disabled={locked} className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer dark:text-gray-400 dark:hover:text-gray-100">
                                <RefreshCw className="h-3.5 w-3.5" /> Cambiar
                            </button>
                            <button type="button" onClick={clear} disabled={locked} className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer dark:text-red-400 dark:hover:text-red-300">
                                <X className="h-3.5 w-3.5" /> Quitar
                            </button>
                        </div>
                    </div>
                    <CustomFilledButton
                        label={submitLabel}
                        type="button"
                        icon={<Upload className="h-4 w-4 text-white" />}
                        disabled={locked}
                        loading={loading}
                        className="flex-none"
                        onClick={() => void handleUpload()}
                    />
                </div>
            ) : (
                <button
                    type="button"
                    onClick={openPicker}
                    disabled={locked}
                    onDragOver={(event) => { event.preventDefault(); if (!locked) setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-60 ${dragging ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800/50'}`}
                >
                    <ImageUp className="h-8 w-8 text-slate-400 dark:text-gray-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-gray-200">Arrastre una imagen o haga clic para seleccionarla</span>
                    <span className="text-xs text-slate-500 dark:text-gray-400">{formatTypes(accept)} · máx. {maxSizeMB} MB</span>
                </button>
            )}

            {error && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}
