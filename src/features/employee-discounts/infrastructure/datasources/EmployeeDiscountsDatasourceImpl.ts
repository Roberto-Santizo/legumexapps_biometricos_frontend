import { BufferResponseSchema, getApiErrorMessage, setQueryParams, type BufferResponse, type PaginatedResponse } from '@/features/shared/shared';
import { type AxiosInstance } from 'axios';
import { EmployeeDiscountSchema, EmployeeDiscountsDatasource, EmployeeDiscountsSchema, formatDiscountAmount, type DiscountsReportPayload, type EmployeeDiscount, type EmployeeDiscountPayload, type EmployeeDiscountsFilters } from '@/features/employee-discounts/employee-discounts';

// DELETE /discounts/:id responde el mensaje de confirmación en texto plano
const toMessage = (data: unknown, fallback: string) => typeof data === 'string' && data ? data : fallback;

export class EmployeeDiscountsDatasourceImpl implements EmployeeDiscountsDatasource {
    constructor(private api: AxiosInstance) { }

    // POST /discounts responde 404 si el código no corresponde a un empleado de ZKBioAccess
    async createDiscount(payload: EmployeeDiscountPayload): Promise<string> {
        try {
            const { data } = await this.api.post('/discounts', payload);
            const response = EmployeeDiscountSchema.safeParse(data);

            if (response.success) {
                return `Descuento de ${formatDiscountAmount(response.data.amount)} registrado correctamente`;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getDiscounts(page: number, limit: number, filters: EmployeeDiscountsFilters): Promise<PaginatedResponse<EmployeeDiscount>> {
        try {
            const params = setQueryParams({ limit, offset: page * limit, ...filters });
            const { data } = await this.api.get(`/discounts?${params.toString()}`);
            const response = EmployeeDiscountsSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async getDiscountById(id: string): Promise<EmployeeDiscount> {
        try {
            const { data } = await this.api.get(`/discounts/${id}`);
            const response = EmployeeDiscountSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async updateDiscountById(payload: EmployeeDiscountPayload, id: string): Promise<string> {
        try {
            const { data } = await this.api.patch(`/discounts/${id}`, payload);
            const response = EmployeeDiscountSchema.safeParse(data);

            if (response.success) {
                return `Descuento actualizado a ${formatDiscountAmount(response.data.amount)}`;
            }

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    async deleteDiscountById(id: string): Promise<string> {
        try {
            const { data } = await this.api.delete(`/discounts/${id}`);
            return toMessage(data, 'Descuento eliminado correctamente');
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }

    // POST /discounts/report devuelve el Excel como Buffer serializado en JSON
    async generateDiscountsReport(payload: DiscountsReportPayload): Promise<BufferResponse> {
        try {
            const { data } = await this.api.post('/discounts/report', payload);
            const response = BufferResponseSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Archivo no válido");
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Error no controlado"), { cause: error });
        }
    }
}
