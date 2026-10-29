import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CreateUser, ShowUser, UpdateUser, Users } from "@/features/users/users";
import { CreateDepartment, Departments, ShowDepartment, UpdateDepartment } from "@/features/departments/departments";
import { CreateFincaDepartment, FincaDepartments, ShowFincaDepartment, UpdateFincaDepartment } from "@/features/finca-departments/finca-departments";
import { CreateFincaPosition, FincaPositions, ShowFincaPosition, UpdateFincaPosition } from "@/features/finca-positions/finca-positions";
import { CreateFincaEmployee, FincaEmployees, ShowFincaEmployee, UpdateFincaEmployee } from "@/features/finca-employees/finca-employees";
import { CreatePosition, Positions, ShowPosition, UpdatePosition } from "@/features/positions/positions";
import { AccessLevels, CreateAccessLevel, ShowAccessLevel, UpdateAccessLevel } from "@/features/access-levels/access-levels";
import { CreateEmployee, Employees, ShowEmployee, UpdateEmployee } from "@/features/employees/employees";
import { InactiveEmployees, ShowInactiveEmployee } from "@/features/inactive-employees/inactive-employees";
import { EmployeeTransactions } from "@/features/employee-transactions/employee-transactions";
import { ShowTask, Tasks } from "@/features/tasks/tasks";
import { Photos, UploadPhotos } from "@/features/photos/photos";
import { Dashboard } from "@/features/dashboard/dashboard";
import { Login, ValidRoles } from "@/features/auth/auth";
import { NotFound, ProtectedLayout, PublicLayout, RoleGuard } from "@/features/shared/shared";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicLayout />}>
                    <Route path="*" element={<NotFound />} />
                </Route>

                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Navigate to={'/login'} replace />} />
                    <Route path="/login" element={<Login />} />
                </Route>

                <Route element={<ProtectedLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>

                <Route element={<ProtectedLayout />}>
                    <Route element={<RoleGuard allowed={[ValidRoles.admin]} />}>
                        <Route path="/usuarios" element={<Users />} />
                        <Route path="/usuarios/crear" element={<CreateUser />} />
                        <Route path="/usuarios/:id" element={<ShowUser />} />
                        <Route path="/usuarios/:id/editar" element={<UpdateUser />} />
                    </Route>
                </Route>

                <Route element={<ProtectedLayout />}>
                    <Route element={<RoleGuard allowed={[ValidRoles.admin, ValidRoles.rrhh]} />}>
                        <Route path="/departamentos" element={<Departments />} />
                        <Route path="/departamentos/crear" element={<CreateDepartment />} />
                        <Route path="/departamentos/:id" element={<ShowDepartment />} />
                        <Route path="/departamentos/:id/editar" element={<UpdateDepartment />} />
                    </Route>
                </Route>

                <Route element={<ProtectedLayout />}>
                    <Route element={<RoleGuard allowed={[ValidRoles.admin, ValidRoles.rrhh]} />}>
                        <Route path="/posiciones" element={<Positions />} />
                        <Route path="/posiciones/crear" element={<CreatePosition />} />
                        <Route path="/posiciones/:id" element={<ShowPosition />} />
                        <Route path="/posiciones/:id/editar" element={<UpdatePosition />} />
                    </Route>
                </Route>

                <Route element={<ProtectedLayout />}>
                    <Route element={<RoleGuard allowed={[ValidRoles.admin, ValidRoles.fincas]} />}>
                        <Route path="/departamentos-fincas" element={<FincaDepartments />} />
                        <Route path="/departamentos-fincas/crear" element={<CreateFincaDepartment />} />
                        <Route path="/departamentos-fincas/:id" element={<ShowFincaDepartment />} />
                        <Route path="/departamentos-fincas/:id/editar" element={<UpdateFincaDepartment />} />
                    </Route>
                </Route>

                <Route element={<ProtectedLayout />}>
                    <Route element={<RoleGuard allowed={[ValidRoles.admin, ValidRoles.fincas]} />}>
                        <Route path="/posiciones-fincas" element={<FincaPositions />} />
                        <Route path="/posiciones-fincas/crear" element={<CreateFincaPosition />} />
                        <Route path="/posiciones-fincas/:id" element={<ShowFincaPosition />} />
                        <Route path="/posiciones-fincas/:id/editar" element={<UpdateFincaPosition />} />
                    </Route>
                </Route>

                <Route element={<ProtectedLayout />}>
                    <Route element={<RoleGuard allowed={[ValidRoles.admin, ValidRoles.fincas]} />}>
                        <Route path="/empleados-fincas" element={<FincaEmployees />} />
                        <Route path="/empleados-fincas/crear" element={<CreateFincaEmployee />} />
                        <Route path="/empleados-fincas/:id" element={<ShowFincaEmployee />} />
                        <Route path="/empleados-fincas/:id/editar" element={<UpdateFincaEmployee />} />
                    </Route>
                </Route>

                <Route element={<ProtectedLayout />}>
                    <Route element={<RoleGuard allowed={[ValidRoles.admin, ValidRoles.rrhh]} />}>
                        <Route path="/niveles-acceso" element={<AccessLevels />} />
                        <Route path="/niveles-acceso/crear" element={<CreateAccessLevel />} />
                        <Route path="/niveles-acceso/:id" element={<ShowAccessLevel />} />
                        <Route path="/niveles-acceso/:id/editar" element={<UpdateAccessLevel />} />
                    </Route>
                </Route>

                <Route element={<ProtectedLayout />}>
                    <Route element={<RoleGuard allowed={[ValidRoles.admin, ValidRoles.rrhh]} />}>
                        <Route path="/empleados" element={<Employees />} />
                        <Route path="/empleados/crear" element={<CreateEmployee />} />
                        <Route path="/empleados/:id" element={<ShowEmployee />} />
                        <Route path="/empleados/:id/editar" element={<UpdateEmployee />} />
                    </Route>
                </Route>

                <Route element={<ProtectedLayout />}>
                    <Route element={<RoleGuard allowed={[ValidRoles.admin, ValidRoles.rrhh]} />}>
                        <Route path="/empleados-inactivos" element={<InactiveEmployees />} />
                        <Route path="/empleados-inactivos/:id" element={<ShowInactiveEmployee />} />
                    </Route>
                </Route>

                <Route element={<ProtectedLayout />}>
                    <Route element={<RoleGuard allowed={[ValidRoles.admin, ValidRoles.rrhh]} />}>
                        <Route path="/transacciones-empleados" element={<EmployeeTransactions />} />
                    </Route>
                </Route>

                <Route element={<ProtectedLayout />}>
                    <Route element={<RoleGuard allowed={[ValidRoles.admin, ValidRoles.rrhh]} />}>
                        <Route path="/tareas" element={<Tasks />} />
                        <Route path="/tareas/:id" element={<ShowTask />} />
                    </Route>
                </Route>

                <Route element={<ProtectedLayout />}>
                    <Route element={<RoleGuard allowed={[ValidRoles.admin, ValidRoles.rrhh]} />}>
                        <Route path="/fotos" element={<Photos />} />
                        <Route path="/fotos/cargar" element={<UploadPhotos />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
