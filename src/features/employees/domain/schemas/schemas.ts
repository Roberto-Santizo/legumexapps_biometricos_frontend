import { z } from "zod";
import { DepartmentSchema } from "@/features/departments/departments";

// GET /employees devuelve una vista resumida con el departamento ya resuelto por nombre
export const EmployeeListItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    last_name: z.string().nullish(),
    pin: z.coerce.string(),
    createdBy: z.string().nullish(),
    updatedBy: z.string().nullish(),
    department: z.string().nullish(),
    hasPhoto: z.boolean(),
    // Cadena vacía cuando el empleado no tiene fotografía
    photoUrl: z.string()
});

export const EmployeeListSchema = z.array(EmployeeListItemSchema);

// Las banderas de ZKBioAccess son columnas bit/smallint en MSSQL: llegan como boolean o number
const ZkFlagSchema = z.union([z.number(), z.boolean()]).transform(Number).nullish();

// Los campos de auditoría y de ZKBioAccess pueden venir nulos desde la base de datos
export const EmployeeSchema = z.object({
    id: z.string(),
    name: z.string(),
    last_name: z.string().nullish(),
    pin: z.coerce.string(),
    auth_dept_id: z.string().nullish(),
    enabled_credential: ZkFlagSchema,
    exception_flag: ZkFlagSchema,
    app_authorization: ZkFlagSchema,
    status: ZkFlagSchema,
    person_type: ZkFlagSchema,
    photo_path: z.string().nullish(),
    hasPhoto: z.boolean().nullish(),
    photoUrl: z.string().nullish(),
    creater_name: z.string().nullish(),
    creater_code: z.string().nullish(),
    updater_name: z.string().nullish(),
    updater_code: z.string().nullish(),
    create_time: z.string().nullish(),
    update_time: z.string().nullish(),
    authDepartment: DepartmentSchema.nullish()
});

// `id` es el ID de la asignación nivel-empleado
export const EmployeeLevelSchema = z.object({
    id: z.string(),
    pers_person_id: z.string(),
    level_id: z.string(),
    level_name: z.string()
});

export const EmployeeLevelsSchema = z.array(EmployeeLevelSchema);
