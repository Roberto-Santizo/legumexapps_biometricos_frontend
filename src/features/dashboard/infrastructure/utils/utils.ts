export const formatNumber = (value: number) => value.toLocaleString('es-GT');

// Porcentaje entero de value sobre total; 0 cuando no hay total
export const percentage = (value: number, total: number) => total > 0 ? Math.round((value / total) * 100) : 0;

// Las fechas del dashboard llegan como yyyy-MM-dd en UTC; se fuerza UTC para no correr el día por la zona horaria local
export const formatDay = (value: string, options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' }) => {
    const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('es-GT', { timeZone: 'UTC', ...options });
}
