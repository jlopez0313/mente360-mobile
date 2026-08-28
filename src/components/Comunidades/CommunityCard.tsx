import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EpaycoCheckoutModal, EpaycoCheckoutPlan } from "@/components/Payment/EpaycoCheckoutModal";
import { NetworkContext } from "@/context/NetworkContext";
import Comunidades from "@/database/comunidades";
import { valorPlan } from "@/database/planes";
import { getCurrencyForUser, getPlanPrecio } from "@/helpers/Currency";
import { formatCurrency } from "@/helpers/Format";
import { YoutubePreview } from "@/components/Shared/YoutubePreview";
import { db } from "@/hooks/useDexie";
import { useLiveQuery } from "dexie-react-hooks";
import { ChevronRight, Crown, Users } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { CommunityPlanModal } from "./CommunityPlanModal";
import { ExpandableText } from "../Shared/ExpandableText";

type Props = {
  community: Comunidades;
};

export const CommunityCard = ({ community }: Props) => {
  const history = useHistory();

  const { AudioNoWifi, baseURL, status } = useContext(NetworkContext);

  const { user } = useSelector((state: any) => state.user);
  const currency = getCurrencyForUser(user);

  const [showPlanModal, setShowPlanModal] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<EpaycoCheckoutPlan | null>(null);

  const plan = useLiveQuery(() =>
    db.planes.where("key").equals(community.es_principal ? "GENERAL" : "COMUNIDAD").first(),
    [community.es_principal]
  );

  const planMensual = plan?.valor.find((v: valorPlan) => v.key === "MES");

  const handleAccess = () => {
    if (hasSuscription) {
      history.replace(`/comunidades/${community.id}/canales`);
    } else {
      setShowPlanModal(true);
    }
  };

  const isLeader = community.lider?.id == user.id;

  const hasSuscription = useMemo((): boolean => {
    // El líder de la comunidad siempre tiene acceso a la suya, sin necesidad de suscribirse.
    if (isLeader) {
      return true;
    }

    const suscripcion = user?.suscripciones?.find(
      (s: any) => s.id == community.id
    );
    if (!suscripcion?.pivot?.fecha_vencimiento) {
      return false;
    }

    const fechaVencimiento = new Date(suscripcion.pivot.fecha_vencimiento);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return fechaVencimiento >= hoy;
  }, [isLeader, community?.id, user?.suscripciones]);

  const handlePayment = (v: valorPlan | undefined, open: boolean) => {
    setShowPlanModal(open);

    if (!v) return;

    setCheckoutPlan({
      precio: String(getPlanPrecio(v, currency)),
      periodicidad: v.key,
      titulo: v.descripcion ?? "Plan mensual",
      comunidad: community?.id,
      currency,
    });
  };

  return (
    <Card className="overflow-hidden border-border/50 shadow-soft hover:shadow-medium transition-shadow">
      <CardContent className="p-0">
        {/* Header with image */}
        <div className="relative h-40 bg-gradient-to-r from-primary/20 to-secondary/20">
          {status ? (
            <YoutubePreview video={community?.video} fallback={AudioNoWifi} />
          ) : (
            <img
              src={AudioNoWifi}
              alt="Sin conexión"
              className="w-full h-full object-cover"
            />
          )}

          {/* Premium Badge */}
          {!hasSuscription && (
            <Badge className="absolute top-2 right-2 bg-premium text-premium-foreground gap-1">
              <Crown className="w-3 h-3" />
              Premium
            </Badge>
          )}

          {/* Community Logo */}
          <div className="absolute -bottom-6 left-4">
            <div className="w-14 h-14 rounded-xl border-2 bg-card overflow-hidden shadow-medium">
              <img
                src={status ? baseURL + community.imagen : AudioNoWifi}
                alt={community.comunidad}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-2 pb-4 px-4 space-y-3">
          <div>
            <h3 className="font-heading font-bold text-foreground">
              {community.comunidad}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Avatar className="w-5 h-5">
                <AvatarImage
                  className="object-cover w-full h-full"
                  src={baseURL + community.lider?.photo}
                  alt={community.lider?.name}
                />
                <AvatarFallback>{community.lider?.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {community.lider?.name}
              </span>
            </div>
          </div>

          <ExpandableText
            text={community.descripcion || ""}
            maxLines={2}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-xs">
                {community.suscritos?.length.toLocaleString()} miembros
              </span>
            </div>

            {hasSuscription ? (
              <Button
                size="sm"
                onClick={handleAccess}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1"
              >
                Acceder
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={handleAccess}
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                {formatCurrency(getPlanPrecio(planMensual, currency), currency)} {planMensual?.periodo}
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      <CommunityPlanModal
        plan={plan}
        open={showPlanModal}
        onOpenChange={handlePayment}
        communityName={community.comunidad}
        communityLogo={community?.imagen ?? ""}
      />

      <EpaycoCheckoutModal
        open={!!checkoutPlan}
        onOpenChange={(open) => !open && setCheckoutPlan(null)}
        plan={checkoutPlan}
        onSuccess={() => setCheckoutPlan(null)}
      />
    </Card>
  );
};
