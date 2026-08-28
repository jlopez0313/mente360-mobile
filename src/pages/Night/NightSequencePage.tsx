import { AppLayout } from "@/components/layout";
import { NightPlayerModal } from "@/components/Night/NightPlayerModal";
import { Button } from "@/components/ui/button";
import { NetworkContext } from "@/context/NetworkContext";
import { useBackButton } from "@/hooks/useBackButton";
import { useNightRoutine } from "@/hooks/useNightRoutine";
import { ArrowLeft, Clock, Info, Play } from "lucide-react";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

const NightSequencePage: React.FC = () => {
  const history = useHistory();
  const { baseURL, status, AudioNoWifi } = useContext(NetworkContext);

  useBackButton("/mi-noche");

  const { currentDayIndex, totalDays, currentAudio, markDayCompleted } =
    useNightRoutine();

  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const audioTitle = currentAudio?.titulo ?? "";
  const description = (currentAudio as any)?.descripcion as string | undefined;
  const duration = (currentAudio as any)?.duracion as string | undefined;
  const coverUrl =
    status && currentAudio?.imagen
      ? `${baseURL}${currentAudio.imagen}`
      : AudioNoWifi;

  const progressPercent =
    totalDays > 0 ? Math.round((currentDayIndex / totalDays) * 100) : 0;

  return (
    <AppLayout>
      <div className="min-h-full flex flex-col bg-background safe-top safe-bottom">
        {/* Back */}
        <div className="px-4 pt-3">
          <button
            onClick={() => history.replace("/mi-noche")}
            className="w-9 h-9 -ml-1.5 rounded-full flex items-center justify-center text-foreground hover:bg-muted active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 w-full max-w-md mx-auto px-4 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+3rem)]">
          <h1 className="text-xl font-bold font-display text-foreground mb-1">
            Mi secuencia nocturna
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Cada noche un paso más en tu camino.
          </p>

          {!currentAudio ? (
            <p className="text-sm text-muted-foreground text-center py-12">
              No hay audios de noche disponibles todavía.
            </p>
          ) : (
          <>
          {/* Tu avance actual */}
          <div className="bg-[#0B1536] text-white rounded-3xl p-5 mb-6 shadow-card">
            <p className="text-[11px] text-slate-400 mb-1">Tu avance actual</p>
            <h2 className="text-base font-bold font-display text-white mb-1">
              {audioTitle}
            </h2>
            <p className="text-xs text-slate-300 mb-3">
              Día {currentDayIndex} de {totalDays}
            </p>

            <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Esta noche te corresponde */}
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
              <p className="text-[11px] text-primary font-bold">
                Día {currentDayIndex}
              </p>
              <h4 className="text-sm font-bold font-display text-foreground truncate">
                {audioTitle}
              </h4>
              {description && (
                <p className="text-[11px] text-muted-foreground line-clamp-1 mb-1">
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
              <strong className="text-foreground">La constancia transforma.</strong>{" "}
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
          dayIndex={currentDayIndex}
          totalDays={totalDays}
          onCompleted={() => {
            markDayCompleted();
            setIsPlayerOpen(false);
          }}
        />
      </div>
    </AppLayout>
  );
};

export default NightSequencePage;
