import { AppLayout } from "@/components/layout";
import SuscriptionComponent from "@/components/Suscripcion/Suscripcion";
import Comunidades from "@/database/comunidades";
import { formatCompleteDate } from "@/helpers/Fechas";
import { useBackButton } from "@/hooks/useBackButton";
import { db } from "@/hooks/useDexie";
import { usePayment } from "@/hooks/usePayment";
import { useLiveQuery } from "dexie-react-hooks";
import {
  ArrowLeft,
  Crown
} from "lucide-react";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const Suscripcion = () => {
  const { userEnabled, payment_status } = usePayment();
  const { user } = useSelector((state: any) => state.user);

  const suscripciones = useMemo(() => {
    return user.suscripciones.map((s: any) => s.id);
  }, [user]);

  const comunidades = useLiveQuery(
    () =>
      db.comunidades.filter((c: any) => suscripciones.includes(c.id)).toArray(),
    [suscripciones]
  );

  const fechaVencimiento = useMemo(() => {
    return formatCompleteDate(user.fecha_vencimiento);
  }, [user]);

  useBackButton("/perfil");

  return (
    <AppLayout>
      <div className="h-full bg-background flex flex-col px-4 py-6">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 safe-top">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => history.go(-1)}
              className="w-9 h-9 -ml-1.5 shrink-0 rounded-full flex items-center justify-center text-foreground hover:bg-muted active:scale-95 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground !m-0 leading-none">
              Mis Suscripciones
            </h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-1 py-4 space-y-6">
          {userEnabled && payment_status != "free" ? (
            <div className="bg-gradient-to-r from-premium/10 to-premium/5 rounded-2xl p-4 border border-premium/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full gradient-premium flex items-center justify-center">
                  <Crown className="w-6 h-6 text-premium-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground !p-0">
                    {import.meta.env.VITE_NAME} - Premium
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Vencimiento: {fechaVencimiento}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="space-y-4">
            {comunidades?.map((comunidad: Comunidades, idx: number) => {
              return (
                <SuscriptionComponent
                  key={idx}
                  comunidad={comunidad}
                />
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Suscripcion;
