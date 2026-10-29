import { ImageUploader, Modal, useNotification } from "@/features/shared/shared";
import { PHOTO_ACCEPT, photosRepositoryProvider, toPhotoKey } from "@/features/photos/photos";
import { useId, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  open: boolean;
  onClose: () => void;
}

// POST /photos: una foto con el código escrito a mano, sin depender del nombre del archivo
export function CreatePhotoModal({ open, onClose }: Props) {
  const notification = useNotification();
  const queryClient = useQueryClient();
  const inputId = useId();
  const [code, setCode] = useState('');
  const key = toPhotoKey(code);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (file: File) => photosRepositoryProvider.createPhoto(key, file),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getPhotos'] });
      setCode('');
      onClose();
    },
    onError: (err) => notification.error(err.message)
  });

  return (
    <Modal modal={open} closeModal={onClose} title="Nueva foto" width="sm:max-w-lg">
      <div className="space-y-4">
        <div>
          <label htmlFor={inputId} className="text-sm font-semibold text-slate-900 dark:text-gray-100">Código</label>
          <div className="mt-2 flex items-stretch overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600">
            <input
              id={inputId}
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              disabled={isPending}
              placeholder="10045"
              aria-describedby={`${inputId}-hint`}
              className="min-w-0 flex-1 bg-transparent px-3 py-2 font-mono tracking-wide text-gray-900 placeholder-gray-400 outline-none dark:text-gray-100 dark:placeholder-gray-500"
            />
            <span className="grid place-items-center border-l border-gray-200 bg-slate-50 px-3 font-mono text-sm text-slate-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">.jpg</span>
          </div>
          <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-slate-500 dark:text-gray-400">Normalmente el PIN del empleado; es el nombre con el que se guarda la imagen.</p>
        </div>

        <ImageUploader
          label="Imagen"
          accept={PHOTO_ACCEPT}
          submitLabel="Crear foto"
          loading={isPending}
          disabled={!key}
          className="border-0! bg-transparent! p-0!"
          onUpload={(file) => mutateAsync(file)}
        />
      </div>
    </Modal>
  )
}
