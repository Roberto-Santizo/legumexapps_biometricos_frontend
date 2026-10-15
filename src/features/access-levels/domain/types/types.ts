import { AccessLevelSchema, DoorSchema, LevelDoorSchema } from "@/features/access-levels/access-levels";
import type { z } from "zod";

export type AccessLevel = z.infer<typeof AccessLevelSchema>;

export type AccessLevelForm = Pick<AccessLevel, 'name'>;

export type UpdateAccessLevelForm = Partial<AccessLevelForm>;

export type AccessLevelsFilters = {
    name?: string;
}

export type Door = z.infer<typeof DoorSchema>;

export type LevelDoor = z.infer<typeof LevelDoorSchema>;

export type AssignDoorFormValues = {
    door_id: string;
}

export type AssignDoorPayload = AssignDoorFormValues & {
    level_id: string;
}
