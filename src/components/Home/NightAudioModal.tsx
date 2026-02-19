import { useContext, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CheckCircle2, Moon, Pause, Play } from "lucide-react";

import { usePayment } from "@/hooks/usePayment";
import { Buttons } from "../Shared/Premium/Buttons/Buttons";
import { Premium } from "../Shared/Premium/Premium";

import { db } from "@/hooks/useDexie";
import { useIonAlert } from "@ionic/react";
import { useLiveQuery } from "dexie-react-hooks";

import { NetworkContext } from "@/context/NetworkContext";
import { startBackground } from "@/helpers/background";
import { create, destroy } from "@/helpers/musicControls";
import { useAudio } from "@/hooks/useAudio";
import { setIsGlobalPlaying } from "@/store/slices/audioSlice";
import { useDispatch } from "react-redux";
import { Slider } from "../ui/slider";

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
  const { baseURL, status, AudioNoWifi } = useContext(NetworkContext);
  const dispatch = useDispatch();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    progress,
    duration,
    real_duration,
    buffer,
    currentTime,
    isPlaying,
    onLoadedMetadata,
    onTimeUpdate,
    onUpdateBuffer,
    onPause,
    onPlay,
    onLoad,
  } = useAudio(audioRef);

  const onDoPause = () => {
    onPause();
    onConfirmAudio();
    destroy();

    dispatch(setIsGlobalPlaying(true));
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
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  useEffect(() => {
    if (real_duration) {
      startBackground();
      create(
        baseURL,
        audio,
        real_duration,
        onPlay,
        onPause,
        () => {},
        () => {}
      );
    }
  }, [real_duration]);

  return (
    <>
      {userEnabled || payment_status != "free" ? (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-sm mx-auto rounded-xl border-0 bg-gradient-to-b from-night/10 to-background p-0 overflow-hidden">
            <div className="relative">
              {/* Cover Image */}
              <div className="relative aspect-video w-full">
                <img
                  src={status ? baseURL + audio?.imagen : AudioNoWifi}
                  alt={status ? baseURL + audio?.titulo : AudioNoWifi}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                {/* Play Button Overlay */}
                <button
                  onClick={handlePlayPause}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-20 h-20 rounded-full gradient-night flex items-center justify-center shadow-lg">
                    {isPlaying ? (
                      <Pause className="w-10 h-10 text-night-foreground" />
                    ) : (
                      <Play className="w-10 h-10 text-night-foreground ml-1" />
                    )}
                  </div>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 pt-4">
                <DialogHeader className="text-left mb-4">
                  <div className="flex items-center gap-2 text-night mb-1">
                    <Moon className="w-4 h-4" />
                    <span className="text-sm font-medium text-foreground">
                      Audio de la noche
                    </span>
                  </div>
                  <DialogTitle className="text-2xl font-bold text-foreground">
                    {audio?.titulo}
                  </DialogTitle>
                  <p className="text-muted-foreground text-sm mt-1">
                    {audio?.titulo}
                  </p>
                </DialogHeader>

                <div className="mb-6">
                  <Slider
                    value={[progress]}
                    max={100}
                    step={0.1}
                    buffer={buffer * 100}
                    onValueChange={(value) => onLoad(value)}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{currentTime}</span>
                    <span>{duration}</span>
                  </div>
                </div>

                {/* Complete Button */}
                <Button
                  onClick={handleComplete}
                  disabled={isCompleted}
                  className={cn(
                    "w-full !rounded-xl h-12 text-base font-semibold",
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

            <audio
              ref={audioRef}
              src={baseURL + audio?.audio}
              onLoadedMetadata={onLoadedMetadata}
              onTimeUpdate={onTimeUpdate}
              onProgress={onUpdateBuffer}
              onEnded={onDoPause}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent
            className="max-w-sm mx-auto rounded-3xl border-0 bg-gradient-to-b from-sos/10 to-background p-0 overflow-hidden"
          >
            <div className="ion-padding">
              <Premium />
              <Buttons />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
