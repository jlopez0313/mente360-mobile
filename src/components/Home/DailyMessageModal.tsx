
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CheckCircle2, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";


import { db } from "@/hooks/useDexie";
import { setMsgSource } from "@/store/slices/homeSlice";
import {
  useIonAlert
} from "@ionic/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

interface DailyMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCompleted: boolean;
  onComplete: () => void;
}

export function DailyMessageModal({
  open,
  onOpenChange,
  isCompleted,
  onComplete,
}: DailyMessageModalProps) {

const dispatch = useDispatch();
  const history = useHistory();
  const mensaje = useLiveQuery(() => db.mensajes.toCollection().first())

  const [presentAlert] = useIonAlert();

  const onSetSource = () => {
    dispatch(setMsgSource('mensaje'));
  }

  const onConfirmMensaje = async () => {
    try {
      await db.mensajes.update(mensaje?.id ?? 1, { done: 1 });

      onComplete();
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

  
  const handleShare = async () => {
    const shareText = `"${mensaje?.mensaje || ""}" - ${"Mente 360"}\n\nCompartido desde Mente 360`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mensaje del día - Mente 360",
          text: shareText,
        });
        toast.success("Compartido exitosamente");
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareText);
      toast.success("Copiado al portapapeles");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto rounded-xl border-0 bg-gradient-to-b from-accent/10 to-background p-6 overflow-hidden">
        <DialogHeader className="text-left mb-4">
          <div className="flex items-center gap-2 text-accent mb-1">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm !font-medium">Mensaje del día</span>
          </div>
          <DialogTitle className="text-xl !font-bold text-foreground">
            Reflexión diaria
          </DialogTitle>
        </DialogHeader>

        {/* Message Card */}
        <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl p-6 mb-6 border border-accent/20">
          <p className="text-foreground text-lg leading-relaxed mb-4 italic">
            "{mensaje?.mensaje}"
          </p>
          <p className="text-accent font-semibold text-right">
            — {"Mente 360"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex-1 !rounded-xl h-12 text-base !font-semibold border-accent/30 text-accent hover:bg-accent/10"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Compartir
          </Button>
          
          <Button
            onClick={onConfirmMensaje}
            disabled={isCompleted}
            className={cn(
              "flex-1 !rounded-xl h-12 text-base !font-semibold",
              isCompleted
                ? "bg-success text-success-foreground"
                : "gradient-accent text-accent-foreground hover:opacity-90"
            )}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Leído
              </>
            ) : (
              "Completar"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
