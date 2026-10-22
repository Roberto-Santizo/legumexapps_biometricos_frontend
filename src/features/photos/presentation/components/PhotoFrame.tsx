import { SpinnerComponent, useNotification } from "@/features/shared/shared";
import { PHOTO_ACCEPT, isPhotoFile, photoOriginLabels, photosRepositoryProvider, type SessionPhoto } from "@/features/photos/photos";
import { ImageOff, ImageUp, RefreshCw, Trash2, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";

type ImageStatus = 'loading' | 'ready' | 'missing';

const formatTime = (timestamp: number) => new Date(timestamp).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });

type Props = {
  photo: SessionPhoto;
  onReplaced: (key: string) => void;
  onDeleted: (key: string) => void;
  onRemove: (key: string) => void;
}

export function PhotoFrame({ photo, onReplaced, onDeleted, onRemove }: Props) {
  const notification = useNotification();
  const inputRef = useRef<HTMLInputElement>(null);
  const viewerId = useId();
  const src = photosRepositoryProvider.getPhotoUrl(photo.key, photo.version);
  const fileName = `${photo.key}.jpg`;

  // el estado se asocia a la URL: al cambiar la versión vuelve a "loading" sin un efecto
  const [image, setImage] = useState<{ src: string; status: ImageStatus }>({ src, status: 'loading' });
  const status: ImageStatus = image.src === src ? image.status : 'loading';

  const { mutate: replace, isPending: isReplacing } = useMutation({
    mutationFn: (file: File) => photosRepositoryProvider.updatePhoto(photo.key, file),
    onSuccess: (message) => {
      notification.success(message);
      onReplaced(photo.key);
    },
    onError: (err) => notification.error(err.message)
  });

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: () => photosRepositoryProvider.deletePhoto(photo.key),
    onSuccess: (message) => {
      notification.success(message);
      onDeleted(photo.key);
    },
    onError: (err) => notification.error(err.message)
  });

  const busy = isReplacing || isDeleting;

  const selectFile = (file: File | undefined) => {
    if (!file) return;
    if (!isPhotoFile(file)) {
      notification.error('Formato no permitido. Use JPG, PNG o GIF.');
      return;
    }
    replace(file);
  };

  const handleDelete = () => notification.question(
    `¿Eliminar ${fileName}?`,
    'Eliminar',
    'La foto se borrará del almacenamiento. Esta acción no se puede deshacer.',
    () => remove()
  );

  const caption = status === 'missing'
    ? 'No está en el almacenamiento'
    : `${photoOriginLabels[photo.origin]} · ${formatTime(photo.version)}`;

  return (
    <li className="group/frame relative motion-safe:animate-fade-up">
      <div className="photo-frame" data-status={status}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-slate-100 dark:bg-gray-800">
          {status !== 'missing' && (
            <button
              type="button"
              popoverTarget={viewerId}
              aria-label={`Ampliar ${fileName}`}
              disabled={status !== 'ready'}
              className="block h-full w-full cursor-zoom-in focus:outline-none disabled:cursor-default"
            >
              <img
                src={src}
                alt={`Foto ${fileName}`}
                loading="lazy"
                onLoad={() => setImage({ src, status: 'ready' })}
                onError={() => setImage({ src, status: 'missing' })}
                className={`h-full w-full object-cover transition-opacity duration-300 ${status === 'ready' ? 'opacity-100' : 'opacity-0'}`}
              />
            </button>
          )}

          {status === 'loading' && (
            <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-slate-200/70 dark:bg-gray-700/60" />
          )}

          {status === 'missing' && (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-3 text-center">
              <ImageOff className="h-7 w-7 text-slate-400 dark:text-gray-500" aria-hidden="true" />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer dark:bg-gray-900 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-gray-800"
              >
                <ImageUp className="h-3.5 w-3.5" aria-hidden="true" /> Subir foto
              </button>
            </div>
          )}

          {busy && (
            <div className="absolute inset-0 grid place-items-center bg-white/70 backdrop-blur-[2px] dark:bg-gray-950/70" role="status" aria-label={isDeleting ? `Eliminando ${fileName}` : `Subiendo ${fileName}`}>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-600 shadow-sm"><SpinnerComponent /></span>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(photo.key)}
        aria-label={`Quitar ${fileName} de la sesión`}
        title="Quitar de la sesión (no borra la foto)"
        className="absolute -top-1 -right-1 z-10 grid h-7 w-7 place-items-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer opacity-0 group-hover/frame:opacity-100 group-focus-within/frame:opacity-100 [@media(hover:none)]:opacity-100 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:text-gray-100"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      <div className="mt-1.5 flex items-start justify-between gap-2 px-[7px]">
        <div className="min-w-0">
          <p className="truncate font-mono text-[13px] font-semibold tracking-wide text-slate-900 dark:text-gray-100" title={fileName}>
            {photo.key}<span className="font-normal text-slate-400 dark:text-gray-500">.jpg</span>
          </p>
          <p className={`truncate text-xs ${status === 'missing' ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-gray-400'}`}>{caption}</p>
        </div>

        {status === 'ready' && (
          <div className="-mr-1.5 flex flex-none items-center">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              aria-label={`Reemplazar ${fileName}`}
              title="Reemplazar"
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy}
              aria-label={`Eliminar ${fileName}`}
              title="Eliminar del almacenamiento"
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer dark:text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={PHOTO_ACCEPT.join(',')}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          selectFile(event.target.files?.[0]);
          // permite volver a elegir el mismo archivo
          event.target.value = '';
        }}
      />

      {status === 'ready' && (
        <div id={viewerId} popover="auto" role="dialog" aria-label={fileName} className="photo-viewer m-auto overflow-visible border-0 bg-transparent p-0">
          <figure className="relative flex flex-col items-center gap-3">
            <img src={src} alt={`Foto ${fileName}`} className="max-h-[80vh] max-w-[92vw] rounded-2xl object-contain shadow-[0_25px_50px_-12px_rgb(0_0_0/0.5)]" />
            <figcaption className="font-mono text-sm font-medium tracking-wide text-gray-100">{fileName}</figcaption>
            <button type="button" popoverTarget={viewerId} popoverTargetAction="hide" aria-label="Cerrar" className="absolute -top-3 -right-3 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white text-slate-700 shadow-md transition hover:scale-105 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 dark:bg-gray-800 dark:text-gray-200 dark:hover:text-white">
              <X className="h-[18px] w-[18px]" />
            </button>
          </figure>
        </div>
      )}
    </li>
  )
}
