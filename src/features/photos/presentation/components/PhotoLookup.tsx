import { parsePhotoKeys } from "@/features/photos/photos";
import { Search } from "lucide-react";
import { useId, useState } from "react";

type Props = {
  onLookup: (keys: string[]) => void;
}

// No existe un listado de fotos: se consultan por clave (PIN), una o varias a la vez
export function PhotoLookup({ onLookup }: Props) {
  const inputId = useId();
  const [value, setValue] = useState('');
  const keys = parsePhotoKeys(value);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (keys.length === 0) return;
    onLookup(keys);
    setValue('');
  };

  return (
    <form role="search" onSubmit={handleSubmit} className="flex w-full items-stretch gap-2 sm:max-w-md">
      <label htmlFor={inputId} className="sr-only">Consultar fotos por PIN</label>
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-gray-500" aria-hidden="true" />
        <input
          id={inputId}
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="PIN, p. ej. 10045 o 10045, 10046"
          className="input-filter font-mono tracking-wide sm:w-full placeholder:font-sans placeholder:tracking-normal"
        />
      </div>
      <button
        type="submit"
        disabled={keys.length === 0}
        className="filter-trigger flex-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        Consultar{keys.length > 1 && <span className="filter-trigger__count">{keys.length}</span>}
      </button>
    </form>
  )
}
