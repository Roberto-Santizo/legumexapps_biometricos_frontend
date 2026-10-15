import { Title, WorkingOnIt } from "@/features/shared/shared";
import { useSelector } from "react-redux";
import type { RootState } from "@/config/config";

export function Dashboard() {
    const user = useSelector((state: RootState) => state.auth.user)!;

    return (
        <div className="space-y-5">
            <Title title={`Bienvenido, ${user.name}`} subtitle="Plataforma de Biométricos" />
            <WorkingOnIt />
        </div>
    )
}
