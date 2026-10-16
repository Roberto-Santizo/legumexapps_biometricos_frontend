import { useEffect, useMemo } from "react";
import { useController, type Control } from "react-hook-form";
import { ImageUp, X } from "lucide-react";
import type { EmployeeForm } from "@/features/employees/employees";

// Formatos aceptados por POST /employees
const ACCEPT = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_SIZE_MB = 5;

type Props = {
  control: Control<EmployeeForm>;
}

export function PhotoFormField({ control }: Props) {
  const { field: { value: file, onChange, onBlur, name, ref }, fieldState: { error } } = useController({
    control,
    name: 'file',
    rules: {
      validate: (file) => {
        if (!file) return 'La fotografía es requerida';
        if (!ACCEPT.includes(file.type)) return 'Formato no permitido. Use JPG, PNG o GIF';
        if (file.size > MAX_SIZE_MB * 1024 * 1024) return `La imagen supera el máximo de ${MAX_SIZE_MB} MB`;
        return true;
      }
    }
  });

  const previewUrl = useMemo(() => file ? URL.createObjectURL(file) : null, [file]);

  // libera la URL de la vista previa al cambiarla o al desmontar
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fotografía</span>

      <div className="flex items-center gap-4">
        {previewUrl ? (
          <img src={previewUrl} alt="Vista previa" className="h-20 w-20 flex-none rounded-xl border border-slate-200 object-cover dark:border-gray-700" />
        ) : (
          <div className="flex h-20 w-20 flex-none items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-gray-700">
            <ImageUp className="h-6 w-6 text-slate-400 dark:text-gray-500" />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
          <input
            id="file"
            name={name}
            ref={ref}
            type="file"
            accept={ACCEPT.join(',')}
            aria-invalid={!!error}
            onBlur={onBlur}
            onChange={(event) => {
              onChange(event.target.files?.[0] ?? null);
              // permite volver a elegir el mismo archivo
              event.target.value = '';
            }}
            className="peer sr-only"
          />
          <label htmlFor="file" className="inline-flex cursor-pointer items-center rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
            {file ? 'Cambiar foto' : 'Seleccionar foto'}
          </label>
          {file ? (
            <div className="flex min-w-0 items-center gap-2 text-xs">
              <span className="truncate text-slate-600 dark:text-gray-400" title={file.name}>{file.name}</span>
              <button type="button" onClick={() => onChange(null)} className="inline-flex flex-none items-center gap-1 font-medium text-red-600 hover:text-red-700 cursor-pointer dark:text-red-400 dark:hover:text-red-300">
                <X className="h-3.5 w-3.5" /> Quitar
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-gray-400">JPG, PNG o GIF · máx. {MAX_SIZE_MB} MB. El rostro debe verse con claridad.</p>
          )}
        </div>
      </div>

      <p className="text-red-400 text-xs">{error?.message}</p>
    </div>
  )
}
