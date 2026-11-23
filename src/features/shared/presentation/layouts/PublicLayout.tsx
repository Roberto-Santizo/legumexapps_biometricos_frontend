import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { getHomePath } from "@/features/auth/auth";
import type { RootState } from "@/config/config";

export function PublicLayout() {
  const isSignedIn = useSelector((state: RootState) => state.auth.isSignedIn);
  const user = useSelector((state: RootState) => state.auth.user);

  if (isSignedIn && user) {
    return <Navigate to={getHomePath(user.roles)} replace />
  }

  return (
    <main className="print:p-0 print:text-black h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-800 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Outlet />
    </main>
  );
}
