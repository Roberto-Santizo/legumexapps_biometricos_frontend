import { CustomHeader, CustomSideBar } from "@/features/shared/shared";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import type { RootState } from "@/config/config";

export function ProtectedLayout() {
    const isSignedIn = useSelector((state: RootState) => state.auth.isSignedIn);
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [lastPathname, setLastPathname] = useState(location.pathname);

    if (location.pathname !== lastPathname) {
        setLastPathname(location.pathname);
        setSidebarOpen(false);
    }

    useEffect(() => {
        if (!sidebarOpen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setSidebarOpen(false);
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [sidebarOpen]);

    if (!isSignedIn) {
        return <Navigate to={'/login'} replace />
    }

    return (
        <main className="h-screen overflow-hidden lg:grid lg:grid-cols-[auto_1fr]">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            <CustomSideBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex h-full min-h-0 min-w-0 flex-col">
                <CustomHeader open={sidebarOpen} onMenuClick={() => setSidebarOpen(true)} />

                <section className="min-h-0 flex-1 overflow-y-auto bg-white p-4 sm:p-6 dark:bg-black">
                    <Outlet />
                </section>
            </div>
        </main>
    );
}
