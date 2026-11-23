import type { Option } from "@/features/shared/shared";
import { ValidRoles, type Role } from "@/features/auth/auth";

const roleLabels: Record<Role, string> = {
    admin: 'Administrador',
    rrhh: 'Recursos Humanos',
    fincas: 'Fincas',
    user: 'Usuario',
    merlot: 'Merlot',
};

export const roleOptions = (): Option[] => {
    return Object.values(ValidRoles).map(role => ({
        value: role,
        label: roleLabels[role]
    }));
}

export const roleLabel = (role: string) => roleLabels[role as Role] ?? role;
