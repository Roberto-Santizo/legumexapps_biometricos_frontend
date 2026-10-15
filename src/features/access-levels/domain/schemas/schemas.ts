import { z } from "zod";

// Los campos de auditoría pueden venir nulos desde la base de datos
export const AccessLevelSchema = z.object({
    id: z.string(),
    name: z.string(),
    timeseg_id: z.string().nullish(),
    creater_name: z.string().nullish(),
    creater_code: z.string().nullish(),
    updater_name: z.string().nullish(),
    updater_code: z.string().nullish(),
    create_time: z.string().nullish(),
    update_time: z.string().nullish()
});

export const AccessLevelsSchema = z.array(AccessLevelSchema);

export const DoorSchema = z.object({
    id: z.string(),
    dev_id: z.string(),
    dev_alias: z.string()
});

export const DoorsSchema = z.array(DoorSchema);

// `id` es el ID de la asignación puerta-nivel (se usa para quitarla)
export const LevelDoorSchema = DoorSchema.extend({
    name: z.string()
});

export const LevelDoorsSchema = z.array(LevelDoorSchema);

export const AssignedDoorSchema = z.object({
    id: z.string(),
    door_id: z.string(),
    level_id: z.string()
});
