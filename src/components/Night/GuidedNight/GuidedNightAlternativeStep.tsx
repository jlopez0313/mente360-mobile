import { Card } from "@/components/ui/card";
import { NetworkContext } from "@/context/NetworkContext";
import { ChevronRight, Clock, Play } from "lucide-react";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

interface Props {
  audios: any[];
  onSelectAudio: (audio: any) => void;
}

export const GuidedNightAlternativeStep: React.FC<Props> = ({
  audios,
  onSelectAudio,
}) => {
  const history = useHistory();
  const { baseURL, status, AudioNoWifi } = useContext(NetworkContext);

  const displayList =
    audios && audios.length > 0
      ? audios.slice(0, 3)
      : [
          {
            id: 1,
            titulo: "Soltar el control",
            descripcion:
              "Deja de intentar resolverlo todo y entrega lo que no depende de ti.",
            duracion: "24 min",
          },
          {
            id: 2,
            titulo: "Aceptar lo que no puedes cambiar hoy",
            descripcion:
              "Encuentra paz al aceptar tu día tal como fue y soltar cargas pendientes.",
            duracion: "31 min",
          },
          {
            id: 3,
            titulo: "Sanar la preocupación",
            descripcion:
              "Libera la mente del exceso de pensamientos y recobra calma.",
            duracion: "20 min",
          },
        ];

  return (
    <div className="flex-1 flex flex-col justify-between pt-2 pb-4">
      <div>
        <h1 className="text-xl font-bold font-display text-foreground mb-1">
          Elige otro audio para esta noche
        </h1>
        <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
          Aquí tienes otras opciones que pueden ayudarte.
        </p>

        {/* Audios List */}
        <div className="space-y-3">
          {displayList.map((item: any) => {
            const coverUrl =
              status && item.imagen ? `${baseURL}${item.imagen}` : AudioNoWifi;

            return (
              <button
                key={item.id}
                onClick={() => onSelectAudio(item)}
                className="w-full text-left rounded-2xl active:scale-[0.98] transition-transform group"
              >
               <Card className="rounded-2xl p-3.5 border-border/80 shadow-sm hover:shadow-card transition-shadow flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={coverUrl}
                    alt={item.titulo}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <Play className="w-5 h-5 text-white fill-white/80" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold font-display text-foreground mb-0.5 line-clamp-1">
                    {item.titulo}
                  </h3>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed mb-1">
                    {item.descripcion || "Meditación nocturna guiada para descansar."}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    {item.duracion && (
                      <>
                        <Clock className="w-3 h-3" />
                        <span>{item.duracion}</span>
                        <span>•</span>
                      </>
                    )}
                    <span className="text-primary font-medium">Hipnosis sanadora</span>
                  </div>
                </div>
               </Card>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto pt-6 text-center">
        <button
          onClick={() => history.push("/musicaterapia")}
          className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline"
        >
          <span>Ver todos los audios de Hipnosis sanadoras</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
