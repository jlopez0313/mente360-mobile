import { Button } from "@/components/ui/button";
import { NetworkContext } from "@/context/NetworkContext";
import { Clock, Play, Sparkles } from "lucide-react";
import React, { useContext } from "react";

interface Props {
  audio: any;
  onPlay: () => void;
  onSeeOther: () => void;
  onLater: () => void;
}

export const GuidedNightRecommendationStep: React.FC<Props> = ({
  audio,
  onPlay,
  onSeeOther,
  onLater,
}) => {
  const { baseURL, status, AudioNoWifi } = useContext(NetworkContext);

  const title = audio?.titulo ?? "";
  const desc = audio?.descripcion ?? "";
  const duration = audio?.duracion as string | undefined;
  const coverUrl =
    status && audio?.imagen ? `${baseURL}${audio.imagen}` : AudioNoWifi;

  return (
    <div className="flex-1 flex flex-col justify-between pt-2 pb-4">
      <div>
        <h1 className="text-xl font-bold font-display text-foreground mb-4">
          Para esta noche te recomendamos
        </h1>

        {!audio ? (
          <p className="text-sm text-muted-foreground text-center py-10">
            No hay audios de noche disponibles todavía.
          </p>
        ) : (
        /* Recommended Card */
        <div className="bg-card rounded-2xl p-4 border border-border/80 shadow-card flex gap-4 items-start mb-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted flex-shrink-0 relative shadow-sm">
            <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Recomendado</span>
            </div>

            <h2 className="text-sm font-bold font-display text-foreground mb-1 leading-snug">
              {title}
            </h2>

            <p className="text-xs text-muted-foreground leading-relaxed mb-2 line-clamp-2">
              {desc}
            </p>

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              {duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{duration}</span>
                </span>
              )}
              {duration && audio?.categoria?.nombre && <span>•</span>}
              {audio?.categoria?.nombre && (
                <span className="text-primary font-medium">
                  {audio.categoria.nombre}
                </span>
              )}
            </div>
          </div>
        </div>
        )}
      </div>

      <div className="mt-auto pt-6 flex flex-col gap-4">
        <Button
          onClick={onPlay}
          disabled={!audio}
          className="w-full h-12 !rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-sm shadow-md flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Escuchar este audio</span>
        </Button>

        <Button
          variant="outline"
          onClick={onSeeOther}
          className="w-full h-11 !rounded-2xl !border-primary/30 text-primary hover:bg-primary/5 font-semibold text-sm"
        >
          Ver otra opción
        </Button>

        <button
          onClick={onLater}
          type="button"
          className="text-xs text-muted-foreground hover:text-foreground font-medium py-1.5 text-center"
        >
          Más tarde
        </button>
      </div>
    </div>
  );
};
