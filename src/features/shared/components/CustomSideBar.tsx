import { NavLink } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Briefcase, Building2, CalendarClock, ChevronRight, Fingerprint, IdCard, Images, KeyRound, LayoutDashboard, LogOut, Network, Tractor, UserX, Users, UsersRound, X } from "lucide-react";
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
  const canSeeGeneral = hasRole(ValidRoles.admin, ValidRoles.rrhh);
  const canSeeFincas = hasRole(ValidRoles.admin, ValidRoles.fincas);
  // Abre la sección Fincas cuando la ruta actual pertenece a un módulo de fincas (listado o detalle)
  const isFincasRoute = /-fincas(\/|$)/.test(window.location.pathname);
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
        {/* El selector solo aparece si el usuario tiene acceso a ambas secciones */}
        {canSeeGeneral && canSeeFincas && (
          <div className="ios-sidebar__seg" role="radiogroup" aria-label="Sección del menú">
            <label className="ios-sidebar__seg-opt">
              <input type="radio" name="sidebar-section" value="general" className="ios-sidebar__seg-input" defaultChecked={!isFincasRoute} />
              <span>General</span>
            </label>
            <label className="ios-sidebar__seg-opt">
              <input type="radio" name="sidebar-section" value="fincas" className="ios-sidebar__seg-input" defaultChecked={isFincasRoute} />
              <span>Fincas</span>
            </label>
          </div>
        )}
        <ul className="ios-sidebar__group ios-sidebar__panel ios-sidebar__panel--general">
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
          {canSeeGeneral && (
            <li className="ios-sidebar__item">
              <NavLink to="/empleados" className="ios-sidebar__row">
                <span className="ios-sidebar__tile ios-sidebar__tile--green"><IdCard aria-hidden="true" /></span>
                <span className="ios-sidebar__label">Empleados</span>
                <ChevronRight className="ios-sidebar__chev" aria-hidden="true" />
              </NavLink>
            </li>
          )}
          {canSeeGeneral && (
            <li className="ios-sidebar__item">
              <NavLink to="/empleados-inactivos" className="ios-sidebar__row">
                <span className="ios-sidebar__tile ios-sidebar__tile--gray"><UserX aria-hidden="true" /></span>
                <span className="ios-sidebar__label">Empleados inactivos</span>
                <ChevronRight className="ios-sidebar__chev" aria-hidden="true" />
              </NavLink>
            </li>
          )}
          {canSeeGeneral && (
            <li className="ios-sidebar__item">
              <NavLink to="/fotos" className="ios-sidebar__row">
                <span className="ios-sidebar__tile ios-sidebar__tile--pink"><Images aria-hidden="true" /></span>
                <span className="ios-sidebar__label">Fotos</span>
                <ChevronRight className="ios-sidebar__chev" aria-hidden="true" />
              </NavLink>
            </li>
          )}
          {canSeeGeneral && (
            <li className="ios-sidebar__item">
              <NavLink to="/transacciones-empleados" className="ios-sidebar__row">
                <span className="ios-sidebar__tile ios-sidebar__tile--blue"><Fingerprint aria-hidden="true" /></span>
                <span className="ios-sidebar__label">Transacciones</span>
                <ChevronRight className="ios-sidebar__chev" aria-hidden="true" />
              </NavLink>
            </li>
          )}
          {canSeeGeneral && (
            <li className="ios-sidebar__item">
              <NavLink to="/tareas" className="ios-sidebar__row">
                <span className="ios-sidebar__tile ios-sidebar__tile--indigo"><CalendarClock aria-hidden="true" /></span>
                <span className="ios-sidebar__label">Tareas</span>
                <ChevronRight className="ios-sidebar__chev" aria-hidden="true" />
              </NavLink>
            </li>
          )}
          {canSeeGeneral && (
            <li className="ios-sidebar__item">
              <NavLink to="/departamentos" className="ios-sidebar__row">
                <span className="ios-sidebar__tile ios-sidebar__tile--orange"><Building2 aria-hidden="true" /></span>
                <span className="ios-sidebar__label">Departamentos</span>
                <ChevronRight className="ios-sidebar__chev" aria-hidden="true" />
              </NavLink>
            </li>
          )}
          {canSeeGeneral && (
            <li className="ios-sidebar__item">
              <NavLink to="/posiciones" className="ios-sidebar__row">
                <span className="ios-sidebar__tile ios-sidebar__tile--indigo"><Briefcase aria-hidden="true" /></span>
                <span className="ios-sidebar__label">Posiciones</span>
                <ChevronRight className="ios-sidebar__chev" aria-hidden="true" />
              </NavLink>
            </li>
          )}
          {canSeeGeneral && (
            <li className="ios-sidebar__item">
              <NavLink to="/niveles-acceso" className="ios-sidebar__row">
                <span className="ios-sidebar__tile ios-sidebar__tile--teal"><KeyRound aria-hidden="true" /></span>
                <span className="ios-sidebar__label">Niveles de acceso</span>
                <ChevronRight className="ios-sidebar__chev" aria-hidden="true" />
              </NavLink>
            </li>
          )}
        </ul>
        {canSeeFincas && (
          <ul className="ios-sidebar__group ios-sidebar__panel ios-sidebar__panel--fincas">
            <li className="ios-sidebar__item">
              <NavLink to="/empleados-fincas" className="ios-sidebar__row">
                <span className="ios-sidebar__tile ios-sidebar__tile--green"><UsersRound aria-hidden="true" /></span>
                <span className="ios-sidebar__label">Empleados</span>
                <ChevronRight className="ios-sidebar__chev" aria-hidden="true" />
              </NavLink>
            </li>
            <li className="ios-sidebar__item">
              <NavLink to="/departamentos-fincas" className="ios-sidebar__row">
                <span className="ios-sidebar__tile ios-sidebar__tile--green"><Tractor aria-hidden="true" /></span>
                <span className="ios-sidebar__label">Departamentos</span>
                <ChevronRight className="ios-sidebar__chev" aria-hidden="true" />
              </NavLink>
            </li>
            <li className="ios-sidebar__item">
              <NavLink to="/posiciones-fincas" className="ios-sidebar__row">
                <span className="ios-sidebar__tile ios-sidebar__tile--green"><Network aria-hidden="true" /></span>
                <span className="ios-sidebar__label">Posiciones</span>
                <ChevronRight className="ios-sidebar__chev" aria-hidden="true" />
              </NavLink>
            </li>
          </ul>
        )}
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
