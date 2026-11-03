import { useController, type Control } from "react-hook-form";
import { SIGNATURE_MAX_SIZE_MB, SignaturePad, type EmployeePermissionForm } from "@/features/employee-permissions/employee-permissions";

type SignatureField = 'employee_signature' | 'substitute_signature' | 'supervisor_signature' | 'floor_auditor_signature';

type Props = {
  control: Control<EmployeePermissionForm>;
  name: SignatureField;
  label: string;
}

export function SignatureFormField({ control, name, label }: Props) {
  const { field: { value, onChange, onBlur }, fieldState: { error } } = useController({
    control,
    name,
    rules: {
      validate: (file: File | null) => {
        if (!file) return `La firma del ${label.toLowerCase()} es requerida`;
        if (file.size > SIGNATURE_MAX_SIZE_MB * 1024 * 1024) return `La firma supera el máximo de ${SIGNATURE_MAX_SIZE_MB} MB`;
        return true;
      }
    }
  });

  return (
    <SignaturePad
      id={name}
      label={label}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      errorMessage={error?.message}
    />
  )
}
