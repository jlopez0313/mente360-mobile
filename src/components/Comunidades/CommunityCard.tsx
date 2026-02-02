import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NetworkContext } from "@/context/NetworkContext";
import Comunidades from "@/database/comunidades";
import { getYoutubeLink } from "@/helpers/Video";
import { usePayment } from "@/hooks/usePayment";
import { cn } from "@/lib/utils";
import { ChevronRight, Crown, Users } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

type Props = {
  community: Comunidades;
};

export const CommunityCard = ({ community }: Props) => {
  const history = useHistory();
  const { userEnabled, payment_status } = usePayment();

  const { AudioNoWifi, baseURL, status } = useContext(NetworkContext);

  const { user } = useSelector((state: any) => state.user);

  const [expandido, setExpandido] = useState(false);

  const handleAccess = () => {
    if (hasSuscription) {
      if (!userEnabled || payment_status == "free") {
        // setIsPremiumOpen(true);
      } else {
        if (user.suscripciones.some((s: any) => s.id == community.id)) {
          history.replace(`/comunidades/${community.id}/canales`);
        } else {
          return;
        }
      }
    }
  };

  const hasSuscription = useMemo(() => {
    if (
      !userEnabled ||
      payment_status == "free" ||
      !user.suscripciones.some((s: any) => s.id == community.id)
    ) {
      return false;
    } else if (user.suscripciones.some((s: any) => s.id == community.id)) {
      const fecha_vencimiento = user.suscripciones.find(
        (s: any) => s.id == community.id
      )?.pivot?.fecha_vencimiento;
      if (!fecha_vencimiento) {
        return null;
      }

      const fecha = new Date(fecha_vencimiento);
      const hoy = new Date();

      if (fecha < hoy) {
        return false;
      }
    } else if (community.lider.id != user.id) {
      return false;
    }
    return true;
  }, [community]);

  return (
    <Card className="overflow-hidden border-border/50 shadow-soft hover:shadow-medium transition-shadow">
      <CardContent className="p-0">
        {/* Header with image */}
        <div className="relative h-40 bg-gradient-to-r from-primary/20 to-secondary/20">
          <iframe
            className="w-full h-full object-cover"
            src={getYoutubeLink(community?.video)}
            title="YouTube video player"
            allowFullScreen
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          ></iframe>

          {/* Premium Badge */}
          {
            !hasSuscription && (
              <Badge className="absolute top-2 right-2 bg-premium text-premium-foreground gap-1">
                <Crown className="w-3 h-3" />
                Premium
              </Badge>
            )
          }

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

          <p className={cn(
            "text-sm text-muted-foreground mb-0",
            expandido ? "line-clamp-none" : "line-clamp-2"
          )}>
            {community.descripcion}
          </p>

          <button className="text-sm text-primary underline hover:opacity-80 transition" onClick={() => setExpandido(!expandido)}>
            {expandido ? "Leer menos" : "Leer más"}
          </button>

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
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                ${community.price}/mes
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
