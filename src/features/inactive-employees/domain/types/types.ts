import { InactiveEmployeeListItemSchema, InactiveEmployeeSchema } from "@/features/inactive-employees/inactive-employees";
import type { z } from "zod";

export type InactiveEmployeeListItem = z.infer<typeof InactiveEmployeeListItemSchema>;

export type InactiveEmployee = z.infer<typeof InactiveEmployeeSchema>;

export type InactiveEmployeesFilters = {
    name?: string;
}
