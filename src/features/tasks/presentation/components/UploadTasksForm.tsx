import { CustomFilledButton, XLSX_MIME_TYPE, useNotification } from "@/features/shared/shared";
import { taskUploadTypes, tasksRepositoryProvider, type TaskUploadType } from "@/features/tasks/tasks";
import { FileSpreadsheet, Upload, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formatSize = (bytes: number) => bytes < 1024 * 1024
  ? `${(bytes / 1024).toFixed(0)} KB`
  : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

// El backend solo acepta .xlsx; algunos navegadores no informan el MIME, así que también se revisa la extensión
const isXlsx = (file: File) => file.type === XLSX_MIME_TYPE || file.name.toLowerCase().endsWith('.xlsx');

type Props = {
  onUploaded: () => void;
}

export function UploadTasksForm({ onUploaded }: Props) {
  const notification = useNotification();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [type, setType] = useState<TaskUploadType>('creation');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const selected = taskUploadTypes.find(option => option.value === type)!;

  const { mutate, isPending } = useMutation({
    mutationFn: ({ type, file }: { type: TaskUploadType; file: File }) => tasksRepositoryProvider.uploadTasks(type, file),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getTasks'] });
      onUploaded();
    },
    onError: (err) => {
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
    setFile(candidate);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError('Seleccione el archivo Excel con las tareas');
      return;
    }
    mutate({ type, file });
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if (!isPending) selectFile(event.dataTransfer.files[0]);
  };

  return (
    <form className="flex flex-col gap-6" noValidate onSubmit={handleSubmit}>
      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-medium text-slate-700 dark:text-gray-300">Tipo de tareas</legend>
        <div className="grid grid-cols-3 gap-2">
          {taskUploadTypes.map(option => (
            <label
              key={option.value}
              className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm font-semibold transition has-focus-visible:ring-2 has-focus-visible:ring-emerald-500 ${type === option.value
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'
                }`}
            >
              <input
                type="radio"
                name="type"
                value={option.value}
                checked={type === option.value}
                onChange={() => setType(option.value)}
                disabled={isPending}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="rounded-xl bg-slate-50 p-4 dark:bg-gray-800/60">
        <p className="text-sm font-medium text-slate-700 dark:text-gray-200">Columnas esperadas (desde la fila 2)</p>
        <ol className="mt-2 flex flex-wrap gap-1.5">
          {selected.columns.map((column, i) => (
            <li key={column} className="rounded-md bg-white px-2 py-1 text-xs text-slate-600 ring-1 ring-slate-200 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700">
              <span className="font-semibold tabular-nums text-slate-400 dark:text-gray-500">{String.fromCharCode(65 + i)}</span> {column}
            </li>
          ))}
        </ol>
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
            <button type="button" onClick={() => setFile(null)} disabled={isPending} aria-label="Quitar archivo" className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-400">
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

      <CustomFilledButton
        label={`Programar ${selected.label.toLowerCase()}`}
        type="submit"
        fullWitdh={true}
        icon={<Upload className="h-4 w-4 text-white" />}
        disabled={isPending}
      />
    </form>
  )
}
