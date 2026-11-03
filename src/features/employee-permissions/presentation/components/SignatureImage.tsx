import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { employeePermissionsRepositoryProvider, type PermissionSigner } from "@/features/employee-permissions/employee-permissions";

type Props = {
  permissionId: string;
  signer: PermissionSigner;
  alt: string;
}

// La firma se descarga con el token (no sirve un <img src> directo) y se muestra desde una URL temporal
export function SignatureImage({ permissionId, signer, alt }: Props) {
  const { data: blob, isLoading, isError } = useQuery({
    queryKey: ['getPermissionSignature', permissionId, signer],
    queryFn: () => employeePermissionsRepositoryProvider.getPermissionSignature(permissionId, signer),
    // Una firma registrada no cambia
    staleTime: Infinity
  });

  const url = useMemo(() => blob ? URL.createObjectURL(blob) : null, [blob]);

  // libera la URL temporal al cambiarla o al desmontar
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  if (isLoading) return <div className="aspect-[3/1] w-full animate-pulse rounded-xl bg-slate-100 dark:bg-gray-800" />
  if (isError || !url) return (
    <div className="flex aspect-[3/1] w-full items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs text-slate-500 dark:border-gray-700 dark:text-gray-400">
      No se pudo cargar la firma
    </div>
  )

  return <img src={url} alt={alt} className="aspect-[3/1] w-full rounded-xl border border-slate-200 bg-white object-contain dark:border-gray-700" />
}
