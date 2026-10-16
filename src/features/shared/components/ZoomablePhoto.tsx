import { Maximize2, User, X } from "lucide-react";
import { useId, useState } from "react";

interface ZoomablePhotoProps {
    src?: string | null;
    alt: string;
    /** Texto bajo la foto ampliada; por defecto usa `alt`. */
    caption?: string;
    /** Tamaño y forma del marco de la miniatura. */
    className?: string;
    /** Contenido cuando no hay foto o no carga. */
    fallback?: React.ReactNode;
}

export function ZoomablePhoto({
    src,
    alt,
    caption = alt,
    className = "h-24 w-24 rounded-2xl sm:h-28 sm:w-28",
    fallback = <User className="h-10 w-10 text-slate-400 dark:text-gray-500" aria-label="Sin fotografía" />,
}: ZoomablePhotoProps) {
    const [failed, setFailed] = useState(false);
    const viewerId = useId();
    const showPhoto = src && !failed;

    return (
        <div className={`flex flex-none items-center justify-center overflow-hidden border border-slate-200 bg-slate-100 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
            {showPhoto ? (
                <>
                    <button type="button" popoverTarget={viewerId} aria-label={`Ampliar ${alt.toLowerCase()}`} className="group relative block h-full w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500">
                        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
                        <span aria-hidden="true" className="absolute right-1.5 bottom-1.5 grid h-7 w-7 place-items-center rounded-lg bg-white/90 text-slate-700 shadow-sm ring-1 ring-slate-900/5 transition duration-200 group-hover:scale-110 group-hover:bg-white dark:bg-gray-900/90 dark:text-gray-200 dark:ring-white/10">
                            <Maximize2 className="h-3.5 w-3.5" strokeWidth={2.25} />
                        </span>
                    </button>
                    <div id={viewerId} popover="auto" role="dialog" aria-label={alt} className="photo-viewer m-auto overflow-visible border-0 bg-transparent p-0">
                        <figure className="relative flex flex-col items-center gap-3">
                            <img src={src} alt={alt} className="max-h-[80vh] max-w-[92vw] rounded-2xl object-contain shadow-[0_25px_50px_-12px_rgb(0_0_0/0.5)]" />
                            <figcaption className="text-sm font-medium text-gray-100">{caption}</figcaption>
                            <button type="button" popoverTarget={viewerId} popoverTargetAction="hide" aria-label="Cerrar" className="absolute -top-3 -right-3 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white text-slate-700 shadow-md transition hover:scale-105 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 dark:bg-gray-800 dark:text-gray-200 dark:hover:text-white">
                                <X className="h-[18px] w-[18px]" />
                            </button>
                        </figure>
                    </div>
                </>
            ) : fallback}
        </div>
    );
}
