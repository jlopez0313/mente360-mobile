import { Clock } from "lucide-react";

interface TaskProgressProps {
  daysRemaining: number;
}

export function TaskProgress({ daysRemaining }: TaskProgressProps) {
  return (
    <div className="px-4 pb-4">
      <div className="block bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-4 shadow-card"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Clock className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-primary-foreground/80 text-sm">
              Tarea semanal
            </p>
            <p className="text-primary-foreground font-semibold text-lg">
              {daysRemaining > 0
                ? `${daysRemaining} días para finalizar`
                : "¡Completa tu tarea hoy!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
