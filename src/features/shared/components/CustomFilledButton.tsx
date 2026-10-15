import { SpinnerComponent } from "@/features/shared/shared";

type Props = {
    label: string;
    type: "submit" | "reset" | "button" | undefined;
    onClick?: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    fullWitdh?: boolean;
    className?: string;
}
export function CustomFilledButton({ label, type, onClick, icon, disabled = false, loading, fullWitdh = false, className }: Props) {
    const isLoading = loading ?? disabled;
    const hasIcon = icon ? true : false;
    const classNameComponent = `
                ${fullWitdh ? "w-full" : ""}
                ${hasIcon ? "inline-flex items-center justify-center gap-2" : ""}
                rounded-xl
                bg-emerald-600
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:bg-emerald-700
                hover:shadow-md
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:bg-emerald-400
                disabled:shadow-none
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-500
                focus:ring-offset-2
                dark:focus:ring-offset-gray-900
                cursor-pointer
                ${className}
            `;
    return (
        <button disabled={disabled} type={type} className={classNameComponent} onClick={onClick ? () => onClick() : () => { }}>
            {icon ? (icon) : (<></>)}
            {isLoading ? <SpinnerComponent /> : (<p className="text-white font-semibold">{label}</p>)}
        </button>
    )
}
