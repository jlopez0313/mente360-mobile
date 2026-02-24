import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  ClipboardList,
  Heart,
  MessageCircle,
  Moon
} from "lucide-react";

interface DailyContentItem {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  gradientClass: string;
  isCompleted: boolean;
}

interface DailyContentGridProps {
  completed: {
    nightAudio: boolean;
    sosEmotional: boolean;
    dailyMessage: boolean;
    weeklyTask: boolean;
  };
  onOpenModal: (modal: "nightAudio" | "sosEmotional" | "dailyMessage" | "weeklyTask") => void;
}

export function DailyContentGrid({ completed, onOpenModal }: DailyContentGridProps) {
  const items: DailyContentItem[] = [
    {
      id: "weeklyTask",
      title: "Tarea semanal",
      icon: ClipboardList,
      color: "primary",
      gradientClass: "gradient-primary",
      isCompleted: completed.weeklyTask,
    },
    {
      id: "dailyMessage",
      title: "Mensaje del día",
      icon: MessageCircle,
      color: "accent",
      gradientClass: "gradient-accent",
      isCompleted: completed.dailyMessage,
    },
    {
      id: "nightAudio",
      title: "Audio noche",
      icon: Moon,
      color: "night",
      gradientClass: "gradient-night",
      isCompleted: completed.nightAudio,
    },
    {
      id: "sosEmotional",
      title: "S.O.S Emocional",
      icon: Heart,
      color: "sos",
      gradientClass: "gradient-sos",
      isCompleted: completed.sosEmotional,
    },
  ];

  return (
    <div className="px-4 pb-4">
      <h3 className="font-display font-semibold text-lg mb-3 text-foreground">
        Tu contenido diario
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onOpenModal(item.id as "nightAudio" | "sosEmotional" | "dailyMessage" | "weeklyTask")}
              className={cn(
                "relative flex flex-col items-center gap-2 p-4 !rounded-2xl transition-all",
                "!bg-card shadow-card hover:shadow-elevated active:scale-[0.98]",
                item.isCompleted && "ring-2 ring-success/50"
              )}
            >
              {/* Completion Badge */}
              {item.isCompleted && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
              )}

              {/* Icon */}
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                item.gradientClass
              )}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              {/* Title */}
              <p className={cn(
                "text-sm font-medium text-center",
                item.isCompleted ? "text-muted-foreground" : "text-foreground"
              )}>
                {item.title}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}