import { CustomFilledButton } from "@/features/shared/shared";
import { MAX_PHOTOS_PER_UPLOAD, formatPhotoSize, type StagedPhoto } from "@/features/photos/photos";
import { ArrowRight, ImagePlus, Plus, Upload, X } from "lucide-react";

type Props = {
  staged: StagedPhoto[];
  uploading: boolean;
  progress: number;
  onPick: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onUpload: () => void;
}

// Mesa donde se preparan las fotos antes de enviarlas: muestra con qué nombre quedará guardada cada una
export function UploadTray({ staged, uploading, progress, onPick, onRemove, onClear, onUpload }: Props) {
  if (staged.length === 0) return (
    <button
      type="button"
      onClick={onPick}
      className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 px-4 py-7 text-center transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-900"
    >
      <ImagePlus className="h-7 w-7 text-slate-400 dark:text-gray-500" aria-hidden="true" />
      <span className="text-sm font-medium text-slate-700 dark:text-gray-200">Arrastre fotos a cualquier parte de la pantalla o haga clic para seleccionarlas</span>
      <span className="text-xs text-slate-500 dark:text-gray-400">
        JPG, PNG o GIF · hasta {MAX_PHOTOS_PER_UPLOAD} por carga · cada una se guarda como <span className="font-mono">NOMBRE.jpg</span>
      </span>
    </button>
  )

  const counts = staged.reduce<Record<string, number>>((acc, item) => ({ ...acc, [item.key]: (acc[item.key] ?? 0) + 1 }), {});
  const duplicatedKeys = Object.keys(counts).filter(key => counts[key] > 1);
  const totalSize = staged.reduce((sum, item) => sum + item.file.size, 0);
  const blocked = duplicatedKeys.length > 0;

  return (
    <section aria-labelledby="upload-tray-title" className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-gray-700 dark:bg-gray-900">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5 dark:border-gray-700">
        <h2 id="upload-tray-title" className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-gray-100">
          Por subir
          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold tabular-nums text-slate-600 ring-1 ring-slate-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">{staged.length}</span>
        </h2>
        <div className="flex items-center gap-1">
          <button type="button" onClick={onPick} disabled={uploading} className="filter-clear inline-flex items-center gap-1 no-underline! disabled:cursor-not-allowed disabled:opacity-50">
            <Plus className="h-4 w-4" aria-hidden="true" /> Agregar
          </button>
          <button type="button" onClick={onClear} disabled={uploading} className="filter-clear disabled:cursor-not-allowed disabled:opacity-50">
            Descartar todo
          </button>
        </div>
      </header>

      <ul className="grid max-h-[26rem] grid-cols-2 gap-x-3 gap-y-4 overflow-y-auto p-4 sm:grid-cols-4 sm:p-5 lg:grid-cols-6 2xl:grid-cols-8">
        {staged.map(item => {
          const duplicated = counts[item.key] > 1;
          const problem = duplicated ? 'Nombre repetido en esta carga' : item.error;

          return (
            <li key={item.id} className="group/staged relative min-w-0">
              <div className={`relative aspect-[3/4] overflow-hidden rounded-lg bg-white ring-1 dark:bg-gray-800 ${problem ? 'ring-2 ring-red-500' : 'ring-slate-200 dark:ring-gray-700'}`}>
                <img src={item.previewUrl} alt="" className={`h-full w-full object-cover ${uploading ? 'opacity-60' : ''}`} />
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  disabled={uploading}
                  aria-label={`Quitar ${item.file.name}`}
                  className="absolute top-1.5 right-1.5 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-slate-600 shadow-sm ring-1 ring-slate-900/5 transition hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:hidden cursor-pointer dark:bg-gray-900/90 dark:text-gray-300 dark:ring-white/10"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>

              <p className="mt-1.5 truncate text-[11px] text-slate-500 dark:text-gray-400" title={`${item.file.name} · ${formatPhotoSize(item.file.size)}`}>
                {item.file.name}
              </p>
              <p className="flex min-w-0 items-center gap-1 font-mono text-xs font-semibold tracking-wide text-slate-900 dark:text-gray-100">
                <ArrowRight className="h-3 w-3 flex-none text-slate-400 dark:text-gray-500" aria-label="se guarda como" />
                <span className="truncate" title={`${item.key}.jpg`}>{item.key}<span className="font-normal text-slate-400 dark:text-gray-500">.jpg</span></span>
              </p>
              {problem && <p className="mt-0.5 text-[11px] leading-snug text-red-600 dark:text-red-400">{problem}</p>}
            </li>
          )
        })}
      </ul>

      <footer className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-gray-700 dark:bg-gray-900">
        <div className="min-w-0 flex-1 text-sm" aria-live="polite">
          {uploading ? (
            <div className="space-y-1.5">
              <p className="font-medium text-slate-700 dark:text-gray-200">Subiendo… <span className="tabular-nums">{progress}%</span></p>
              <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-slate-200 dark:bg-gray-700">
                <div className="h-full rounded-full bg-emerald-600 transition-[width] duration-200" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : blocked ? (
            <p role="alert" className="text-red-600 dark:text-red-400">
              {duplicatedKeys.length === 1
                ? <>Hay dos archivos que se guardarían como <span className="font-mono font-semibold">{duplicatedKeys[0]}.jpg</span>. Quite uno para continuar.</>
                : <>{duplicatedKeys.length} nombres se repiten. Quite los duplicados para continuar.</>}
            </p>
          ) : (
            <p className="text-slate-500 dark:text-gray-400">
              <span className="tabular-nums">{staged.length}</span> {staged.length === 1 ? 'foto' : 'fotos'} · <span className="tabular-nums">{formatPhotoSize(totalSize)}</span>
            </p>
          )}
        </div>

        <CustomFilledButton
          label={`Subir ${staged.length} ${staged.length === 1 ? 'foto' : 'fotos'}`}
          type="button"
          icon={<Upload className="h-4 w-4 text-white" />}
          disabled={uploading || blocked}
          loading={uploading}
          className="flex-none"
          onClick={onUpload}
        />
      </footer>
    </section>
  )
}
