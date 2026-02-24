import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { NetworkContext } from "@/context/NetworkContext";
import Planes, { valorPlan } from "@/database/planes";
import { formatCurrency } from "@/helpers/Format";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Check, Crown, Sparkles } from "lucide-react";
import { useContext, useState } from "react";

interface CommunityPlanModalProps {
  plan: Planes | undefined;
  open: boolean;
  onOpenChange: (selectedPlan: valorPlan | undefined, open: boolean) => void;
  communityName: string;
  communityLogo: string;
}

export const CommunityPlanModal = ({
  plan,
  open,
  onOpenChange,
  communityName,
  communityLogo,
}: CommunityPlanModalProps) => {
  const { toast } = useToast();
  const { baseURL, status, AudioNoWifi } = useContext(NetworkContext);

  const [selectedPlan, setSelectedPlan] = useState<valorPlan>();

  const handleSubscribe = () => {
    toast({
      title: "Redirigiendo a pasarela de pago...",
      description: `${selectedPlan?.descripcion ?? "Plan mensual"
        } de ${communityName}`,
    });
    onOpenChange(selectedPlan, false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => onOpenChange(undefined, o)}>
      <DialogContent className="max-w-sm p-0 overflow-hidden rounded-xl border-premium/30">
        <DialogTitle className="sr-only">Planes de {communityName}</DialogTitle>

        {/* Header */}
        <div className="bg-gradient-to-br from-premium/20 to-primary/10 p-5 text-center">
          <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-3 border-2 border-premium/30 shadow-medium">
            <img
              src={status ? baseURL + communityLogo : AudioNoWifi}
              alt={communityName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Crown className="w-4 h-4 text-premium" />
            <h3 className="font-heading font-bold text-foreground text-lg">
              {communityName}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Elige el plan que mejor se adapte a ti
          </p>
        </div>

        {/* Planes */}
        <div className="px-5 pb-5 space-y-3">
          {plan?.valor.map((v: valorPlan, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedPlan(v)}
              className={cn(
                "w-full !rounded-2xl !border-2 !p-4 text-left transition-all relative overflow-hidden",
                selectedPlan?.key === v.key
                  ? "!border-premium !bg-premium/5 shadow-soft"
                  : "!border-border !bg-card hover:border-muted-foreground/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                    selectedPlan?.key === v.key
                      ? "!border-premium !bg-premium"
                      : "!border-muted-foreground/40"
                  )}
                >
                  {selectedPlan?.key === v.key && (
                    <Check className="w-3 h-3 !text-premium-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    {v.descripcion ?? "Plan mensual"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground text-lg">
                    {formatCurrency(Number(v.valor))}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {v.periodo ?? "USD/año"}
                  </p>
                </div>
              </div>
            </button>
          ))}

          {/* Subscribe Button */}
          <Button
            onClick={handleSubscribe}
            className="w-full gradient-accent text-accent-foreground font-semibold py-6 !rounded-xl"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Suscribirme ahora
          </Button>

          <p className="text-[11px] text-muted-foreground text-center">
            Cancela en cualquier momento. Se renueva automáticamente.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
