import type { SetURLSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    page: number;
    rowsPerPage: number;
    /** Total de registros; -1 cuando el backend no lo conoce */
    count: number;
    setSearchParams: SetURLSearchParams;
}

const ROWS_OPTIONS = [10, 25, 50, 100];

function pageList(total: number, current: number): (number | "…")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i);
    const pages = new Set([0, total - 1, current - 1, current, current + 1]);
    const sorted = [...pages].filter((p) => p >= 0 && p < total).sort((a, b) => a - b);
    const out: (number | "…")[] = [];
    sorted.forEach((p, i) => {
        if (i > 0 && p - sorted[i - 1] > 1) out.push("…");
        out.push(p);
    });
    return out;
}

export function Pagination({ page, rowsPerPage, count, setSearchParams }: PaginationProps) {
    const handleChangePage = (newPage: number) => {
        setSearchParams((params) => {
            params.set('page', newPage.toString());
            return params;
        });
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = parseInt(event.target.value, 10);
        setSearchParams((params) => {
            params.set('limit', newLimit.toString());
            params.set('page', '0');
            return params;
        });
    };

    // Total desconocido (-1): se permite avanzar una página más allá de la actual
    const isTotalKnown = count >= 0;
    const totalPages = isTotalKnown ? Math.max(1, Math.ceil(count / rowsPerPage)) : page + 2;
    const isFirst = page <= 0;
    const isLast = isTotalKnown && page >= totalPages - 1;
    const goTo = (p: number) => handleChangePage(Math.min(Math.max(p, 0), totalPages - 1));
    const pages: (number | "…")[] = isTotalKnown ? pageList(totalPages, page) : [...pageList(page + 1, page), "…"];

    const rowsSelect = (
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
            Por página
            <select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-medium tabular-nums text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
                {ROWS_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
        </label>
    );

    const pager = (
        <nav aria-label="Paginación" className="flex items-center gap-1">
            <button type="button" onClick={() => goTo(page - 1)} disabled={isFirst} aria-label="Página anterior" className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-500 disabled:pointer-events-none disabled:opacity-35 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100">
                <ChevronLeft size={18} aria-hidden="true" />
            </button>
            {pages.map((p, i) =>
                p === "…" ? (
                    <span key={`gap-${i}`} className="grid h-9 w-6 place-items-center text-sm text-slate-400 dark:text-gray-500" aria-hidden="true">…</span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        onClick={() => goTo(p)}
                        aria-current={p === page ? "page" : undefined}
                        aria-label={`Página ${p + 1}`}
                        className={`grid h-9 min-w-9 place-items-center rounded-lg px-2 text-sm font-semibold tabular-nums transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${p === page
                            ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30 dark:bg-blue-500"
                            : "text-slate-700 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-800"
                            }`}
                    >
                        {p + 1}
                    </button>
                )
            )}
            <button type="button" onClick={() => goTo(page + 1)} disabled={isLast} aria-label="Página siguiente" className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-500 disabled:pointer-events-none disabled:opacity-35 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100">
                <ChevronRight size={18} aria-hidden="true" />
            </button>
        </nav>
    );

    return (
        <div className="mt-5 flex flex-wrap items-center justify-end gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:shadow-none sm:px-6">
            {rowsSelect}
            {pager}
        </div>
    )
}
