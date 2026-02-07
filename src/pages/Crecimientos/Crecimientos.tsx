import { AppLayout } from "@/components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { NetworkContext } from "@/context/NetworkContext";
import Canales from "@/database/canales";
import Comunidades from "@/database/comunidades";
import Niveles from "@/database/niveles";
import { destroy } from "@/helpers/musicControls";
import { useBackButton } from "@/hooks/useBackButton";
import { db } from "@/hooks/useDexie";
import { mockPodcasts } from "@/lib/mockData";
import { setShowGlobalAudio } from "@/store/slices/audioSlice";
import { useLiveQuery } from "dexie-react-hooks";
import {
  ArrowLeft,
  Download,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Trash2,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

type Props = {
  nivel: Niveles | undefined;
  canal: Canales | undefined;
  comunidad: Comunidades | undefined;
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const Crecimientos: React.FC = () => {
  const { AudioNoWifi, baseURL, status } = useContext(NetworkContext);

  const { user } = useSelector((state: any) => state.user);

  const { id } = useParams<any>();
  const dispatch = useDispatch();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const nivel = useLiveQuery(
    () => db.niveles.where("id").equals(Number(id)).first(),
    [id]
  );

  const community = useLiveQuery(
    () => {
      if(!nivel) return;
      return db.comunidades
        .where("id")
        .equals(Number(nivel?.canal?.comunidades_id))
        .first()
    },
    [nivel]
  );

  const crecimientos = useLiveQuery(
    () =>
      db.crecimientos
        .toArray()
        .then((lista: any[]) => {
          // swiper.slideTo(0);
          return lista;
        })
        .then((resultados: any[]) => {
          return resultados
            .filter((r: any) => r.nivel?.id == Number(id))
            .map((item: any) => {
              return { ...item, playing: false };
            });
        })
        .then((resultados: any[]) => {
          if (user.crecimientos_id) {
            const idx = resultados.findIndex(
              (x: any) => x.id == user.crecimientos_id
            );
            // swiper.slideTo(idx);
          }

          return resultados;
        }),
    [id]
  );

  const communityPodcasts = mockPodcasts.filter(
    (p) => p.communityId === community?.id
  );
  const currentIndex = communityPodcasts.findIndex((p) => p.id === 1);

  const progress = (currentTime / 1) * 100;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      // navigate(`/comunidades/${comunidad?.id}/podcasts/${communityPodcasts[currentIndex - 1].id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < communityPodcasts.length - 1) {
      // navigate(`/comunidades/${communityId}/podcasts/${communityPodcasts[currentIndex + 1].id}`);
    }
  };

  useEffect(() => {
    dispatch(setShowGlobalAudio(true));

    return () => {
      destroy();
    };
  }, []);

  useBackButton(`/niveles/${id}/crecimientos`);

  if (!nivel) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Nivel no encontrado</p>
        </div>
      </AppLayout>
    );
  }

  if (!crecimientos?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No hay contenido aún en este nivel
        </p>
      </div>
    );
  }

  return (
    <AppLayout hideNav>
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <Link to={`/canales/${nivel?.canal?.id}/niveles`} replace={true}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <span className="text-sm text-muted-foreground font-medium">
            {community?.comunidad}
          </span>

          <Avatar className="w-10 h-10">
            <AvatarImage
              className="object-cover w-full h-full"
              src={baseURL + community?.lider?.photo}
              alt={community?.lider?.name}
            />
            <AvatarFallback>{community?.lider?.name[0]}</AvatarFallback>
          </Avatar>
        </div>

        {/* Cover Image */}
        <div className="flex-1 flex items-center justify-center px-8 py-6">
          <div className="w-full max-w-[480px] aspect-square rounded-3xl overflow-hidden shadow-glow">
            <img
              src={status ? baseURL + crecimientos[0]?.imagen : AudioNoWifi}
              alt={crecimientos[0]?.titulo}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info & Controls */}
        <div className="px-6 pb-8 space-y-6">
          {/* Title & Level */}
          <div className="text-center space-y-2">
            <h1 className="text-xl font-heading font-bold text-foreground !m-0">
              {crecimientos[0]?.titulo}
            </h1>
            <span className="text-xs font-heading text-foreground">
              {nivel?.nivel}
            </span>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {crecimientos[0]?.descripcion}
            </p>

            {/* Level Selector */}
            <div className="flex justify-center pt-2">
              <Button size="sm" className="gap-1" variant="outline">
                {community?.isDownloaded ? (
                  <>
                    {" "}
                    <Trash2 className="w-5 h-5 text-success" /> Eliminar
                    Descarga{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <Download className="w-5 h-5" /> Descargar{" "}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              onValueChange={(value) => setCurrentTime((value[0] / 100) * 1)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(1)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="w-12 h-12"
            >
              <SkipBack className="w-6 h-6" />
            </Button>

            <Button
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 !rounded-full bg-primary hover:bg-primary/90 shadow-glow"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 text-primary-foreground" />
              ) : (
                <Play className="w-7 h-7 text-primary-foreground ml-1" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex === communityPodcasts.length - 1}
              className="w-12 h-12"
            >
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Crecimientos;
