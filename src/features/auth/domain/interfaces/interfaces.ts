//LOGIN FORM
export interface LoginForm {
    email: string;
    password: string;
}

//ROLES (reflejo del enum ValidRoles del backend)
export const ValidRoles = {
    admin: 'admin',
    rrhh: 'rrhh',
    fincas: 'fincas',
    user: 'user',
} as const;

export type Role = typeof ValidRoles[keyof typeof ValidRoles];
