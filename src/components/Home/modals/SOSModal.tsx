import { useContext, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sosContent } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { CheckCircle2, Heart, Pause, Play, Share2 } from "lucide-react";

import { Buttons } from "@/components/Shared/Premium/Buttons/Buttons";
import { Premium } from "@/components/Shared/Premium/Premium";
import { Slider } from "@/components/ui/slider";
import { NetworkContext } from "@/context/NetworkContext";
import { useAudio } from "@/hooks/useAudio";
import { usePayment } from "@/hooks/usePayment";
import { activar } from "@/services/sos";
import { setIsGlobalPlaying } from "@/store/slices/audioSlice";
import { setMsgSource, setPanico } from "@/store/slices/homeSlice";
import { IonButton } from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

interface SOSModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCompleted: boolean;
  onComplete: () => void;
}

export function SOSModal({
  open,
  onOpenChange,
  isCompleted,
  onComplete,
}: SOSModalProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    progress,
    duration,
    buffer,
    currentTime,
    isPlaying,
    onLoadedMetadata,
    onTimeUpdate,
    onUpdateBuffer,
    onPause,
    onPlay,
    onLoad,
  } = useAudio(audioRef, () => { }, false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const { AudioNoWifi, baseURL, status } = useContext(NetworkContext);
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const { userEnabled, payment_status } = usePayment();

  const [sos, setSOS] = useState<any>({});
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  const handleShare = async () => {
    dispatch(setMsgSource('sos'));
    history.replace("/share")
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      dispatch(setIsGlobalPlaying(false));
      onPlay();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSOS({});
      onPause();
    }
    onOpenChange(open);
  }

  useEffect(() => {
    const onGetSos = async () => {
      if (!open) return;

      try {
        const { data } = await activar(user.eneatipo);
        setSOS(data);

        dispatch(setPanico(data.texto));
      } catch (error) {
        console.error(error);
      }
    };

    onGetSos();
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-sm mx-auto rounded-xl border-0 bg-gradient-to-b from-night/10 to-background p-0 overflow-hidden">
          <div className="relative">
            {/* Header Image */}
            <div className="relative aspect-video w-full">
              <img
                src={status && sos.imagen ? baseURL + sos.imagen?.imagen : AudioNoWifi}
                alt="S.O.S Emocional"
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

              {/* Play Button Overlay */}
              <button
                onClick={handlePlayPause}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-13 h-13 rounded-full gradient-night flex items-center justify-center shadow-lg">
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-night-foreground" />
                  ) : (
                    <Play className="w-6 h-6 text-night-foreground ml-1" />
                  )}
                </div>
              </button>

              {/* Icon Overlay */}
              <div className="absolute top-4 left-4">
                <div className="w-8 h-8 rounded-full gradient-sos flex items-center justify-center animate-pulse">
                  <Heart className="w-4 h-4 text-sos-foreground" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 pt-4">
              <DialogHeader className="text-left mb-4">
                <div className="flex items-center gap-2 text-sos mb-1">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">S.O.S Emocional</span>
                </div>
                <DialogTitle className="text-xl font-bold text-foreground">
                  Respira, estás a salvo
                </DialogTitle>
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

              {/* Affirmation Message */}
              <div className="bg-sos/10 rounded-2xl p-4 mb-4 border border-sos/20">
                <p className="text-foreground font-medium text-center italic">
                  "{sos.texto?.texto || "...Cargando"}"
                </p>
              </div>

              <div className="flex gap-3">
                {!userEnabled || payment_status == "free" ? (
                  <IonButton
                    shape="round"
                    onClick={() => {
                      onOpenChange(false);
                      setIsPremiumOpen(true);
                    }}
                    expand="block"
                    type="button"
                    className="width50 ion-margin-top ion-padding-start ion-padding-end"
                  >
                    Premium
                  </IonButton>
                ) : (
                  <Button
                    variant="outline"
                    className="flex-1 !rounded-xl h-12 text-base !font-semibold border-accent/30 text-accent hover:bg-accent/10"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Compartir
                  </Button>
                )}
              </div>
              {/* Emergency Audio Player */}
              <div
                style={{ display: "none" }}
                className="bg-card rounded-xl p-4 shadow-card mb-6"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePlayPause}
                    className="w-12 h-12 rounded-full gradient-sos flex items-center justify-center flex-shrink-0"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-sos-foreground" />
                    ) : (
                      <Play className="w-5 h-5 text-sos-foreground ml-0.5" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-sm">
                      {sosContent.emergencyAudio.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(sosContent.emergencyAudio.duration)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Complete Button */}
              <Button
                style={{ display: "none" }}
                onClick={onComplete}
                disabled={isCompleted}
                className={cn(
                  "w-full rounded-xl h-12 text-base font-semibold",
                  isCompleted
                    ? "bg-success text-success-foreground"
                    : "gradient-sos text-sos-foreground hover:opacity-90"
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
            src={sos.clip ? baseURL + sos.clip?.clip : ''}
            onLoadedMetadata={onLoadedMetadata}
            onTimeUpdate={onTimeUpdate}
            onProgress={onUpdateBuffer}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isPremiumOpen} onOpenChange={setIsPremiumOpen}>
        <DialogContent
          className="max-w-sm mx-auto rounded-3xl border-0 bg-gradient-to-b from-sos/10 to-background p-0 overflow-hidden"
        >
          <div className="ion-padding">
            <Premium />
            <Buttons />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
