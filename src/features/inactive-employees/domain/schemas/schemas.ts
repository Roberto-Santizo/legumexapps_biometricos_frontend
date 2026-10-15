import { z } from "zod";

// GET /inactive-employees devuelve los empleados dados de baja con el departamento ya resuelto por nombre
export const InactiveEmployeeListItemSchema = z.object({
    id: z.string(),
    pin: z.coerce.string(),
    name: z.string(),
    last_name: z.string().nullish(),
    leave_date: z.string().nullish(),
    department: z.string().nullish()
});

export const InactiveEmployeeListSchema = z.array(InactiveEmployeeListItemSchema);

// El detalle agrega los campos de auditoría, que pueden venir nulos desde la base de datos
export const InactiveEmployeeSchema = InactiveEmployeeListItemSchema.extend({
    creater_code: z.string().nullish(),
    creater_name: z.string().nullish(),
    updater_code: z.string().nullish(),
    updater_name: z.string().nullish()
});
