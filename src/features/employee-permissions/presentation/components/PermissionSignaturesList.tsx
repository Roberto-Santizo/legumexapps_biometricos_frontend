import { SignatureImage, permissionSigners, signerLabels, type EmployeePermission } from "@/features/employee-permissions/employee-permissions";

type Props = {
  permission: EmployeePermission;
}

const formatDateTime = (value?: string | null) => value ? new Date(value).toLocaleString('es-GT') : '—';

export function PermissionSignaturesList({ permission }: Props) {
  const nameBySigner = {
    employee: permission.employee.name,
    substitute: permission.substitute?.name,
    supervisor: undefined,
    floor_auditor: undefined,
    hr: permission.hr_signed_by ?? undefined
  };

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-gray-100">Firmas</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {permissionSigners(permission).map(signer => (
          <div key={signer} className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-gray-100">{signerLabels[signer]}</p>
              {nameBySigner[signer] && <p className="text-xs text-slate-500 dark:text-gray-400">{nameBySigner[signer]}</p>}
              {signer === 'hr' && permission.hr_signed_at && (
                <p className="text-xs tabular-nums text-slate-500 dark:text-gray-400">{formatDateTime(permission.hr_signed_at)}</p>
              )}
            </div>

            {permission.signatures[signer] ? (
              <SignatureImage permissionId={permission.id} signer={signer} alt={`Firma: ${signerLabels[signer]}`} />
            ) : (
              <div className="flex aspect-[3/1] w-full items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs text-slate-500 dark:border-gray-700 dark:text-gray-400">
                Sin firma
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
