import { EmployeeDiscountSchema } from "@/features/employee-discounts/employee-discounts";
import type { z } from "zod";

export type EmployeeDiscount = z.infer<typeof EmployeeDiscountSchema>;

// Valores del formulario; el input numérico se maneja como texto y se convierte al enviar
export type EmployeeDiscountForm = {
    code: string;
    amount: string;
    date: string;
}

// Body JSON de POST /discounts y PATCH /discounts/:id; al backend solo viaja el PIN del empleado
export type EmployeeDiscountPayload = {
    code: string;
    amount: number;
    date: string;
}

export type EmployeeDiscountsFilters = {
    // Búsqueda parcial por PIN
    code?: string;
    // 'YYYY-MM-DD', rango 'desde,hasta' o fecha ISO
    date?: string;
}

// Body de POST /discounts/report; el rango no puede superar una semana
export type DiscountsReportPayload = {
    start_date: string;
    end_date: string;
}
