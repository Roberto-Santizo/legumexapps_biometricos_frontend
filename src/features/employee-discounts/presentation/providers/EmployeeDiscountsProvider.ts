import type { BufferResponse, PaginatedResponse } from "@/features/shared/shared";
import type { DiscountsReportPayload, EmployeeDiscount, EmployeeDiscountPayload, EmployeeDiscountsFilters, EmployeeDiscountsRepository } from "@/features/employee-discounts/employee-discounts";

export class EmployeeDiscountsProvider {
    constructor(private repository: EmployeeDiscountsRepository) { }

    createDiscount(payload: EmployeeDiscountPayload): Promise<string> {
        return this.repository.createDiscount(payload);
    }

    getDiscounts(page: number, limit: number, filters: EmployeeDiscountsFilters = {}): Promise<PaginatedResponse<EmployeeDiscount>> {
        return this.repository.getDiscounts(page, limit, filters);
    }

    getDiscountById(id: string): Promise<EmployeeDiscount> {
        return this.repository.getDiscountById(id);
    }

    updateDiscountById(payload: EmployeeDiscountPayload, id: string): Promise<string> {
        return this.repository.updateDiscountById(payload, id);
    }

    deleteDiscountById(id: string): Promise<string> {
        return this.repository.deleteDiscountById(id);
    }

    generateDiscountsReport(payload: DiscountsReportPayload): Promise<BufferResponse> {
        return this.repository.generateDiscountsReport(payload);
    }
}
