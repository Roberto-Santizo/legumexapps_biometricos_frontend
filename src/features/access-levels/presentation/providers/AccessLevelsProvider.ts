import type { PaginatedResponse } from "@/features/shared/shared";
import type { AccessLevel, AccessLevelForm, AccessLevelsFilters, AccessLevelsRepository, AssignDoorPayload, Door, LevelDoor, UpdateAccessLevelForm } from "@/features/access-levels/access-levels";

export class AccessLevelsProvider {
    constructor(private repository: AccessLevelsRepository) { }

    createAccessLevel(payload: AccessLevelForm): Promise<string> {
        return this.repository.createAccessLevel(payload);
    }

    getAccessLevels(page: number, limit: number, filters: AccessLevelsFilters = {}): Promise<PaginatedResponse<AccessLevel>> {
        return this.repository.getAccessLevels(page, limit, filters);
    }

    getAccessLevelById(id: string): Promise<AccessLevel> {
        return this.repository.getAccessLevelById(id);
    }

    updateAccessLevelById(payload: UpdateAccessLevelForm, id: string): Promise<string> {
        return this.repository.updateAccessLevelById(payload, id);
    }

    getDoors(): Promise<Door[]> {
        return this.repository.getDoors();
    }

    getLevelDoors(id: string): Promise<LevelDoor[]> {
        return this.repository.getLevelDoors(id);
    }

    assignDoorToLevel(payload: AssignDoorPayload): Promise<string> {
        return this.repository.assignDoorToLevel(payload);
    }

    removeDoorFromLevel(id: string): Promise<string> {
        return this.repository.removeDoorFromLevel(id);
    }
}
