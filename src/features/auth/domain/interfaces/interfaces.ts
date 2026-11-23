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
    merlot: 'merlot',
} as const;

export type Role = typeof ValidRoles[keyof typeof ValidRoles];

//ACCESO POR ROL: fuente única para las rutas y el menú lateral
export const FeatureRoles: Record<'users' | 'general' | 'fincas' | 'transactions' | 'discounts' | 'manageDiscounts', Role[]> = {
    users: [ValidRoles.admin],
    // Dashboard y demás módulos de la sección General
    general: [ValidRoles.admin, ValidRoles.rrhh],
    fincas: [ValidRoles.admin, ValidRoles.rrhh, ValidRoles.fincas],
    transactions: [ValidRoles.admin, ValidRoles.rrhh, ValidRoles.user],
    // Listar, ver y crear descuentos
    discounts: [ValidRoles.admin, ValidRoles.rrhh, ValidRoles.merlot],
    // Editar y eliminar descuentos ya creados
    manageDiscounts: [ValidRoles.admin, ValidRoles.rrhh],
};

//PANTALLA DE INICIO: primera a la que el rol tiene acceso; sin rol reconocido queda en /dashboard
export const getHomePath = (roles: string[]) => {
    const can = (allowed: Role[]) => allowed.some(role => roles.includes(role));

    if (can(FeatureRoles.general)) return '/dashboard';
    if (can(FeatureRoles.fincas)) return '/empleados-fincas';
    if (can(FeatureRoles.transactions)) return '/transacciones-empleados';
    if (can(FeatureRoles.discounts)) return '/descuentos';
    return '/dashboard';
}
