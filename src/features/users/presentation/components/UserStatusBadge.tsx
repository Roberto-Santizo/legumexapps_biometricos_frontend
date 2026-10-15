type Props = {
    isActive: boolean;
}

export function UserStatusBadge({ isActive }: Props) {
    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isActive
                ? "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                : "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                }`}
        >
            {isActive ? 'Activo' : 'Inactivo'}
        </span>
    )
}
