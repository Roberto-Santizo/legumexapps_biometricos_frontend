import { useWatch, type Control } from "react-hook-form";
import { SignatureFormField, signerLabels, type EmployeePermissionForm } from "@/features/employee-permissions/employee-permissions";

type Props = {
  control: Control<EmployeePermissionForm>;
}

// Firmas obligatorias al crear el permiso; la del comodín solo aparece (y se exige) si se eligió comodín
export function SignaturesFormFields({ control }: Props) {
  const substitutePin = useWatch({ control, name: 'substitute_pin' });

  return (
    <fieldset className="space-y-5">
      <legend className="mb-3 text-sm font-semibold text-slate-900 dark:text-gray-100">Firmas</legend>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <SignatureFormField control={control} name="employee_signature" label={signerLabels.employee} />
        {substitutePin && (
          <SignatureFormField key="substitute_signature" control={control} name="substitute_signature" label={signerLabels.substitute} />
        )}
        <SignatureFormField control={control} name="supervisor_signature" label={signerLabels.supervisor} />
        <SignatureFormField control={control} name="floor_auditor_signature" label={signerLabels.floor_auditor} />
      </div>
    </fieldset>
  )
}
