import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CreateUser, ShowUser, UpdateUser, Users } from "@/features/users/users";
import { CreateDepartment, Departments, ShowDepartment, UpdateDepartment } from "@/features/departments/departments";
import { AccessLevels, CreateAccessLevel, ShowAccessLevel, UpdateAccessLevel } from "@/features/access-levels/access-levels";
import { CreateEmployee, Employees, ShowEmployee, UpdateEmployee } from "@/features/employees/employees";
import { InactiveEmployees, ShowInactiveEmployee } from "@/features/inactive-employees/inactive-employees";
import { EmployeeTransactions } from "@/features/employee-transactions/employee-transactions";
import { ShowTask, Tasks } from "@/features/tasks/tasks";
import { Dashboard } from "@/features/dashboard/dashboard";
import { Login } from "@/features/auth/auth";
import { NotFound, ProtectedLayout, PublicLayout } from "@/features/shared/shared";

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
                    <Route path="/usuarios" element={<Users />} />
                    <Route path="/usuarios/crear" element={<CreateUser />} />
                    <Route path="/usuarios/:id" element={<ShowUser />} />
                    <Route path="/usuarios/:id/editar" element={<UpdateUser />} />
                </Route>

                <Route element={<ProtectedLayout />}>
                    <Route path="/departamentos" element={<Departments />} />
                    <Route path="/departamentos/crear" element={<CreateDepartment />} />
                    <Route path="/departamentos/:id" element={<ShowDepartment />} />
                    <Route path="/departamentos/:id/editar" element={<UpdateDepartment />} />
                </Route>

                <Route element={<ProtectedLayout />}>
                    <Route path="/niveles-acceso" element={<AccessLevels />} />
                    <Route path="/niveles-acceso/crear" element={<CreateAccessLevel />} />
                    <Route path="/niveles-acceso/:id" element={<ShowAccessLevel />} />
                    <Route path="/niveles-acceso/:id/editar" element={<UpdateAccessLevel />} />
                </Route>

                <Route element={<ProtectedLayout />}>
                    <Route path="/empleados" element={<Employees />} />
                    <Route path="/empleados/crear" element={<CreateEmployee />} />
                    <Route path="/empleados/:id" element={<ShowEmployee />} />
                    <Route path="/empleados/:id/editar" element={<UpdateEmployee />} />
                </Route>

                <Route element={<ProtectedLayout />}>
                    <Route path="/empleados-inactivos" element={<InactiveEmployees />} />
                    <Route path="/empleados-inactivos/:id" element={<ShowInactiveEmployee />} />
                </Route>

                <Route element={<ProtectedLayout />}>
                    <Route path="/transacciones-empleados" element={<EmployeeTransactions />} />
                </Route>

                <Route element={<ProtectedLayout />}>
                    <Route path="/tareas" element={<Tasks />} />
                    <Route path="/tareas/:id" element={<ShowTask />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
