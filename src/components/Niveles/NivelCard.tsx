import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NetworkContext } from "@/context/NetworkContext";
import Crecimientos from "@/database/crecimientos";
import Niveles from "@/database/niveles";
import { db } from "@/hooks/useDexie";
import { useLiveQuery } from "dexie-react-hooks";
import { BookmarkCheck, Check, Download, Play } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Progress } from "../ui/progress";

interface Props {
  nivel: Niveles;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  return `${mins} min`;
};

export const NivelCard = ({ nivel }: Props) => {
  const { baseURL, AudioNoWifi, status } = useContext(NetworkContext);

  const { user } = useSelector((state: any) => state.user);
  const [podcast, setPodcast] = useState<Crecimientos | null>(null);

  const myCrecimiento = useMemo(() => {
    return user.crecimientos[0];
  }, [user]);

  const isCompleted = myCrecimiento?.nivel.id > nivel.id;

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
        }),
    [nivel]
  );

  const progress = useMemo(() => {
    if (!crecimientos) return null;

    const index = crecimientos.findIndex((c) => c.id == myCrecimiento?.id);
    if (index === -1) {
      setPodcast(crecimientos[0]);
      return null;
    }

    setPodcast(crecimientos[index]);

    const progress = index / (crecimientos.length - 1);
    return progress;
  }, [crecimientos, myCrecimiento]);

  if (crecimientos?.length) {
    return (
      <Card className="overflow-hidden border-border/50 hover:shadow-soft transition-shadow">
        <CardContent className="p-0">
          <div className="flex gap-3 p-3">
            {/* Cover Image */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted">
                <img
                  src={status ? baseURL + podcast?.imagen : AudioNoWifi}
                  alt={podcast?.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
              {(nivel.id == myCrecimiento?.nivel.id ||
                isCompleted ||
                (myCrecimiento?.nivel.orden === 0 && nivel.orden === 1)) && (
                  <Link to={`/niveles/${nivel.id}/crecimientos`}>
                    <Button
                      size="icon"
                      className="absolute inset-0 m-auto w-10 h-10 !rounded-full bg-primary/90 hover:bg-primary shadow-medium"
                    >
                      <Play className="w-4 h-4 text-primary-foreground fill-current" />
                    </Button>
                  </Link>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-foreground !text-sm line-clamp-1 !m-0">
                    {podcast?.titulo}
                  </h3>
                  {isCompleted && (
                    <BookmarkCheck className="w-4 h-4 text-success" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  {podcast?.descripcion}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span className="font-semibold text-xs">{nivel?.nivel}</span>
                <span className="text-xs text-muted-foreground">
                  {
                    // formatDuration(podcast?.duration)
                  }
                </span>
                <div className="flex-1" />
                {nivel.id == myCrecimiento?.nivel.id || progress ? (
                  podcast?.audio_local ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Download className="w-4 h-4 text-muted-foreground" />
                  )
                ) : null}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {nivel.id == myCrecimiento?.nivel.id || progress ? (
            podcast?.audio_local ? (
              null
            ) : (
              <div className="px-3 pb-3">
                <Progress
                  value={(progress ?? (isCompleted ? 1 : 0)) * 100}
                  className="h-1"
                />
              </div>
            )
          ) : null}

        </CardContent>
      </Card>
    );
  } else {
    return <></>;
  }
};
