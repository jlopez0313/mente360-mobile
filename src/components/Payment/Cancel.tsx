import Sad from "@/assets/images/sad.png";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { diferenciaRealEnDias } from "@/helpers/Fechas";
import { usePayment } from "@/hooks/usePayment";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface Props {
  showCancelModal: boolean;
  setShowCancelModal: (value: boolean) => void;
  handleCancelSubscription: () => void;
}

export const Cancel = ({
  showCancelModal,
  setShowCancelModal,
  handleCancelSubscription,
}: Props) => {
  const { payment_status } = usePayment();
  const { user } = useSelector((state: any) => state.user);

  const [diasLeft, setDiasLeft] = useState(0);

  useEffect(() => {
    const onGetDiasVence = () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const fechaVence = new Date(user.fecha_vencimiento);
      const diasHastaVence = diferenciaRealEnDias(now, fechaVence);

      setDiasLeft(diasHastaVence);
    };

    onGetDiasVence();
  }, []);

  return (
    <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
      <DialogTitle></DialogTitle>
      <DialogContent className="max-w-sm p-0 overflow-hidden rounded-lg" aria-describedby="">
        <div className="bg-gradient-to-b from-accent/20 to-background p-6">
          <h2 className="text-xl font-bold text-accent text-center mb-4">
            ¿Deseas cancelar?
          </h2>
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
              <img src={Sad} style={{ height: "100px" }} />
            </div>
          </div>
          <p className="text-foreground text-center mb-4">
            Aún te quedan{" "}
            <strong>
              {" "}
              {diasLeft} días {payment_status == "trial" ? "gratuitos" : ""}{" "}
            </strong>{" "}
            para disfrutar de todos los beneficios de{" "}
            {import.meta.env.VITE_NAME} sin costo.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-foreground">•</span>
              <span className="text-foreground font-medium">
                Audios personalizados para tu mente y emociones.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foreground">•</span>
              <span className="text-foreground font-medium">
                Tareas prácticas según tu personalidad.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foreground">•</span>
              <span className="text-foreground font-medium">
                Música de bienestar y frases adaptadas
              </span>
            </li>
          </ul>
          <p className="text-foreground text-center mb-6">
            Nuestro Objetivo es apoyarte en tu transformación. ¿Quieres pensarlo
            un poco más?
          </p>
          <div className="space-y-6">
            <Button
              onClick={() => setShowCancelModal(false)}
              className="w-full gradient-accent text-accent-foreground font-semibold py-6"
            >
              QUIERO SEGUIR DISFRUTANDO
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelSubscription}
              className="w-full !border-sos text-sos hover:bg-sos/10 py-6"
            >
              CANCELAR MI SUSCRIPCIÓN
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
