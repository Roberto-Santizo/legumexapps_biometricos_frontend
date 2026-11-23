import { Navigate, Outlet } from "react-router-dom";
import { useRoles } from "@/features/shared/shared";
import { getHomePath, type Role } from "@/features/auth/auth";

type Props = {
    allowed: Role[];
}

// Restringe las rutas hijas a los roles indicados; si no cumple, regresa a la pantalla de inicio de su rol
export function RoleGuard({ allowed }: Props) {
    const { roles, hasRole } = useRoles();

    if (!hasRole(...allowed)) {
        return <Navigate to={getHomePath(roles)} replace />
    }

    return <Outlet />;
}
