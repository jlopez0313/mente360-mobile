
import { Link, useHistory, useParams } from "react-router-dom";

import { NivelCard } from "@/components/Niveles/NivelCard";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { destroy } from "@/helpers/musicControls";
import { useBackButton } from "@/hooks/useBackButton";
import { db } from "@/hooks/useDexie";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Niveles: React.FC = () => {
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const { id } = useParams<any>();
  const dispatch = useDispatch();
  const history = useHistory();

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
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to={`/comunidades/${channel?.comunidad?.id}/canales`} replace={true}>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="min-w-0">
              <h1 className="text-lg font-heading font-bold text-foreground truncate">
                {channel?.canal}
              </h1>
              <p className="text-xs text-muted-foreground">{channel?.comunidad?.comunidad}</p>
            </div>
          </div>
        </div>

        {/* Podcasts List */}
        <div className="px-4 py-6 space-y-4 overflow-y-auto">
          {niveles?.length ? (
            niveles?.map((nivel, idx) => (
              <NivelCard
                key={idx}
                nivel={nivel}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay contenido aún en este canal</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Niveles;
