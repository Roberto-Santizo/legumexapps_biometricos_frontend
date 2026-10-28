import { Navigate, Outlet } from "react-router-dom";
import { useRoles } from "@/features/shared/shared";
import type { Role } from "@/features/auth/auth";

type Props = {
    allowed: Role[];
}

// Restringe las rutas hijas a los roles indicados; si no cumple, regresa al dashboard
export function RoleGuard({ allowed }: Props) {
    const { hasRole } = useRoles();

    if (!hasRole(...allowed)) {
        return <Navigate to={'/dashboard'} replace />
    }

    return <Outlet />;
}
