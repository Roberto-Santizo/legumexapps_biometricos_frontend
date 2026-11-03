import { ShieldCheck, ShieldAlert } from "lucide-react";

type Props = {
  isValid: boolean;
}

// El permiso solo es válido con la firma de Vo.Bo. de RRHH
export function PermissionStatusBadge({ isValid }: Props) {
  return isValid ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
      <ShieldCheck className="h-3.5 w-3.5" /> Válido
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
      <ShieldAlert className="h-3.5 w-3.5" /> Pendiente de RRHH
    </span>
  )
}
