import { toInputDate } from "@/features/tasks/tasks";
import type { Planification } from "@/features/planifications/planifications";

const DAY_MS = 24 * 60 * 60 * 1000;

// "YYYY-MM-DD" como fecha local (evita el desfase de zona horaria de new Date("YYYY-MM-DD"))
export const parseInputDate = (value: string) => {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
}

// Semana ISO: la semana 1 es la que contiene el primer jueves del año
export const getIsoWeek = (date = new Date()) => {
    const thursday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    thursday.setDate(thursday.getDate() + 4 - (thursday.getDay() || 7));
    const year = thursday.getFullYear();
    const dayOfYear = Math.round((thursday.getTime() - new Date(year, 0, 1).getTime()) / DAY_MS);
    return { year, week: Math.floor(dayOfYear / 7) + 1 };
}

// El 28 de diciembre siempre cae en la última semana ISO del año (52 o 53)
export const isoWeeksInYear = (year: number) => getIsoWeek(new Date(year, 11, 28)).week;

// Lunes y domingo de la semana ISO, igual que los calcula el backend
export const isoWeekRange = (year: number, week: number) => {
    const jan4 = new Date(year, 0, 4);
    const monday = new Date(year, 0, 4 - ((jan4.getDay() || 7) - 1) + (week - 1) * 7);
    const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
    return { start_date: toInputDate(monday), end_date: toInputDate(sunday) };
}

// Los 7 días ("YYYY-MM-DD") de la semana, de lunes a domingo
export const weekDays = (startDate: string) => {
    const monday = parseInputDate(startDate);
    return Array.from({ length: 7 }, (_, i) => toInputDate(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i)));
}

const shortDate = new Intl.DateTimeFormat('es-GT', { day: 'numeric', month: 'short' });
const longDay = new Intl.DateTimeFormat('es-GT', { weekday: 'long', day: 'numeric', month: 'long' });

export const formatShortDate = (value: string) => shortDate.format(parseInputDate(value));

export const formatLongDay = (value: string) => longDay.format(parseInputDate(value));

export const formatWeekRange = ({ start_date, end_date }: Pick<Planification, 'start_date' | 'end_date'>) =>
    `${formatShortDate(start_date)} – ${formatShortDate(end_date)} ${end_date.slice(0, 4)}`;

export const planificationLabel = (planification: Pick<Planification, 'year' | 'week' | 'start_date' | 'end_date'>) =>
    `Semana ${planification.week} · ${planification.year} (${formatWeekRange(planification)})`;
