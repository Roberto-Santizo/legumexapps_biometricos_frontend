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
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        {value && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            <CircleCheck className="h-3.5 w-3.5" /> Firmado
          </span>
        )}
      </div>

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
        className={`aspect-[3/1] w-full touch-none rounded-xl border-2 border-dashed bg-white ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-crosshair'} ${errorMessage ? 'border-red-400' : 'border-slate-300 dark:border-gray-600'}`}
      />

      <div className="flex items-center justify-between gap-2">
        <p className="text-red-400 text-xs">{errorMessage}</p>
        <button
          type="button"
          onClick={() => onChange(null)}
          disabled={disabled || !value}
          className="inline-flex flex-none items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer dark:text-gray-400 dark:hover:text-gray-100"
        >
          <Eraser className="h-3.5 w-3.5" /> Limpiar
        </button>
      </div>
    </div>
  )
}
