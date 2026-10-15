import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/features/shared/shared";

type Props = {
    className?: string;
}

export function ThemeToggle({ className = "rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100" }: Props) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            className={className}
        >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}
