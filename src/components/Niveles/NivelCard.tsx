import { Card, CardContent } from "@/components/ui/card";
import { NetworkContext } from "@/context/NetworkContext";
import Crecimientos from "@/database/crecimientos";
import Niveles from "@/database/niveles";
import { db } from "@/hooks/useDexie";
import { cn } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { BookmarkCheck, Download, Lock, Play, Save } from "lucide-react";
import { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Progress } from "../ui/progress";

interface Props {
  nivel: Niveles;
  minOrden: number | null;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  return `${mins} min`;
};

export const NivelCard = ({ nivel, minOrden }: Props) => {
  const { baseURL, AudioNoWifi, status } = useContext(NetworkContext);

  const { user } = useSelector((state: any) => state.user);
  const myCrecimiento = useMemo(() => {
    return user.crecimientos?.find(
      (c: any) => c.nivel?.canales_id == nivel?.canal?.id
    );
  }, [user, nivel]);

  const isCompleted = useMemo(() => {
    if (!myCrecimiento) return false;
    return myCrecimiento.nivel?.orden > nivel?.orden;
  }, [myCrecimiento, nivel]);

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

  const podcast = useMemo(() => {
    if (!crecimientos) return null;

    const index = crecimientos.findIndex((c) => c.id == myCrecimiento?.id);
    if (index === -1) {
      return crecimientos[0];
    }

    return crecimientos[index];
  }, [crecimientos, myCrecimiento]);

  const progress = useMemo(() => {
    if (!crecimientos) return null;

    const index = crecimientos.findIndex((c) => c.id == myCrecimiento?.id);
    if (index === -1) {
      return null;
    }

    const progress = index / (crecimientos.length - 1);
    return progress;
  }, [crecimientos, myCrecimiento]);

  const isFirstNivel = nivel?.orden === minOrden;

  const canPlay =
    (isFirstNivel && !myCrecimiento) ||
    nivel.id == myCrecimiento?.nivel.id ||
    isCompleted;

  if (crecimientos?.length) {
    return (
      <Card className={cn(
        "overflow-hidden border-border/50 hover:shadow-soft transition-shadow",
        !canPlay && "opacity-90 grayscale-[0.5]"
      )}>
        <CardContent className="p-0">
          <Link
            to={canPlay ? `/niveles/${nivel.id}/crecimientos` : "#"}
            className={cn(
              "flex gap-3 p-3 transition-colors",
              canPlay ? "hover:bg-accent/50 cursor-pointer" : "cursor-default"
            )}
            onClick={(e) => !canPlay && e.preventDefault()}
          >
            {/* Cover Image */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted">
                <img
                  src={status ? baseURL + podcast?.imagen : AudioNoWifi}
                  alt={podcast?.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
              {canPlay ? (
                <div className="absolute inset-0 m-auto w-10 h-10 flex items-center justify-center rounded-full bg-primary/90 shadow-medium">
                  <Play className="w-4 h-4 text-primary-foreground fill-current" />
                </div>
              ) : (
                <div className="absolute inset-0 m-auto w-10 h-10 flex items-center justify-center rounded-full bg-muted/90 shadow-medium">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
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
                {nivel.id == myCrecimiento?.nivel.id || progress || isCompleted ? (
                  podcast?.audio_local ? (
                    <Save className="w-4 h-4 text-success" />
                  ) : (
                    <Download className="w-4 h-4 text-muted-foreground" />
                  )
                ) : null}
              </div>
            </div>
          </Link>

          {/* Progress bar */}
          {nivel.id == myCrecimiento?.nivel.id || progress || isCompleted ? (
            podcast?.audio_local ? null : (
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
