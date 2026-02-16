import { useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { sosContent } from "@/lib/mockData";
import { Heart, Play, Pause, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import styles from "./Home.module.scss";
import { IonButton, IonIcon, useIonLoading } from "@ionic/react";
import { activar } from "@/services/sos";
import { useDispatch, useSelector } from "react-redux";
import { setMsgSource, setPanico } from "@/store/slices/homeSlice";
import { Audio } from "./Audio/Audio";
import { usePayment } from "@/hooks/usePayment";
import { Premium } from "../Shared/Premium/Premium";
import { Buttons } from "../Shared/Premium/Buttons/Buttons";
import { Texto } from "./Texto/Texto";
import { shareSocialOutline } from "ionicons/icons";
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
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const { user } = useSelector((state: any) => state.user);

  const { userEnabled, payment_status } = usePayment();
  const [isOpen, setIsOpen] = useState(false);

  const [present, dismiss] = useIonLoading();
  const [sos, setSOS] = useState<any>({});

  const dispatch = useDispatch()

  const history = useHistory();
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  const onGetSos = async () => {

    try {
      present({
        message: 'Activando...'
      })

      const { data } = await activar(user.eneatipo);

      setSOS({
        ...data,
        audio: {
          ...data.clip,
          imagen: data.imagen?.imagen,
          audio: data.clip?.clip,
        }
      });

      setIsOpen(true);

      dispatch(setPanico(data.texto));
      dispatch(setMsgSource('panico'));

    } catch (error) {
      console.error(error)
    } finally {
      dismiss();
    }
  }


  // Get a random affirmation
  const affirmation = sosContent.affirmations[Math.floor(Math.random() * sosContent.affirmations.length)];
  console.log(sos.audio)

  return (

    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={`${styles["sosmodal"]} max-w-sm mx-auto rounded-3xl border-0 bg-gradient-to-b from-sos/10 to-background p-0 overflow-hidden"`}>

          <div className="relative">
            {/* Header Image */}
            <div className="relative aspect-video w-full">
              <img
                src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=225&fit=crop"
                alt="S.O.S Emocional"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

              {/* Icon Overlay */}
              <div className="absolute top-4 left-4">
                <div className="w-12 h-12 rounded-full gradient-sos flex items-center justify-center animate-pulse">
                  <Heart className="w-6 h-6 text-sos-foreground" />
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
                <DialogTitle className="text-2xl font-bold text-foreground">
                  Respira, estás a salvo

                </DialogTitle>
              </DialogHeader>

              {/* Affirmation Message */}
              <div className="bg-sos/10 rounded-2xl p-4 mb-4 border border-sos/20">
                <p className="text-foreground text-lg font-medium text-center italic">
                  "{affirmation}"
                </p>
              </div>

 {
                    !userEnabled || payment_status == 'free' ?
                      <IonButton
                        shape="round"
                        onClick={() => { onOpenChange(false); setIsPremiumOpen(true); }}
                        expand="block"
                        type="button"
                        className="width50 ion-margin-top ion-padding-start ion-padding-end"
                      >
                        Premium
                      </IonButton> :
                      <IonButton
                        shape="round"
                        expand="block"
                        type="button"
                        className="width50 ion-margin-top ion-padding-start ion-padding-end"
                        id="modal-panico"
                        onClick={() => { onOpenChange(false); onGetSos(); }}
                      >
                        Activar
                      </IonButton>
                  }
              {/* Emergency Audio Player */}
              <div style={{ display: "none" }} className="bg-card rounded-xl p-4 shadow-card mb-6">
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
        </DialogContent>
      </Dialog>



      <Dialog open={isPremiumOpen} onOpenChange={setIsPremiumOpen}>
        <DialogContent className={`${styles["sosmodal"]} max-w-sm mx-auto rounded-3xl border-0 bg-gradient-to-b from-sos/10 to-background p-0 overflow-hidden"`}>
          <div className="ion-padding">

            <Premium />
            <Buttons />
          </div>
        </DialogContent>
      </Dialog>


      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`${styles["sosmodal"]} max-w-sm mx-auto rounded-3xl border-0 bg-gradient-to-b from-sos/10 to-background p-0 overflow-hidden"`}>
          <div className="ion-padding">

            <Texto descripcion={sos.texto?.texto}>
              <img
                src="assets/images/logo_texto.png"
                style={{ width: "90px", display: "block", margin: "10px auto" }}
              />
              <IonIcon
                className={`${styles["text-foreground"]}`}
                icon={shareSocialOutline}
                style={{
                  fontSize: "2rem",
                  width: "90px",
                  display: "block",
                  margin: "15px auto",
                }}
                onClick={() => {
                  history.replace("/share");
                }}
              />
            </Texto>

            <Audio audio={sos.audio} onConfirm={() => { }} />
          </div>
        </DialogContent>
      </Dialog>

    </>

  );


}
