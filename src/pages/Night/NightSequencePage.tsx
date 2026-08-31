import { AppLayout } from "@/components/layout";
import { NightPlayerModal } from "@/components/Night/NightPlayerModal";
import { Button } from "@/components/ui/button";
import { NetworkContext } from "@/context/NetworkContext";
import { useBackButton } from "@/hooks/useBackButton";
import { useNightRoutine } from "@/hooks/useNightRoutine";
import { useRequirePlan } from "@/hooks/useRequirePlan";
import { ArrowLeft, Clock, Info, Play } from "lucide-react";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

const NightSequencePage: React.FC = () => {
  const history = useHistory();
  const { baseURL, status, AudioNoWifi } = useContext(NetworkContext);

  useBackButton("/mi-noche");
  useRequirePlan();

  const { currentAudio } = useNightRoutine();

  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const audioTitle = currentAudio?.titulo ?? "";
  const description = (currentAudio as any)?.descripcion as string | undefined;
  const duration = (currentAudio as any)?.duracion as string | undefined;
  const coverUrl =
    status && currentAudio?.imagen
      ? `${baseURL}${currentAudio.imagen}`
      : AudioNoWifi;

  return (
    <AppLayout>
      <div className="min-h-full flex flex-col bg-background">
        {/* Header estándar: back + título en la misma fila */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3.5 safe-top">
          <div className="flex items-center gap-2">
            <button
              onClick={() => history.replace("/mi-noche")}
              className="w-9 h-9 -ml-1.5 shrink-0 rounded-full flex items-center justify-center text-foreground hover:bg-muted active:scale-95 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">
              Mi secuencia nocturna
            </h1>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 w-full max-w-md mx-auto px-4 pt-4 pb-[calc(var(--ion-safe-area-bottom,env(safe-area-inset-bottom,0px))+3rem)]">
          <p className="text-sm text-muted-foreground mb-6">
            Cada noche un paso más en tu camino.
          </p>

          {!currentAudio ? (
            <p className="text-sm text-muted-foreground text-center py-12">
              No hay audios de noche disponibles todavía.
            </p>
          ) : (
            <>
              <div className="bg-[#0B1536] text-white rounded-3xl p-6 mb-6 shadow-card">
                <h2 className="text-lg font-bold font-display text-white text-center">
                  {audioTitle}
                </h2>
              </div>

              <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
                Esta noche te corresponde
              </h3>

              <div className="bg-card rounded-2xl p-4 border border-border/60 shadow-card flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={coverUrl}
                    alt={audioTitle}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold font-display text-foreground truncate">
                    {audioTitle}
                  </h4>
                  {description && (
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mb-1">
                      {description}
                    </p>
                  )}
                  {duration && (
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{duration}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={() => setIsPlayerOpen(true)}
                className="w-full h-12 !rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-sm shadow-md flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Escuchar ahora</span>
              </Button>

              {/* Nota motivacional */}
              <div className="mt-8 bg-muted/50 rounded-2xl p-4 border border-border/40 flex items-start gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">
                    La constancia transforma.
                  </strong>{" "}
                  Escucha tu audio cada noche y permite que el cambio se integre.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Audio Player Modal */}
        <NightPlayerModal
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          audioItem={currentAudio}
          collection="audios"
          onCompleted={() => setIsPlayerOpen(false)}
        />
      </div>
    </AppLayout>
  );
};

export default NightSequencePage;
