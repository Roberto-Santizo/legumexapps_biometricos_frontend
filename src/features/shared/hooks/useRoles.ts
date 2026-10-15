import { useSelector } from 'react-redux';
import type { RootState } from '@/config/config';
import type { Role } from '@/features/auth/auth';

export function useRoles() {
    const user = useSelector((state: RootState) => state.auth.user)!;
    const roles = user.roles;

    // true si el usuario tiene al menos uno de los roles indicados
    const hasRole = (...allowed: Role[]) => allowed.some(role => roles.includes(role));

    return { roles, hasRole };
}
