import type { Option } from "@/features/shared/shared";
import { ValidRoles } from "@/features/auth/auth";

const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    rrhh: 'Recursos Humanos',
    user: 'Usuario',
};

export const roleOptions = (): Option[] => {
    return Object.values(ValidRoles).map(role => ({
        value: role,
        label: roleLabels[role]
    }));
}

export const roleLabel = (role: string) => roleLabels[role] ?? role;
