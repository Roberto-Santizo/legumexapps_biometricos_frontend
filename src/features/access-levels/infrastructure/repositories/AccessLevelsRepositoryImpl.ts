import type { PaginatedResponse } from "@/features/shared/shared";
import { AccessLevelsDatasource, AccessLevelsRepository, type AccessLevel, type AccessLevelForm, type AccessLevelsFilters, type AssignDoorPayload, type Door, type LevelDoor, type UpdateAccessLevelForm } from '@/features/access-levels/access-levels';

export class AccessLevelsRepositoryImpl implements AccessLevelsRepository {
    constructor(private datasource: AccessLevelsDatasource) { }

    createAccessLevel(payload: AccessLevelForm): Promise<string> {
        return this.datasource.createAccessLevel(payload);
    }

    getAccessLevels(page: number, limit: number, filters: AccessLevelsFilters): Promise<PaginatedResponse<AccessLevel>> {
        return this.datasource.getAccessLevels(page, limit, filters);
    }

    getAccessLevelById(id: string): Promise<AccessLevel> {
        return this.datasource.getAccessLevelById(id);
    }

    updateAccessLevelById(payload: UpdateAccessLevelForm, id: string): Promise<string> {
        return this.datasource.updateAccessLevelById(payload, id);
    }

    getDoors(): Promise<Door[]> {
        return this.datasource.getDoors();
    }

    getLevelDoors(id: string): Promise<LevelDoor[]> {
        return this.datasource.getLevelDoors(id);
    }

    assignDoorToLevel(payload: AssignDoorPayload): Promise<string> {
        return this.datasource.assignDoorToLevel(payload);
    }

    removeDoorFromLevel(id: string): Promise<string> {
        return this.datasource.removeDoorFromLevel(id);
    }
}
