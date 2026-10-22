import { PhotoFrame, type SessionPhoto } from "@/features/photos/photos";

type Props = {
  photos: SessionPhoto[];
  onReplaced: (key: string) => void;
  onDeleted: (key: string) => void;
  onRemove: (key: string) => void;
  onClear: () => void;
}

const GRID = "grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6";

// Hoja con las fotos tocadas en esta sesión; vive solo en este navegador
export function SessionSheet({ photos, onReplaced, onDeleted, onRemove, onClear }: Props) {
  return (
    <section aria-labelledby="session-sheet-title" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <div>
          <h2 id="session-sheet-title" className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-gray-100">
            Fotos de esta sesión
            {photos.length > 0 && <span className="text-sm font-medium tabular-nums text-slate-400 dark:text-gray-500">{photos.length}</span>}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">Se guardan solo en este navegador. Quitar una foto de aquí no la borra del almacenamiento.</p>
        </div>
        {photos.length > 0 && (
          <button type="button" onClick={onClear} className="filter-clear">Limpiar sesión</button>
        )}
      </div>

      {photos.length === 0 ? (
        <div className="relative">
          <ul aria-hidden="true" className={`${GRID} opacity-60 [mask-image:linear-gradient(to_right,black_30%,transparent_85%)]`}>
            {[0, 1, 2, 3, 4, 5].map(i => (
              <li key={i} className={i > 2 ? 'hidden md:block' : i > 1 ? 'hidden sm:block' : ''}>
                <div className="photo-frame" data-status="empty">
                  <div className="aspect-[3/4] rounded-md bg-slate-50 dark:bg-gray-900" />
                </div>
                <div className="mt-2.5 ml-[7px] h-3 w-16 rounded bg-slate-100 dark:bg-gray-800" />
              </li>
            ))}
          </ul>
          <p className="absolute inset-x-0 top-[38%] mx-auto max-w-xs rounded-xl bg-white/90 px-4 py-3 text-center text-sm text-slate-600 shadow-sm ring-1 ring-slate-200 backdrop-blur sm:left-0 sm:mx-0 sm:ml-[7px] sm:text-left dark:bg-gray-900/90 dark:text-gray-300 dark:ring-gray-700">
            Consulte un PIN o suba fotos. Aparecerán aquí para revisarlas, reemplazarlas o eliminarlas.
          </p>
        </div>
      ) : (
        <ul className={GRID}>
          {photos.map(photo => (
            <PhotoFrame
              key={photo.key}
              photo={photo}
              onReplaced={onReplaced}
              onDeleted={onDeleted}
              onRemove={onRemove}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
