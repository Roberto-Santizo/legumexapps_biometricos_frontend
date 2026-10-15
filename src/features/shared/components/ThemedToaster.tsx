import { Toaster } from "sonner";
import { useTheme } from "@/features/shared/shared";

export function ThemedToaster() {
    const { theme } = useTheme();

    return <Toaster theme={theme} richColors />;
}
