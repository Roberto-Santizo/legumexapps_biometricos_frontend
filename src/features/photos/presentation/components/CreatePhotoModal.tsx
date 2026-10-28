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
          <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">Normalmente el PIN del empleado. La imagen se guarda como <span className="font-mono">{key || 'CÓDIGO'}.jpg</span>.</p>
          <input
            id={inputId}
            type="text"
            autoComplete="off"
            spellCheck={false}
            value={code}
            onChange={(event) => setCode(event.target.value)}
            disabled={isPending}
            placeholder="10045"
            className="input-filter mt-2 w-full font-mono tracking-wide sm:w-full"
          />
        </div>

        <ImageUploader
          label="Imagen"
          accept={PHOTO_ACCEPT}
          submitLabel="Crear foto"
          loading={isPending}
          disabled={!key}
          onUpload={(file) => mutateAsync(file)}
        />
      </div>
    </Modal>
  )
}
