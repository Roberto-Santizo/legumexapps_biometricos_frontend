import { useState } from "react";
import { PenLine } from "lucide-react";
import { CustomFilledButton, Modal } from "@/features/shared/shared";
import { SIGNATURE_MAX_SIZE_MB, SignaturePad, signerLabels } from "@/features/employee-permissions/employee-permissions";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (signature: File) => void;
  loading: boolean;
  folio: number;
}

export function HrSignatureModal({ open, onClose, onConfirm, loading, folio }: Props) {
  const [signature, setSignature] = useState<File | null>(null);
  const tooLarge = !!signature && signature.size > SIGNATURE_MAX_SIZE_MB * 1024 * 1024;

  const handleClose = () => {
    setSignature(null);
    onClose();
  }

  return (
    <Modal modal={open} closeModal={handleClose} title={`Vo.Bo. de RRHH · Folio ${folio}`}>
      <div className="space-y-5">
        <p className="text-sm text-slate-600 dark:text-gray-400">
          Con la firma de Recursos Humanos el permiso queda válido y ya no podrá editarse ni eliminarse.
        </p>

        <SignaturePad
          id="hr_signature"
          label={signerLabels.hr}
          value={signature}
          onChange={setSignature}
          errorMessage={tooLarge ? `La firma supera el máximo de ${SIGNATURE_MAX_SIZE_MB} MB` : undefined}
          disabled={loading}
        />

        <CustomFilledButton
          label="Firmar y validar"
          type="button"
          icon={<PenLine className="h-4 w-4 text-white" />}
          fullWitdh={true}
          disabled={!signature || tooLarge || loading}
          loading={loading}
          onClick={() => signature && onConfirm(signature)}
        />
      </div>
    </Modal>
  )
}
