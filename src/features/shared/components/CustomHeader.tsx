import { Menu } from "lucide-react";

type Props = {
  open: boolean;
  onMenuClick: () => void;
};

export function CustomHeader({ open, onMenuClick }: Props) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4 lg:hidden dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Abrir menú"
        aria-expanded={open}
        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <Menu size={22} />
      </button>

      <img
        src="https://legumexappsapi-storage.s3.us-east-1.amazonaws.com/resources/LOGO_LX_V2.png"
        alt="Logo"
        className="h-8 w-8 object-contain"
      />

      <h1 className="font-semibold text-gray-900 dark:text-gray-100">
        Biométricos
      </h1>
    </header>
  );
}
