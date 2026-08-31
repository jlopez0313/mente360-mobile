import { NetworkContext } from "@/context/NetworkContext";
import { useAudioDuration } from "@/hooks/useAudioDuration";
import { db } from "@/hooks/useDexie";
import { usePayment } from "@/hooks/usePayment";
import { useRequirePrincipal } from "@/hooks/useRequirePrincipal";
import { useLiveQuery } from "dexie-react-hooks";
import { Headphones, Play } from "lucide-react";
import { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";


export function DailyAudioCard() {
  const { user } = useSelector((state: any) => state.user);
  const { baseURL, status } = useContext(NetworkContext);
  const { userEnabled, payment_status } = usePayment();
  const history = useHistory();
  const requirePrincipal = useRequirePrincipal();

  // El crecimiento actual del usuario viene en user.crecimientos[0]
  const myCrecimiento = useMemo(() => user?.crecimientos?.[0], [user]);

  // Buscar el crecimiento completo en Dexie usando crecimientos_id
  const crecimiento = useLiveQuery(async () => {
    if (!user?.crecimientos?.length) return null;
    const found = await db.crecimientos
      .filter((c: any) => c.id == user.crecimientos[0].id)
      .first();
    return found ?? null;
  }, [user]);

  // Fallback: si no hay crecimientos_id pero sí myCrecimiento, usarlo
  const datosCrecimiento = crecimiento ?? myCrecimiento;

  const nivelId = datosCrecimiento?.nivel?.id;

  const audioSrc =
    status && datosCrecimiento?.audio
      ? `${baseURL}${datosCrecimiento.audio}`
      : undefined;

  const duration = useAudioDuration(audioSrc);

  const handleClick = () => {
    if (!nivelId) return;

    if (!requirePrincipal()) return;

    if (!userEnabled || payment_status == "free") {
      history.push('/planes');
      return;
    }

    history.push(`/niveles/${nivelId}/crecimientos`);
  };

  // Si no hay datos del crecimiento, mostrar un estado vacío pero visible
  const titulo = datosCrecimiento?.titulo ?? "Tu próximo podcast";
  const imagenUrl =
    status && datosCrecimiento?.imagen
      ? `${baseURL}${datosCrecimiento.imagen}`
      : undefined;

  return (
    <div className="px-4 pb-4">
      <h3 className="font-display font-semibold text-lg mb-3 text-foreground">Audio del día</h3>

      <button
        onClick={handleClick}
        disabled={!nivelId}
        className="w-full text-left bg-card !rounded-2xl border border-border overflow-hidden shadow-card active:scale-[0.98] transition-transform disabled:opacity-60 disabled:pointer-events-none"
      >
        <div className="p-4">
          <div className="flex items-center gap-4">
            {/* Thumbnail */}
            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
              {imagenUrl ? (
                <img
                  src={imagenUrl}
                  alt={titulo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <Headphones className="w-7 h-7 text-primary/60" />
                </div>
              )}
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center gradient-morning">
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">
                Siguiente audio
              </p>
              <h3 className="font-semibold text-foreground leading-tight line-clamp-2">
                {titulo}
              </h3>
              {duration ? (
                <p className="text-sm text-muted-foreground mt-1">{duration}</p>
              ) : (
                <div className="h-3.5 w-10 bg-muted animate-pulse rounded mt-1.5" />
              )}
            </div>

            {/* Arrow hint */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Play className="w-3.5 h-3.5 text-primary fill-primary ml-0.5" />
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
