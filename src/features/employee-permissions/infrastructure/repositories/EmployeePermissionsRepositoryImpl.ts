import type { PaginatedResponse } from "@/features/shared/shared";
import { EmployeePermissionsDatasource, EmployeePermissionsRepository, type EmployeePermission, type EmployeePermissionPayload, type EmployeePermissionsFilters, type PermissionSigner, type UpdateEmployeePermissionForm } from '@/features/employee-permissions/employee-permissions';

export class EmployeePermissionsRepositoryImpl implements EmployeePermissionsRepository {
    constructor(private datasource: EmployeePermissionsDatasource) { }

    createPermission(payload: EmployeePermissionPayload): Promise<string> {
        return this.datasource.createPermission(payload);
    }

    getPermissions(page: number, limit: number, filters: EmployeePermissionsFilters): Promise<PaginatedResponse<EmployeePermission>> {
        return this.datasource.getPermissions(page, limit, filters);
    }

    getPermissionById(id: string): Promise<EmployeePermission> {
        return this.datasource.getPermissionById(id);
    }

    updatePermissionById(payload: UpdateEmployeePermissionForm, id: string): Promise<string> {
        return this.datasource.updatePermissionById(payload, id);
    }

    deletePermissionById(id: string): Promise<string> {
        return this.datasource.deletePermissionById(id);
    }

    signPermissionByHr(id: string, signature: File): Promise<string> {
        return this.datasource.signPermissionByHr(id, signature);
    }

    getPermissionSignature(id: string, signer: PermissionSigner): Promise<Blob> {
        return this.datasource.getPermissionSignature(id, signer);
    }
}
