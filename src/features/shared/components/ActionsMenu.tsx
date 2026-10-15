import { Fragment } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Ellipsis } from "lucide-react";

export type ActionsMenuItem = {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    destructive?: boolean;
    disabled?: boolean;
}

type Props = {
    items: ActionsMenuItem[];
    label?: string;
}

export function ActionsMenu({ items, label = "Acciones" }: Props) {
    return (
        <Menu as="div" className="relative inline-flex">
            <MenuButton aria-label={label} className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-blue-600 transition hover:bg-slate-200 active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 data-open:bg-blue-600 data-open:text-white dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 dark:data-open:bg-blue-500 dark:data-open:text-white">
                <Ellipsis size={18} strokeWidth={2.5} aria-hidden="true" />
            </MenuButton>
            <MenuItems
                transition
                anchor="bottom end"
                className="z-50 w-56 origin-top-right overflow-hidden rounded-2xl bg-white/80 shadow-2xl shadow-slate-900/20 ring-1 ring-black/5 outline-none backdrop-blur-xl backdrop-saturate-150 [--anchor-gap:8px] transition duration-200 ease-[cubic-bezier(.2,.8,.2,1)] data-closed:scale-90 data-closed:opacity-0 dark:bg-gray-800/80 dark:shadow-black/50 dark:ring-white/10"
            >
                {items.map((item, i) => (
                    <Fragment key={item.label}>
                        {i > 0 && <div className="h-px bg-black/10 dark:bg-white/10" />}
                        <MenuItem disabled={item.disabled}>
                            <button
                                type="button"
                                onClick={item.onClick}
                                className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-[15px] data-disabled:opacity-40 data-focus:bg-black/5 dark:data-focus:bg-white/10 ${item.destructive
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-slate-900 dark:text-gray-100"
                                    }`}
                            >
                                {item.label}
                                {item.icon && <span className="[&>svg]:h-[18px] [&>svg]:w-[18px]" aria-hidden="true">{item.icon}</span>}
                            </button>
                        </MenuItem>
                    </Fragment>
                ))}
            </MenuItems>
        </Menu>
    )
}
