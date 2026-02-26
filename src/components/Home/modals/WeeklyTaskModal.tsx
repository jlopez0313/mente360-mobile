import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CheckCircle2, ClipboardList } from "lucide-react";

import { db } from "@/hooks/useDexie";
import { confirmTarea } from "@/services/home";
import { setTab } from "@/store/slices/chatSlice";
import {
  useIonAlert
} from "@ionic/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

interface WeeklyTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCompleted: boolean;
  onComplete: () => void;
}

export function WeeklyTaskModal({
  open,
  onOpenChange,
  isCompleted,
  onComplete,
}: WeeklyTaskModalProps) {
  // Get the current pending task

  const dispatch = useDispatch();

  const history = useHistory();

  const [presentAlert] = useIonAlert();

  const taskObj = useLiveQuery(() => db.tareas.toCollection().first());

  const task = taskObj?.tarea?.split("\n\n") ?? [];

  const currentTask = {
    'title': task?.[0] ?? "",
    'description': task?.slice(1).join("\r\n\n") ?? "",
    'dueDate': getNextSunday()
  }

  const { currentDay } = useSelector((state: any) => state.home);

  const onConfirmTarea = async () => {
    try {
      if (currentDay == 1) {

        await db.tareas.update(taskObj?.id ?? 1, { done: 1 });

        const formData = {
          tareas_id: taskObj?.id,
        };

        await confirmTarea(formData);
        onComplete();
      }

      dispatch(setTab("grupos"));
      history.replace("/chat");
    } catch (error: any) {
      console.log(error);

      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    }
  };

  function getNextSunday(): Date {
    const today = new Date();
    const day = today.getDay(); // 0 = domingo

    const daysUntilSunday = day === 0 ? 0 : 7 - day;

    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + daysUntilSunday);

    return nextSunday;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto rounded-xl border-0 bg-gradient-to-b from-primary/10 to-background max-h-[90vh] p-6 overflow-auto">
        <DialogHeader className="text-left mb-4">
          <div className="flex items-center gap-2 text-primary mb-1">
            <ClipboardList className="w-4 h-4" />
            <span className="text-sm font-medium">Tarea de la semana</span>
          </div>
          <DialogTitle className="!m-1 text-xl font-bold text-foreground">
            {currentTask.title}
          </DialogTitle>
        </DialogHeader>

        {/* Task Content */}
        <ScrollArea className="max-h-[45vh]">
          <div className="bg-card rounded-2xl p-5 shadow-card mb-6 border border-border/50">
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {currentTask.description}
            </p>
          </div>
        </ScrollArea>

        {/* Due Date */}
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-sm text-muted-foreground">Fecha límite:</span>
          <span className="text-sm font-semibold text-primary">
            {new Date(currentTask.dueDate).toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
        </div>

        {/* Complete Button */}
        <div className="flex flex-col items-center justify-between mb-4 px-1 gap-4">

          <Button
            onClick={onConfirmTarea}
            disabled={isCompleted || currentDay != 1}
            className={cn(
              "w-full !rounded-xl h-12 text-base font-semibold",
              isCompleted
                ? "bg-success text-success-foreground"
                : "gradient-primary text-primary-foreground hover:opacity-90"
            )}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Completada
              </>
            ) : (
              "Marcar como completada"
            )}
          </Button>
          <Button
            onClick={onConfirmTarea}
            className={cn(
              "w-full !rounded-xl h-12 text-base font-semibold",
              isCompleted
                ? "bg-success text-success-foreground"
                : "gradient-primary text-primary-foreground hover:opacity-90"
            )}
          >
            Ir a Grupo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
