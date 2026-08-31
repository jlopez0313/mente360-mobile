import { useHistory, useParams } from "react-router-dom";

import { NivelCard } from "@/components/Niveles/NivelCard";
import { AppLayout } from "@/components/layout";
import { destroy } from "@/helpers/musicControls";
import { useBackButton } from "@/hooks/useBackButton";
import { db } from "@/hooks/useDexie";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const Niveles: React.FC = () => {
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const { id } = useParams<any>();
  const dispatch = useDispatch();
  const history = useHistory();
  const { user } = useSelector((state: any) => state.user);

  const channel = useLiveQuery(() =>
    db.canales.where("id").equals(Number(id)).first()
  );

  const niveles = useLiveQuery(
    () =>
      db.niveles
        .orderBy("orden")
        .filter((n: any) => n?.canal?.id == id)
        .toArray(),
    [id]
  );

  const minOrden = useMemo(
    () => Math.min(...(niveles?.map((n: any) => n.orden) ?? [])),
    [niveles]
  );

  // Nivel "actual" del usuario en este canal: el de su registro de crecimiento,
  // o el primero (minOrden) si aún no tiene registro. Todo lo que esté por
  // encima de ese orden está bloqueado hasta terminar un audio del actual.
  const { firstLockedId, currentLevelName } = useMemo(() => {
    const ordered = [...(niveles ?? [])].sort(
      (a: any, b: any) => a.orden - b.orden
    );
    const myCrec = user?.crecimientos?.find(
      (c: any) => c.nivel?.canales_id == Number(id)
    );
    const currentOrden = myCrec ? myCrec.nivel?.orden : minOrden;
    const current = ordered.find((n: any) => n.orden === currentOrden);
    const firstLocked = ordered.find((n: any) => n.orden > currentOrden);
    return {
      firstLockedId: firstLocked?.id ?? null,
      currentLevelName: current?.nivel ?? null,
    };
  }, [niveles, user, id, minOrden]);

  const goToLider = () => {
    if (channel?.comunidad?.lider?.id)
      history.replace(`/lider/${channel.comunidad?.lider?.id}/${channel.id}`);
  };

  useEffect(() => {
    return () => {
      destroy();
    };
  }, []);

  useBackButton(`/comunidades/${channel?.comunidad?.id}/canales`);

  if (!channel) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Canal no encontrado</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout hideNav>
      <div className="h-full bg-background flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 safe-top px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                history.replace(
                  `/comunidades/${channel?.comunidad?.id}/canales`
                )
              }
              className="w-9 h-9 -ml-1.5 shrink-0 rounded-full flex items-center justify-center text-foreground hover:bg-muted active:scale-95 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg font-heading font-bold text-foreground truncate">
                {channel?.canal}
              </h1>
              <p className="text-xs text-muted-foreground">
                {channel?.comunidad?.comunidad}
              </p>
            </div>
          </div>
        </div>

        {/* Podcasts List */}
        <div className="px-4 py-6 space-y-4 overflow-y-auto">
          {niveles?.length ? (
            niveles?.map((nivel, idx) => (
              <NivelCard
                minOrden={minOrden}
                key={idx}
                nivel={nivel}
                showUnlockHint={nivel.id === firstLockedId}
                currentLevelName={currentLevelName}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No hay contenido aún en este canal
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Niveles;
