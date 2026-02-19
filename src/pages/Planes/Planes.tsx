import logoMente360 from "@/assets/images/logo.png";
import { AppLayout } from "@/components/layout";
import { Cancel } from "@/components/Payment/Cancel";
import { Button } from "@/components/ui/button";
import { valorPlan } from "@/database/planes";
import { formatCurrency } from "@/helpers/Format";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/hooks/useDexie";
import { usePayment } from "@/hooks/usePayment";
import { cn } from "@/lib/utils";
import { updateData } from "@/services/realtime-db";
import { update } from "@/services/user";
import { setUser } from "@/store/slices/userSlice";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

const features = [
  "Acceso ilimitado a formaciones, meditaciones, musicoterapia y tareas personalizadas",
  "Audios nocturnos personalizados para tu tipo de personalidad",
  "Acceso a la comunidad exclusiva para compartir tu crecimiento personal",
  "Tareas semanales generales",
  "Frases diarias de motivación adaptadas a tu eneagrama",
  "S.O.S Emocional",
];

const PlanesPage = () => {
  const history = useHistory();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { payment_status } = usePayment();

  const { user } = useSelector((state: any) => state.user);

  const [selectedPlan, setSelectedPlan] = useState<valorPlan | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [hasActiveSubscription] = useState(true);

  const planes = useLiveQuery(() =>
    db.planes.where("key").equals("GENERAL").first()
  );

  const handleSubscribe = () => {
    toast({
      title: "¡Redirigiendo a pasarela de pago!",
      description: `${selectedPlan?.descripcion} ${selectedPlan?.periodo} — $${selectedPlan?.valor} USD`,
    });
    history.replace("/home");
  };

  const handleCancelSubscription = async () => {
    try {
      setShowCancelModal(false);

      const {
        data: { data: updated },
      } = await update({ has_paid: false }, user.id);
      dispatch(setUser({ ...updated }));

      await updateData(`payments/${user.id}`, {
        ref_status: "canceled",
        hora: new Date().toISOString(),
        has_paid: false,
      });

      history.replace("/perfil");

      toast({
        title: "Suscripción cancelada",
        description: "Tu suscripción se cancelará al final del período actual",
      });
    } catch (error) {
      console.log("Error Cancelando", error);
    }
  };

  return (
    <AppLayout hideNav>
      <div className="h-full flex flex-col bg-background px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => history.go(-1)}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Elige tu plan</h1>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-6 px-1 py-2 overfow-y-auto">
          <h4 className="!m-3 text-xl font-bold text-foreground">
            {" "}
            Con tu plan premium disfrutarás de:{" "}
          </h4>
          <ul className="space-y-2">
            {features.map((feat, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{feat}</span>
              </li>
            ))}
          </ul>

          <h6 className="!m-3 font-bold text-foreground"> Elige tu plan: </h6>

          {/* Planes */}
          {planes?.valor?.map((plan: valorPlan, idx: any) => (
            <button
              key={idx}
              onClick={() => setSelectedPlan(plan)}
              className={cn(
                "w-full !rounded-2xl !border-2 !p-5 text-left transition-all",
                selectedPlan?.key === plan.key
                  ? "!border-primary !bg-primary/5 shadow-sm"
                  : "!border-border !bg-card hover:border-muted-foreground/30"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <img
                    src={logoMente360}
                    alt="Mente360"
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground !m-0">
                    {import.meta.env.VITE_NAME}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {plan.descripcion}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(Number(plan.valor))}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {plan.periodo}
                  </p>
                </div>
              </div>
            </button>
          ))}

          {/* Subscribe Button */}
          {selectedPlan ? (
            <Button
              onClick={handleSubscribe}
              className={cn(
                "w-full font-semibold py-6 !rounded-xl text-base",
                selectedPlan?.key === "premium"
                  ? "gradient-premium text-premium-foreground"
                  : "gradient-primary text-primary-foreground"
              )}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Comienza con tu {selectedPlan?.descripcion}
            </Button>
          ) : null}

          {
            payment_status == 'free' || payment_status == 'trial' ? 
            <p className="text-xs text-muted-foreground text-center mt-3 mb-6">
              Prueba gratuita de 14 días. Cancela en cualquier momento.
            </p> : null
          }


          {/* Cancel Subscription */}
          {hasActiveSubscription && (
            <div className="bg-card rounded-2xl border border-border p-4">
              <p className="text-sm text-muted-foreground mb-3">
                ¿Deseas cancelar tu suscripción actual?
              </p>
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(true)}
                className="w-full !border-sos text-sos hover:bg-sos/10"
              >
                Cancelar mi suscripción
              </Button>
            </div>
          )}
        </div>
      </div>

      <Cancel
        handleCancelSubscription={handleCancelSubscription}
        showCancelModal={showCancelModal}
        setShowCancelModal={setShowCancelModal}
      />
    </AppLayout>
  );
};

export default PlanesPage;
