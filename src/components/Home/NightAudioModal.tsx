import { useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { dailyAudio } from "@/lib/mockData";
import { Moon, Play, Pause, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import styles from "./Home.module.scss";
import { Premium } from "../Shared/Premium/Premium";
import { Buttons } from "../Shared/Premium/Buttons/Buttons";
import { usePayment } from "@/hooks/usePayment";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/hooks/useDexie";
import { useIonAlert } from "@ionic/react";

import { Audio as AudioShared } from "./Audio/Audio";

interface NightAudioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCompleted: boolean;
  onComplete: () => void;
}

export function NightAudioModal({
  open,
  onOpenChange,
  isCompleted,
  onComplete,
}: NightAudioModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleComplete = () => {
    onConfirmAudio();
    onComplete();
  };

  const { userEnabled, payment_status } = usePayment();

  const audio = useLiveQuery(() => db.audios.toCollection().first());

  const [presentAlert] = useIonAlert();

  const onConfirmAudio = async () => {
    try {
      await db.audios.update(audio?.id ?? 1, { done: 1 });
    } catch (error: any) {
      console.error(error);

      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message:
          error.data?.message ||
          "Tu audio ha finalizado. Cuando estés listo, presiona 'Finalizar'.",
        buttons: ["OK"],
      });
    }
  };

  return (
    <>
      {userEnabled || payment_status != 'free' ?
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className={`${styles["nightaudiomodal"]} max-w-sm mx-auto rounded-3xl border-0 bg-gradient-to-b from-night/10 to-background p-0 overflow-hidden"`}>
            <div className="relative">

              {/* Content */}
              <div className="p-6 pt-4">
                <DialogHeader className="text-left mb-4">
                  <div className="flex items-center gap-2 text-night mb-1">
                    <Moon className="w-4 h-4" />
                    <span className="text-sm font-medium text-foreground">Audio de la noche</span>
                  </div>
                  <DialogTitle className="text-2xl font-bold text-foreground">
                    {audio?.titulo}
                  </DialogTitle>
                  <p className="text-muted-foreground text-sm mt-1">
                    {dailyAudio.night.description}
                  </p>
                </DialogHeader>

                <AudioShared audio={audio} onConfirm={() => onConfirmAudio()} />

                {/* Complete Button */}
                <Button
                  onClick={handleComplete}
                  disabled={isCompleted}
                  className={cn(
                    "w-full rounded-xl h-12 text-base font-semibold",
                    isCompleted
                      ? "bg-success text-success-foreground"
                      : "gradient-night text-night-foreground hover:opacity-90"
                  )}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Completado
                    </>
                  ) : (
                    "Marcar como completado"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>

        </Dialog>

        :
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className={`${styles["sosmodal"]} max-w-sm mx-auto rounded-3xl border-0 bg-gradient-to-b from-sos/10 to-background p-0 overflow-hidden"`}>
            <div className="ion-padding">

              <Premium />
              <Buttons />
            </div>
          </DialogContent>
        </Dialog>
      }
    </>
  );
}
