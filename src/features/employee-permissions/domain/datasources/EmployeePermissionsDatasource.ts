import type { PaginatedResponse } from "@/features/shared/shared";
import type { EmployeePermission, EmployeePermissionPayload, EmployeePermissionsFilters, PermissionSigner, UpdateEmployeePermissionForm } from "@/features/employee-permissions/employee-permissions";

export abstract class EmployeePermissionsDatasource {
    abstract createPermission(payload: EmployeePermissionPayload): Promise<string>;
    abstract getPermissions(page: number, limit: number, filters: EmployeePermissionsFilters): Promise<PaginatedResponse<EmployeePermission>>;
    abstract getPermissionById(id: string): Promise<EmployeePermission>;
    abstract updatePermissionById(payload: UpdateEmployeePermissionForm, id: string): Promise<string>;
    abstract deletePermissionById(id: string): Promise<string>;
    abstract signPermissionByHr(id: string, signature: File): Promise<string>;
    abstract getPermissionSignature(id: string, signer: PermissionSigner): Promise<Blob>;
}
