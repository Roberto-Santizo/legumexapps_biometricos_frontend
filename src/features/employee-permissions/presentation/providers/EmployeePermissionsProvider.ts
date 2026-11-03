import type { PaginatedResponse } from "@/features/shared/shared";
import type { EmployeePermission, EmployeePermissionPayload, EmployeePermissionsFilters, EmployeePermissionsRepository, PermissionSigner, UpdateEmployeePermissionForm } from "@/features/employee-permissions/employee-permissions";

export class EmployeePermissionsProvider {
    constructor(private repository: EmployeePermissionsRepository) { }

    createPermission(payload: EmployeePermissionPayload): Promise<string> {
        return this.repository.createPermission(payload);
    }

    getPermissions(page: number, limit: number, filters: EmployeePermissionsFilters = {}): Promise<PaginatedResponse<EmployeePermission>> {
        return this.repository.getPermissions(page, limit, filters);
    }

    getPermissionById(id: string): Promise<EmployeePermission> {
        return this.repository.getPermissionById(id);
    }

    updatePermissionById(payload: UpdateEmployeePermissionForm, id: string): Promise<string> {
        return this.repository.updatePermissionById(payload, id);
    }

    deletePermissionById(id: string): Promise<string> {
        return this.repository.deletePermissionById(id);
    }

    signPermissionByHr(id: string, signature: File): Promise<string> {
        return this.repository.signPermissionByHr(id, signature);
    }

    getPermissionSignature(id: string, signer: PermissionSigner): Promise<Blob> {
        return this.repository.getPermissionSignature(id, signer);
    }
}
