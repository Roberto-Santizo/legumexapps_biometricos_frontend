import type { BufferResponse, PaginatedResponse } from "@/features/shared/shared";
import type { DiscountsReportPayload, EmployeeDiscount, EmployeeDiscountPayload, EmployeeDiscountsFilters } from "@/features/employee-discounts/employee-discounts";

export abstract class EmployeeDiscountsDatasource {
    abstract createDiscount(payload: EmployeeDiscountPayload): Promise<string>;
    abstract getDiscounts(page: number, limit: number, filters: EmployeeDiscountsFilters): Promise<PaginatedResponse<EmployeeDiscount>>;
    abstract getDiscountById(id: string): Promise<EmployeeDiscount>;
    abstract updateDiscountById(payload: EmployeeDiscountPayload, id: string): Promise<string>;
    abstract deleteDiscountById(id: string): Promise<string>;
    abstract generateDiscountsReport(payload: DiscountsReportPayload): Promise<BufferResponse>;
}
