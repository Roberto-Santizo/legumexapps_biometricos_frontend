import { toast } from "sonner";
import type { NotificationAdapter } from "@/features/shared/shared";

export class SonnerNotificationProvider implements NotificationAdapter {
    success(message: string): void {
        toast.success(message, { position: 'top-center' });
    }

    error(message: string): void {
        toast.error(message, { position: 'top-center' });
    }

    warning(message: string): void {
        toast.warning(message, { position: 'top-center' });
    }

    information(message: string): void {
        toast.info(message, { position: 'top-center' });
    }

    question(message: string, buttonLabel: string, desc: string, callBack: () => void) {
        toast(message, {
            position: 'top-center',
            description: desc,
            action: {
                label: buttonLabel,
                onClick: () => callBack()
            },
        })
    }

}