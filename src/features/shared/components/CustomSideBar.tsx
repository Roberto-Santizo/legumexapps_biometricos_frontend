import { NavLink } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Building2, ChevronRight, IdCard, KeyRound, LayoutDashboard, LogOut, Users, X } from "lucide-react";
import { logout, ValidRoles } from "@/features/auth/auth";
import { useDispatch, useSelector } from "react-redux";
import { useRoles } from "@/features/shared/shared";
import type { AppDispatch, RootState } from "@/config/config";

type Props = {
  open: boolean;
  onClose: () => void;
}

export function CustomSideBar({ open, onClose }: Props) {
  const { hasRole } = useRoles();
  const user = useSelector((state: RootState) => state.auth.user)!;
  const dispatch = useDispatch<AppDispatch>();

  const onLogout = () => {
    dispatch(logout());
  }

  return (
    <aside
      className={`ios-sidebar fixed inset-y-0 left-0 z-40 flex h-full w-72 max-w-[85vw] flex-col transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:h-screen lg:max-w-none lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      <div className="ios-sidebar__header">
        <img
          src="https://legumexappsapi-storage.s3.us-east-1.amazonaws.com/resources/LOGO_LX_V2.png"
          alt="Logo"
          className="ios-sidebar__logo"
        />

        <div className="ios-sidebar__titles">
          <h1 className="ios-sidebar__title">Biométricos</h1>
          <p className="ios-sidebar__subtitle">Plataforma Biométricos</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar menú"
          className="ios-sidebar__close lg:hidden"
        >
          <X aria-hidden="true" />
        </button>
      </div>

      <nav className="ios-sidebar__nav">
        <ul className="ios-sidebar__group">
          <li className="ios-sidebar__item">
            <NavLink to="/dashboard" className="ios-sidebar__row">
              <span className="ios-sidebar__tile ios-sidebar__tile--blue"><LayoutDashboard aria-hidden="true" /></span>
              <span className="ios-sidebar__label">Dashboard</span>
              <ChevronRight className="ios-sidebar__chev" aria-hidden="true" />
            </NavLink>
          </li>
          {hasRole(ValidRoles.admin) && (
            <li className="ios-sidebar__item">
              <NavLink to="/usuarios" className="ios-sidebar__row">
                <span className="ios-sidebar__tile ios-sidebar__tile--indigo"><Users aria-hidden="true" /></span>
                <span className="ios-sidebar__label">Usuarios</span>
                <ChevronRight className="ios-sidebar__chev" aria-hidden="true" />
              </NavLink>
            </li>
          )}
          {hasRole(ValidRoles.admin, ValidRoles.rrhh) && (
            <li className="ios-sidebar__item">
              <NavLink to="/empleados" className="ios-sidebar__row">
                <span className="ios-sidebar__tile ios-sidebar__tile--green"><IdCard aria-hidden="true" /></span>
                <span className="ios-sidebar__label">Empleados</span>
                <ChevronRight className="ios-sidebar__chev" aria-hidden="true" />
              </NavLink>
            </li>
          )}
          {hasRole(ValidRoles.admin, ValidRoles.rrhh) && (
            <li className="ios-sidebar__item">
              <NavLink to="/departamentos" className="ios-sidebar__row">
                <span className="ios-sidebar__tile ios-sidebar__tile--orange"><Building2 aria-hidden="true" /></span>
                <span className="ios-sidebar__label">Departamentos</span>
                <ChevronRight className="ios-sidebar__chev" aria-hidden="true" />
              </NavLink>
            </li>
          )}
          {hasRole(ValidRoles.admin, ValidRoles.rrhh) && (
            <li className="ios-sidebar__item">
              <NavLink to="/niveles-acceso" className="ios-sidebar__row">
                <span className="ios-sidebar__tile ios-sidebar__tile--teal"><KeyRound aria-hidden="true" /></span>
                <span className="ios-sidebar__label">Niveles de acceso</span>
                <ChevronRight className="ios-sidebar__chev" aria-hidden="true" />
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      <div className="ios-sidebar__footer">
        <ul className="ios-sidebar__group">
          <li className="ios-sidebar__item">
            <div className="ios-sidebar__user">
              <div className="ios-sidebar__avatar" aria-hidden="true">
                {user.name[0]}
              </div>

              <div className="ios-sidebar__user-text">
                <p className="ios-sidebar__user-name">{user.name}</p>
                <p className="ios-sidebar__user-roles">{user.roles.join(', ')}</p>
              </div>

              <ThemeToggle className="ios-sidebar__icon-btn" />
            </div>
          </li>
          <li className="ios-sidebar__item">
            <button
              type="button"
              onClick={() => onLogout()}
              className="ios-sidebar__row ios-sidebar__row--destructive"
            >
              <span className="ios-sidebar__tile ios-sidebar__tile--red"><LogOut aria-hidden="true" /></span>
              <span className="ios-sidebar__label">Cerrar sesión</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}
