import AudioNoWifi from "@/assets/images/audio_no_wifi.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Crecimientos from "@/database/crecimientos";
import Niveles from "@/database/niveles";
import { db } from "@/hooks/useDexie";
import { useLiveQuery } from "dexie-react-hooks";
import { MoreVertical, Play } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

interface Props {
  nivel: Niveles;
  onPlay: () => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  return `${mins} min`;
};

export const NivelCard = ({ nivel }: Props) => {

  const baseURL = import.meta.env.VITE_BASE_BACK;
  
  const { user } = useSelector((state: any) => state.user);

  const isCompleted = nivel.progress >= 1;

  const crecimientos: Crecimientos[] = useLiveQuery(
    () =>
      db.crecimientos
        .toArray()
        .then((lista: any) => {
          // swiper.slideTo(0);
          return lista;
        })
        .then((resultados: any) => {
          return resultados
            .filter((r: any) => r.nivel?.id == Number(nivel?.id))
            .map((item: any) => {
              return { ...item, playing: false };
            });
        })
        .then((resultados: any) => {
          if (user.crecimientos_id) {
            const idx = resultados.findIndex(
              (x: any) => x.id == user.crecimientos_id
            );
            // swiper.slideTo(idx);
          }

          return resultados;
        }),
    [nivel]
  );

  if(crecimientos?.length) {
    return (
      <Card className="overflow-hidden border-border/50 hover:shadow-soft transition-shadow">
        <CardContent className="p-0">
          <div className="flex gap-3 p-3">
            {/* Cover Image */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted">
                <img
                  src={status ? baseURL + crecimientos[0].imagen : AudioNoWifi}
                  alt={crecimientos[0].titulo}
                  className="w-full h-full object-cover"
                />
              </div>
              <Link to={`/niveles/${nivel.id}/crecimientos`}>
                <Button
                  size="icon"
                  className="absolute inset-0 m-auto w-10 h-10 !rounded-full bg-primary/90 hover:bg-primary shadow-medium"
                >
                  <Play className="w-4 h-4 text-primary-foreground fill-current" />
                </Button>
              </Link>
            </div>
  
            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-foreground text-sm line-clamp-1 !m-0">
                    {crecimientos[0].titulo}
                  </h3>
                  <Button variant="ghost" size="icon" className="shrink-0 w-6 h-6">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  {crecimientos[0].descripcion}
                </p>
              </div>
  
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs px-2 py-0">
                  {nivel?.nivel}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {
                  // formatDuration(podcast.duration)
                  }
                </span>
                <div className="flex-1" />
                {/*podcast.isDownloaded ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Download className="w-4 h-4 text-muted-foreground" />
                )*/}
              </div>
            </div>
          </div>
  
          {/* Progress bar */}
          {/*podcast.progress > 0 && (
            <div className="px-3 pb-3">
              <Progress 
                value={podcast.progress * 100} 
                className="h-1"
              />
            </div>
          )*/}
        </CardContent>
      </Card>
    );
  } else {
    return <></>
  }
};
