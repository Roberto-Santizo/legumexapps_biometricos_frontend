import { Link } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";

export function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 bg-white dark:bg-gray-950">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <SearchX className="h-10 w-10 text-gray-500 dark:text-gray-400" />
        </div>

        <h1 className="mt-8 text-6xl font-bold text-gray-900 dark:text-gray-100">404</h1>

        <h2 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Página no encontrada
        </h2>

        <p className="mt-3 text-gray-500 dark:text-gray-400">
          Lo sentimos, la página que intentas visitar no existe o fue movida.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}