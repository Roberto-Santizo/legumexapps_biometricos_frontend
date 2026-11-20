import { CustomFilledButton, XLSX_MIME_TYPE, useNotification } from "@/features/shared/shared";
import { positionsRepositoryProvider } from "@/features/positions/positions";
import { FileSpreadsheet, Upload, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const COLUMNS = ['Código', 'Nombre'];

const formatSize = (bytes: number) => bytes < 1024 * 1024
  ? `${(bytes / 1024).toFixed(0)} KB`
  : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

// El backend solo acepta .xlsx; algunos navegadores no informan el MIME, así que también se revisa la extensión
const isXlsx = (file: File) => file.type === XLSX_MIME_TYPE || file.name.toLowerCase().endsWith('.xlsx');

type Props = {
  onUploaded: () => void;
}

export function UploadPositionsForm({ onUploaded }: Props) {
  const notification = useNotification();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  // errores por fila devueltos por el backend (código repetido, posición existente, etc.)
  const [rowErrors, setRowErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (file: File) => positionsRepositoryProvider.uploadPositions(file),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getPositions'] });
      onUploaded();
    },
    onError: (err) => {
      const errors = err.message.split('\n').filter(Boolean);
      if (errors.length > 1) {
        setRowErrors(errors);
        notification.error(`El archivo tiene ${errors.length} errores; no se creó ninguna posición`);
        return;
      }
      setRowErrors([]);
      notification.error(err.message);
    }
  });

  const selectFile = (candidate: File | undefined) => {
    if (!candidate) return;
    if (!isXlsx(candidate)) {
      setError('Formato no permitido. Use un archivo Excel (.xlsx).');
      return;
    }
    setError(null);
    setRowErrors([]);
    setFile(candidate);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError('Seleccione el archivo Excel con las posiciones');
      return;
    }
    mutate(file);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if (!isPending) selectFile(event.dataTransfer.files[0]);
  };

  return (
    <form className="flex flex-col gap-6" noValidate onSubmit={handleSubmit}>
      <div className="rounded-xl bg-slate-50 p-4 dark:bg-gray-800/60">
        <p className="text-sm font-medium text-slate-700 dark:text-gray-200">Columnas esperadas (desde la fila 2)</p>
        <ol className="mt-2 flex flex-wrap gap-1.5">
          {COLUMNS.map((column, i) => (
            <li key={column} className="rounded-md bg-white px-2 py-1 text-xs text-slate-600 ring-1 ring-slate-200 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700">
              <span className="font-semibold tabular-nums text-slate-400 dark:text-gray-500">{String.fromCharCode(65 + i)}</span> {column}
            </li>
          ))}
        </ol>
        <p className="mt-2 text-xs text-slate-500 dark:text-gray-400">Si alguna fila es inválida o el código ya existe, no se crea ninguna posición.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-gray-300">Archivo</label>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={`.xlsx,${XLSX_MIME_TYPE}`}
          className="sr-only"
          disabled={isPending}
          onChange={(event) => {
            selectFile(event.target.files?.[0]);
            // permite volver a elegir el mismo archivo
            event.target.value = '';
          }}
        />

        {file ? (
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-gray-700">
            <FileSpreadsheet className="h-8 w-8 flex-none text-emerald-600 dark:text-emerald-400" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-gray-100" title={file.name}>{file.name}</p>
              <p className="text-xs tabular-nums text-slate-500 dark:text-gray-400">{formatSize(file.size)}</p>
            </div>
            <button type="button" onClick={() => { setFile(null); setRowErrors([]); }} disabled={isPending} aria-label="Quitar archivo" className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-400">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            onDragOver={(event) => { event.preventDefault(); if (!isPending) setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-60 ${dragging ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800/50'}`}
          >
            <FileSpreadsheet className="h-8 w-8 text-slate-400 dark:text-gray-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-gray-200">Arrastre un archivo o haga clic para seleccionarlo</span>
            <span className="text-xs text-slate-500 dark:text-gray-400">Solo Excel (.xlsx) · se lee la primera hoja</span>
          </button>
        )}

        {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>

      {rowErrors.length > 0 && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
          <p className="text-sm font-medium text-red-700 dark:text-red-300">Corrija el archivo y vuelva a cargarlo</p>
          <ul className="mt-2 max-h-48 list-disc space-y-1 overflow-y-auto pl-5 text-sm text-red-700 dark:text-red-300">
            {rowErrors.map((rowError, i) => <li key={i}>{rowError}</li>)}
          </ul>
        </div>
      )}

      <CustomFilledButton
        label="Cargar posiciones"
        type="submit"
        fullWitdh={true}
        icon={<Upload className="h-4 w-4 text-white" />}
        disabled={isPending}
      />
    </form>
  )
}
