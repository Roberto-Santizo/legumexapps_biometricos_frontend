import { useEffect, useRef } from "react";
import { CircleCheck, Eraser } from "lucide-react";

// Resolución interna del lienzo; el CSS lo escala al ancho disponible manteniendo la proporción 3:1
const WIDTH = 600;
const HEIGHT = 200;

type Point = { x: number; y: number };

type Props = {
  id: string;
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  onBlur?: () => void;
  errorMessage?: string;
  disabled?: boolean;
}

// Captura la firma con mouse, lápiz o dedo y la entrega como PNG (formato que exige el backend)
export function SignaturePad({ id, label, value, onChange, onBlur, errorMessage, disabled = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPoint = useRef<Point | null>(null);

  // Fondo blanco para que el PNG no quede transparente; también limpia el lienzo al quitar la firma (o con reset)
  useEffect(() => {
    if (value) return;
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, WIDTH, HEIGHT);
  }, [value]);

  const toPoint = (event: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * WIDTH / rect.width,
      y: (event.clientY - rect.top) * HEIGHT / rect.height
    };
  }

  const drawLine = (from: Point, to: Point) => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    context.strokeStyle = '#0f172a';
    context.lineWidth = 3;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = toPoint(event);
    lastPoint.current = point;
    drawLine(point, point);
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!lastPoint.current) return;
    const point = toPoint(event);
    drawLine(lastPoint.current, point);
    lastPoint.current = point;
  }

  // Cada trazo terminado actualiza el archivo con el contenido completo del lienzo
  const handlePointerUp = () => {
    if (!lastPoint.current) return;
    lastPoint.current = null;
    canvasRef.current?.toBlob(blob => {
      if (blob) onChange(new File([blob], `${id}.png`, { type: 'image/png' }));
    }, 'image/png');
    onBlur?.();
  }

  return (
    <div
      className={`flex flex-col gap-1.5 rounded-2xl p-1.5 transition-colors duration-200 ease-out motion-reduce:transition-none ${disabled ? 'opacity-60' : ''} ${errorMessage ? 'bg-red-50 dark:bg-red-500/15' : value ? 'bg-emerald-50 dark:bg-emerald-500/15' : 'bg-slate-100 dark:bg-gray-800'}`}
    >
      <div className="flex items-center justify-between gap-2 px-1.5 pt-0.5">
        <label htmlFor={id} className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        {value && (
          <span className="inline-flex flex-none items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            <CircleCheck className="h-3.5 w-3.5" /> Firmado
          </span>
        )}
      </div>
      <div className="relative overflow-hidden rounded-xl bg-white">
        <canvas
          id={id}
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          role="img"
          aria-label={`Área de firma: ${label}`}
          aria-invalid={!!errorMessage}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`block aspect-[3/1] w-full touch-none ${disabled ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
        />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-slate-500 transition-opacity duration-200 ease-out motion-reduce:transition-none ${value ? 'opacity-0' : 'opacity-100'}`}
        >
          Firme aquí
        </span>
        {value && !disabled && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 shadow-sm transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <Eraser className="h-3.5 w-3.5" /> Limpiar
          </button>
        )}
      </div>
      {errorMessage && <p className="px-1.5 pb-0.5 text-xs text-red-700 dark:text-red-300">{errorMessage}</p>}
    </div>
  )
}
