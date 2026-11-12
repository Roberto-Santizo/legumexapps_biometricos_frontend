import type { BufferResponse, PaginatedResponse } from "@/features/shared/shared";
import { EmployeeDiscountsDatasource, EmployeeDiscountsRepository, type DiscountsReportPayload, type EmployeeDiscount, type EmployeeDiscountPayload, type EmployeeDiscountsFilters } from '@/features/employee-discounts/employee-discounts';

export class EmployeeDiscountsRepositoryImpl implements EmployeeDiscountsRepository {
    constructor(private datasource: EmployeeDiscountsDatasource) { }

    createDiscount(payload: EmployeeDiscountPayload): Promise<string> {
        return this.datasource.createDiscount(payload);
    }

    getDiscounts(page: number, limit: number, filters: EmployeeDiscountsFilters): Promise<PaginatedResponse<EmployeeDiscount>> {
        return this.datasource.getDiscounts(page, limit, filters);
    }

    getDiscountById(id: string): Promise<EmployeeDiscount> {
        return this.datasource.getDiscountById(id);
    }

    updateDiscountById(payload: EmployeeDiscountPayload, id: string): Promise<string> {
        return this.datasource.updateDiscountById(payload, id);
    }

    deleteDiscountById(id: string): Promise<string> {
        return this.datasource.deleteDiscountById(id);
    }

    generateDiscountsReport(payload: DiscountsReportPayload): Promise<BufferResponse> {
        return this.datasource.generateDiscountsReport(payload);
    }
}
