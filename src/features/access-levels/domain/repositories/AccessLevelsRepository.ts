import type { AccessLevel, AccessLevelForm, AccessLevelsFilters, AssignDoorPayload, Door, LevelDoor, UpdateAccessLevelForm } from "@/features/access-levels/access-levels";

export abstract class AccessLevelsRepository {
    abstract createAccessLevel(payload: AccessLevelForm): Promise<string>;
    abstract getAccessLevels(page: number, limit: number, filters: AccessLevelsFilters): Promise<AccessLevel[]>;
    abstract getAccessLevelById(id: string): Promise<AccessLevel>;
    abstract updateAccessLevelById(payload: UpdateAccessLevelForm, id: string): Promise<string>;
    abstract getDoors(): Promise<Door[]>;
    abstract getLevelDoors(id: string): Promise<LevelDoor[]>;
    abstract assignDoorToLevel(payload: AssignDoorPayload): Promise<string>;
    abstract removeDoorFromLevel(id: string): Promise<string>;
}
