import { Button } from "@/components/ui/button";
import { NetworkContext } from "@/context/NetworkContext";
import Clips from "@/database/clips";
import Likes from "@/database/likes";
import { formatCount } from "@/helpers/Format";
import { useAudio } from "@/hooks/useAudio";
import { db } from "@/hooks/useDexie";
import { cn } from "@/lib/utils";
import { dislike, like } from "@/services/likes";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Check,
  Download,
  Heart,
  ListMinus,
  MoreVertical,
  Pause,
  Play,
  Share2
} from "lucide-react";
import { useContext, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface TrackCardProps {
  track: Clips;
  currentTrackId: number | undefined;
  onPlay: () => void;
  onToggleLike: () => void;
  onTogglePlaylist: () => void;
  onDownload: () => void;
}

export const FavoriteItem = ({
  track,
  currentTrackId,
  onPlay,
  onTogglePlaylist,
  onDownload,
}: TrackCardProps) => {
  const { baseURL, status, AudioNoWifi } = useContext(NetworkContext);
  const { user } = useSelector((state: any) => state.user);

  const audioRef: any = useRef({
    currentTime: 0,
    duration: 0,
    pause: () => {},
    play: () => {},
    fastSeek: (time: number) => {},
  });

  const { duration, isPlaying, onLoadedMetadata, onTimeUpdate, onUpdateBuffer } = useAudio(
    audioRef,
    () => {}
  );

  const [localSrc, setLocalSrc] = useState<any>(null);

  const likes = useLiveQuery(
    () => db.likes.where("clips_id").equals(track.id).toArray(),
    [track.id]
  );

  const my_like = useLiveQuery(
    () =>
      db.likes
        .where("users_id")
        .equals(user.id)
        .and((like: Likes) => like.clips_id === track.id)
        .first(),
    [user?.id, track.id]
  );

  const handleShare = async () => {
    try {
      await navigator.share({
        title: track.titulo,
        text: `Escucha "${track.titulo}" de la categoría ${
          track.categoria?.categoria
        } en ${import.meta.env.VITE_NAME}`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  const onToggleLike = async () => {
    if (my_like) {
      await onDislike();
    } else {
      await onLike();
    }
  };

  const onLike = async () => {
    try {
      const data = {
        clips_id: track.id,
        users_id: user.id,
      };

      const {
        data: { data: added },
      } = await like(data);

      await db.likes.add({
        ...data,
        id: added.id,
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  const onDislike = async () => {
    try {
      await dislike(my_like?.id ?? 0);
      await db.likes
        .where("id")
        .equals(my_like?.id ?? 0)
        .delete();
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Card
      className={cn(
        "overflow-hidden border-border/50 transition-all",
        currentTrackId === track.id && "border-primary bg-primary/5"
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-center gap-3 p-3">
          {/* Cover & Play */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted">
              <img
                src={status ? baseURL + track.imagen : AudioNoWifi}
                alt={track.titulo}
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              size="icon"
              onClick={onPlay}
              className={cn(
                "absolute inset-0 m-auto w-8 h-8 rounded-full shadow-medium",
                isPlaying
                  ? "bg-primary/90 hover:bg-primary"
                  : "bg-foreground/80 hover:bg-foreground"
              )}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 text-primary-foreground" />
              ) : (
                <Play className="w-3.5 h-3.5 text-background ml-0.5" />
              )}
            </Button>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h6 className="!m-1 font-semibold text-foreground truncate">
              {track.titulo}
            </h6>
            <p className="text-xs text-muted-foreground truncate">
              {track.categoria?.categoria}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">{duration}</span>
              {track.isDownloaded && <Check className="w-3 h-3 text-success" />}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleLike}
              className="w-8 h-8 gap-1"
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-colors",
                  my_like ? "fill-sos text-sos" : "text-muted-foreground"
                )}
              />
              {likes?.length > 0 && formatCount(likes?.length)}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onTogglePlaylist}>
                  <ListMinus className="w-4 h-4 mr-2" />
                  Quitar de favoritos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDownload}>
                  {track.isDownloaded ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-success" />
                      Descargado
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Descargar offline
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={localSrc ? localSrc : baseURL + track?.audio}
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
          onProgress={onUpdateBuffer}
          // onEnded={() => onSaveNext(activeIndex)}
        />
      </CardContent>
    </Card>
  );
};
