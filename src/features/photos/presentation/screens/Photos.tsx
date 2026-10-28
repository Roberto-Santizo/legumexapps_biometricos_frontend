import { ActionsMenu, CustomFilledButton, FilterDrawer, LoadingData, Pagination, Table, Tbody, Td, Th, Thead, Title, Tr, ZoomablePhoto, useNotification, usePagination } from "@/features/shared/shared";
import { CreatePhotoModal, PHOTO_ACCEPT, formatPhotoDate, isPhotoFile, photosRepositoryProvider, type Photo } from "@/features/photos/photos";
import { ImageOff, PlusIcon, RefreshCw, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function Photos() {
  const navigate = useNavigate();
  const notification = useNotification();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, rowsPerPage } = usePagination(searchParams);
  const code = searchParams.get('code') ?? '';
  const inputRef = useRef<HTMLInputElement>(null);
  const [creating, setCreating] = useState(false);
  // foto elegida en "Reemplazar" mientras se abre el selector de archivos
  const [replacing, setReplacing] = useState<Photo | null>(null);
  // PATCH no cambia la URL de la imagen: la versión rompe la caché del navegador tras reemplazarla
  const [versions, setVersions] = useState<Record<string, number>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['getPhotos', page, rowsPerPage, code],
    queryFn: () => photosRepositoryProvider.getPhotos(page, rowsPerPage, { code })
  });

  const { mutate: replace } = useMutation({
    mutationFn: ({ photo, file }: { photo: Photo; file: File }) => photosRepositoryProvider.updatePhoto(photo.id, file),
    onSuccess: (message, { photo }) => {
      notification.success(message);
      setVersions(prev => ({ ...prev, [photo.id]: Date.now() }));
      queryClient.invalidateQueries({ queryKey: ['getPhotos'] });
    },
    onError: (err) => notification.error(err.message)
  });

  const { mutate: remove } = useMutation({
    mutationFn: (photo: Photo) => photosRepositoryProvider.deletePhoto(photo.id),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getPhotos'] });
    },
    onError: (err) => notification.error(err.message)
  });

  const pickReplacement = (photo: Photo) => {
    setReplacing(photo);
    inputRef.current?.click();
  };

  const handleReplacement = (file: File | undefined) => {
    if (!file || !replacing) return;
    if (!isPhotoFile(file)) {
      notification.error('Formato no permitido. Use JPG, PNG o GIF.');
      return;
    }
    replace({ photo: replacing, file });
  };

  const handleDelete = (photo: Photo) => notification.question(
    `¿Eliminar la foto ${photo.code}?`,
    'Eliminar',
    'Se borrará la imagen del almacenamiento y su registro. Esta acción no se puede deshacer.',
    () => remove(photo)
  );

  return (
    <div className="space-y-5">
      <Title title="Fotos" subtitle="Banco de fotos de empleados. Cada foto se guarda como CÓDIGO.jpg, normalmente el PIN." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterDrawer
          fields={[
            { name: 'code', label: 'Código', placeholder: 'Buscar por código' },
          ]}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

        <div className="flex flex-wrap gap-2">
          <CustomFilledButton
            label="Carga masiva"
            type="button"
            icon={<Upload className="text-white" />}
            onClick={() => navigate('/fotos/cargar')}
          />
          <CustomFilledButton
            label="Crear Foto"
            type="button"
            icon={<PlusIcon className="text-white" />}
            onClick={() => setCreating(true)}
          />
        </div>
      </div>

      <CreatePhotoModal open={creating} onClose={() => setCreating(false)} />

      <input
        ref={inputRef}
        type="file"
        accept={PHOTO_ACCEPT.join(',')}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          handleReplacement(event.target.files?.[0]);
          // permite volver a elegir el mismo archivo
          event.target.value = '';
        }}
      />

      {isLoading && <LoadingData />}

      {data && (
        <>
          <Table>
            <Thead>
              <Th text="Foto" />
              <Th text="Código" />
              <Th text="Archivo" />
              <Th text="Registrada por" />
              <Th text="Fecha" />
              <Th text="Acciones" />
            </Thead>

            <Tbody>
              {data.data.map(photo => {
                const src = photosRepositoryProvider.getPhotoUrl(photo.url, versions[photo.id] ?? Date.parse(photo.updatedAt));

                return (
                  <Tr key={photo.id}>
                    <Td>
                      <ZoomablePhoto
                        key={src}
                        src={src}
                        alt={`Foto ${photo.code}`}
                        caption={photo.url}
                        className="h-14 w-11 rounded-lg"
                        fallback={<ImageOff className="h-5 w-5 text-slate-400 dark:text-gray-500" aria-label="Imagen no disponible" />}
                      />
                    </Td>
                    <Td className="font-mono">{photo.code}</Td>
                    <Td>{photo.url}</Td>
                    <Td>{photo.created_by.name}</Td>
                    <Td>{formatPhotoDate(photo.createdAt)}</Td>
                    <Td>
                      <ActionsMenu
                        items={[
                          { label: 'Reemplazar', icon: <RefreshCw />, onClick: () => pickReplacement(photo) },
                          { label: 'Eliminar', icon: <Trash2 />, destructive: true, onClick: () => handleDelete(photo) },
                        ]}
                      />
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>

          {data.data.length === 0 && (
            <p className="text-center text-sm text-slate-500 dark:text-gray-400">No se encontraron fotos</p>
          )}

          <Pagination
            count={data.total}
            page={page}
            rowsPerPage={rowsPerPage}
            setSearchParams={setSearchParams}
          />
        </>
      )}
    </div>
  )
}
