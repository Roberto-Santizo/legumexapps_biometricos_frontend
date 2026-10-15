import { Clock } from "lucide-react";

export function WorkingOnIt() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6 rounded-full bg-amber-100 p-5 dark:bg-amber-500/15">
        <Clock className="h-12 w-12 animate-spin text-amber-500" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Estamos trabajando en esta sección
      </h2>

      <p className="mt-3 max-w-md text-gray-600 dark:text-gray-400">
        Esta funcionalidad aún se encuentra en desarrollo. Muy pronto estará
        disponible con todas sus características.
      </p>

      <div className="mt-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500"></span>
        <span>En desarrollo</span>
      </div>
    </div>
  );
}