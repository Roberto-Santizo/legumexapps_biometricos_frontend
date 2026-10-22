import { Title, useNotification } from "@/features/shared/shared";
import { MAX_PHOTOS_PER_UPLOAD, PHOTO_ACCEPT, PhotoLookup, SessionSheet, UploadTray, isPhotoFile, photosRepositoryProvider, toPhotoKey, usePhotoSession, type StagedPhoto } from "@/features/photos/photos";
import { AlertTriangle, X } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// `errors` del backend no tiene un formato fijo: se busca el nombre original o la clave dentro de cada mensaje
const findUploadError = (item: StagedPhoto, errors: string[]) => {
  const keyPattern = new RegExp(`(^|[^A-Z0-9])${escapeRegExp(item.key)}([^A-Z0-9]|$)`, 'i');
  return errors.find(error => error.toLowerCase().includes(item.file.name.toLowerCase()) || keyPattern.test(error));
};

const hasFiles = (event: DragEvent) => event.dataTransfer?.types.includes('Files') ?? false;

export function Photos() {
  const notification = useNotification();
  const session = usePhotoSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const [staged, setStaged] = useState<StagedPhoto[]>([]);
  const [progress, setProgress] = useState(0);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  // libera las vistas previas que sigan en la mesa al salir de la pantalla
  const stagedRef = useRef(staged);
  useEffect(() => { stagedRef.current = staged; }, [staged]);
  useEffect(() => () => stagedRef.current.forEach(item => URL.revokeObjectURL(item.previewUrl)), []);

  const { mutate: upload, isPending: uploading } = useMutation({
    mutationFn: (items: StagedPhoto[]) => photosRepositoryProvider.uploadPhotos(items.map(item => item.file), setProgress),
    onMutate: () => {
      setProgress(0);
      setServerErrors([]);
    },
    onSuccess: (result, items) => {
      const failed = new Map<string, string>();
      items.forEach(item => {
        const error = findUploadError(item, result.errors);
        if (error) failed.set(item.id, error);
      });
      const uploaded = items.filter(item => !failed.has(item.id));
      const uploadedIds = new Set(uploaded.map(item => item.id));

      uploaded.forEach(item => URL.revokeObjectURL(item.previewUrl));
      session.add(uploaded.map(item => item.key), 'subida');
      setStaged(prev => prev
        .filter(item => !uploadedIds.has(item.id))
        .map(item => ({ ...item, error: failed.get(item.id) })));
      setServerErrors(result.errors);

      if (result.errors.length === 0) notification.success(result.message);
      else notification.warning(`${result.message}: ${result.errors.length} ${result.errors.length === 1 ? 'archivo' : 'archivos'} con error`);
    },
    onError: (err) => notification.error(err.message)
  });

  const addFiles = (files: File[]) => {
    if (uploading || files.length === 0) return;
    const images = files.filter(isPhotoFile);
    const ignored = files.length - images.length;
    const accepted = images.slice(0, Math.max(MAX_PHOTOS_PER_UPLOAD - staged.length, 0));

    if (ignored > 0) notification.warning(ignored === 1 ? 'Se omitió 1 archivo que no es JPG, PNG o GIF' : `Se omitieron ${ignored} archivos que no son JPG, PNG o GIF`);
    if (accepted.length < images.length) notification.warning(`Caben ${MAX_PHOTOS_PER_UPLOAD} fotos por carga; se omitieron ${images.length - accepted.length}`);

    setStaged(prev => [
      ...prev,
      ...accepted.map(file => ({ id: crypto.randomUUID(), file, previewUrl: URL.createObjectURL(file), key: toPhotoKey(file.name) }))
    ]);
  };

  const removeStaged = (id: string) => setStaged(prev => prev.filter(item => {
    if (item.id === id) URL.revokeObjectURL(item.previewUrl);
    return item.id !== id;
  }));

  const clearStaged = () => {
    staged.forEach(item => URL.revokeObjectURL(item.previewUrl));
    setStaged([]);
    setServerErrors([]);
  };

  const openPicker = () => inputRef.current?.click();

  // se puede soltar fotos en cualquier parte de la pantalla
  const onDropFiles = useEffectEvent((files: File[]) => addFiles(files));

  useEffect(() => {
    let depth = 0;

    const onEnter = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      depth++;
      setDragging(true);
    };
    const onLeave = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      depth = Math.max(0, depth - 1);
      if (depth === 0) setDragging(false);
    };
    const onOver = (event: DragEvent) => {
      if (hasFiles(event)) event.preventDefault();
    };
    const onDrop = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      depth = 0;
      setDragging(false);
      onDropFiles(Array.from(event.dataTransfer?.files ?? []));
    };

    window.addEventListener('dragenter', onEnter);
    window.addEventListener('dragleave', onLeave);
    window.addEventListener('dragover', onOver);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragenter', onEnter);
      window.removeEventListener('dragleave', onLeave);
      window.removeEventListener('dragover', onOver);
      window.removeEventListener('drop', onDrop);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <Title title="Fotos" subtitle="Banco de fotos de empleados. Cada archivo se guarda como NOMBRE.jpg, normalmente el PIN." />
        <PhotoLookup onLookup={(keys) => session.add(keys, 'consulta')} />
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={PHOTO_ACCEPT.join(',')}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          addFiles(Array.from(event.target.files ?? []));
          // permite volver a elegir los mismos archivos
          event.target.value = '';
        }}
      />

      {serverErrors.length > 0 && (
        <div role="alert" className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-red-600 dark:text-red-400" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-red-800 dark:text-red-200">El servidor no pudo guardar {serverErrors.length === 1 ? 'un archivo' : `${serverErrors.length} archivos`}</p>
            <ul className="mt-1.5 space-y-0.5 text-sm text-red-700 dark:text-red-300">
              {serverErrors.map(error => <li key={error} className="break-words">{error}</li>)}
            </ul>
          </div>
          <button type="button" onClick={() => setServerErrors([])} aria-label="Ocultar errores" className="grid h-7 w-7 flex-none place-items-center rounded-lg text-red-700 hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer dark:text-red-300 dark:hover:bg-red-500/20">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      <UploadTray
        staged={staged}
        uploading={uploading}
        progress={progress}
        onPick={openPicker}
        onRemove={removeStaged}
        onClear={clearStaged}
        onUpload={() => upload(staged)}
      />

      <SessionSheet
        photos={session.photos}
        onReplaced={(key) => session.refresh(key, 'reemplazo')}
        onDeleted={(key) => session.refresh(key)}
        onRemove={session.remove}
        onClear={session.clear}
      />

      {dragging && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 grid place-items-center bg-white/80 p-6 backdrop-blur-sm lg:left-72 dark:bg-gray-950/80">
          <div className="photo-frame w-full max-w-sm" data-status="drop">
            <div className="grid aspect-[3/4] place-items-center rounded-md bg-blue-50/80 px-6 text-center dark:bg-blue-500/10">
              <div>
                <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">{uploading ? 'Espere a que termine la carga' : 'Suelte para preparar las fotos'}</p>
                <p className="mt-1 text-sm text-blue-800/70 dark:text-blue-200/70">JPG, PNG o GIF · hasta {MAX_PHOTOS_PER_UPLOAD} por carga</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
