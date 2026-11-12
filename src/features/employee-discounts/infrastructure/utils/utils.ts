import type { EmployeeDiscount, EmployeeDiscountForm, EmployeeDiscountPayload } from "@/features/employee-discounts/employee-discounts";

// El backend rechaza montos menores a 0.1
export const MIN_DISCOUNT_AMOUNT = 0.1;

const currency = new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ', minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Q1,234.50
export const formatDiscountAmount = (amount: number) => currency.format(amount);

// Separa símbolo y cifra para poder destacar el monto
export const discountAmountParts = (amount: number) => {
    const parts = currency.formatToParts(amount);
    const symbol = parts.filter(part => part.type === 'currency').map(part => part.value).join('');
    const value = parts.filter(part => part.type !== 'currency' && part.type !== 'literal').map(part => part.value).join('');
    return { symbol, value };
}

// date llega como "YYYY-MM-DD" (o ISO); se formatea sin pasar por Date para no correr el día por zona horaria
export const formatDiscountDate = (value: string) => {
    const [year, month, day] = value.slice(0, 10).split('-');
    return `${day}/${month}/${year}`;
}

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// "12 de noviembre de 2026"
export const formatDiscountLongDate = (value: string) => {
    const [year, month, day] = value.slice(0, 10).split('-');
    return `${Number(day)} de ${MONTHS[Number(month) - 1]} de ${year}`;
}

// El input numérico devuelve texto; se convierte y redondea a centavos
export const parseDiscountAmount = (value: string) => {
    const amount = Number(value);
    return Number.isFinite(amount) ? Math.round(amount * 100) / 100 : NaN;
}

export const toDiscountPayload = (form: EmployeeDiscountForm): EmployeeDiscountPayload => ({
    code: form.code.trim(),
    amount: parseDiscountAmount(form.amount),
    date: form.date
});

export const toDiscountForm = (discount: EmployeeDiscount): EmployeeDiscountForm => ({
    code: discount.code,
    amount: discount.amount.toFixed(2),
    date: discount.date.slice(0, 10)
});

export const emptyDiscountForm: EmployeeDiscountForm = {
    code: '',
    amount: '',
    date: ''
};
