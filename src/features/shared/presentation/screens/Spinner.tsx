export function Spinner() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-slate-800 dark:border-gray-700 dark:border-t-gray-200" />

        <p className="text-sm text-slate-500 dark:text-gray-400">
          Cargando información...
        </p>
      </div>
    </div>
  );
}