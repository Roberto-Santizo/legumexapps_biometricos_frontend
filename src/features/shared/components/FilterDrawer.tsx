import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import type { SetURLSearchParams } from "react-router-dom";

export type FilterField = {
  name: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'number' | 'date' | 'datetime-local';
  options?: { value: string; label: string }[];
};

type Props = {
  fields: FilterField[];
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  title?: string;
};

export function FilterDrawer({ fields, searchParams, setSearchParams, title = "Filtros" }: Props) {
  const [open, setOpen] = useState(false);

  const active = fields
    .map(field => ({ field, value: searchParams.get(field.name) ?? '' }))
    .filter(({ value }) => value !== '');

  const update = (values: Record<string, string>) => {
    setSearchParams((params) => {
      fields.forEach(({ name }) => {
        const value = (values[name] ?? '').trim();
        if (value) params.set(name, value);
        else params.delete(name);
      });
      params.set('page', '0');
      return params;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    update(Object.fromEntries(fields.map(({ name }) => [name, String(form.get(name) ?? '')])));
    setOpen(false);
  };

  const remove = (name: string) => {
    update(Object.fromEntries(active.filter(({ field }) => field.name !== name).map(({ field, value }) => [field.name, value])));
  };

  const displayValue = (field: FilterField, value: string) =>
    field.options?.find(option => option.value === value)?.label ?? value;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => setOpen(true)} className="filter-trigger" aria-haspopup="dialog">
        <SlidersHorizontal className="h-4 w-4" />
        {title}
        {active.length > 0 && <span className="filter-trigger__count">{active.length}</span>}
      </button>

      {active.map(({ field, value }) => (
        <span key={field.name} className="filter-chip">
          <span className="text-slate-500 dark:text-gray-400">{field.label}:</span>
          <span className="max-w-40 truncate font-medium">{displayValue(field, value)}</span>
          <button type="button" onClick={() => remove(field.name)} className="filter-chip__remove" aria-label={`Quitar filtro ${field.label}`}>
            <X className="h-3.5 w-3.5" />
          </button>
        </span>
      ))}

      {active.length > 1 && (
        <button type="button" onClick={() => update({})} className="filter-clear">
          Limpiar todo
        </button>
      )}

      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-slate-900/40 transition-opacity duration-300 ease-out data-closed:opacity-0 motion-reduce:transition-none dark:bg-black/60"
        />

        <div className="fixed inset-0 flex justify-end">
          <DialogPanel
            transition
            className="flex h-full w-full max-w-sm flex-col bg-white shadow-[-12px_0_32px_-8px_rgb(15_23_42/0.18)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-closed:translate-x-full motion-reduce:transition-none dark:bg-gray-900 dark:shadow-none dark:ring-1 dark:ring-white/10"
          >
            <form onSubmit={handleSubmit} className="flex h-full flex-col" key={searchParams.toString()}>
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-gray-700">
                <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-gray-100">{title}</DialogTitle>
                <button type="button" onClick={() => setOpen(false)} className="filter-chip__remove p-1.5!" aria-label="Cerrar filtros">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
                {fields.map(field => (
                  <div key={field.name} className="space-y-1.5">
                    <label htmlFor={`filter-${field.name}`} className="block text-sm font-medium text-slate-700 dark:text-gray-300">
                      {field.label}
                    </label>
                    {field.options ? (
                      <select
                        id={`filter-${field.name}`}
                        name={field.name}
                        defaultValue={searchParams.get(field.name) ?? ''}
                        className="text_form_field"
                      >
                        <option value="">Todos</option>
                        {field.options.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={`filter-${field.name}`}
                        name={field.name}
                        type={field.type ?? 'text'}
                        defaultValue={searchParams.get(field.name) ?? ''}
                        placeholder={field.placeholder}
                        className="text_form_field"
                        autoComplete="off"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 border-t border-slate-200 px-5 py-4 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => { update({}); setOpen(false); }}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                >
                  Limpiar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 cursor-pointer"
                >
                  Aplicar filtros
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
