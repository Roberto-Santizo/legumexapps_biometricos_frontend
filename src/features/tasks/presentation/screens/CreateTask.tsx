import { Title } from "@/features/shared/shared";
import { ScheduleTaskForm } from "@/features/tasks/tasks";
import { useNavigate } from "react-router-dom";

// Programa una tarea sin planificación: solo exige que la fecha sea hoy o posterior
export function CreateTask() {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      <Title title="Programar tarea" subtitle="Alta, movimiento o baja sin planificación asociada" />

      <div className="form w-full mx-auto lg:w-2/3">
        <ScheduleTaskForm onScheduled={() => navigate('/tareas')} />
      </div>
    </div>
  )
}
