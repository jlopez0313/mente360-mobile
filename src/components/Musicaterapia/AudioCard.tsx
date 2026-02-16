import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NetworkContext } from "@/context/NetworkContext";
import Clips from "@/database/clips";
import Likes from "@/database/likes";
import { formatCount } from "@/helpers/Format";
import { useAudio } from "@/hooks/useAudio";
import { db } from "@/hooks/useDexie";
import { cn } from "@/lib/utils";
import { dislike, like } from "@/services/likes";
import {
  setAudioSrc,
  setGlobalAudio,
  setGlobalPos,
  setIsGlobalPlaying,
} from "@/store/slices/audioSlice";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Check,
  Download,
  Heart,
  MoreVertical,
  Pause,
  Play,
  Share2,
  Star,
} from "lucide-react";
import { useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MusicBar from "../Shared/MusicBar/MusicBar";

interface AudioCardProps {
  idx: number;
  track: Clips;
  isPlaying: boolean;
}

export const AudioCard = ({ idx, track }: AudioCardProps) => {
  const { AudioNoWifi, baseURL, status } = useContext(NetworkContext);
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const { globalAudio, isGlobalPlaying } = useSelector(
    (state: any) => state.audio
  );

  const isPlaying = globalAudio?.id === track.id && isGlobalPlaying;

  const audioRef: any = useRef({
    currentTime: 0,
    duration: 0,
    pause: () => {},
    play: () => {},
    fastSeek: (time: number) => {},
  });

  const {
    duration,
    onShareLink,
    onLoadedMetadata,
    onTimeUpdate,
    onUpdateBuffer,
    downloadAudio,
    deleteAudio,
    getDownloadedAudio,
    onTogglePlaylist,
  } = useAudio(audioRef, () => {});

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

  const inMyPlaylist = useLiveQuery(() =>
    db.playlist
      .where("users_id")
      .equals(user.id)
      .and((playlist: any) => playlist?.clip?.id === track.id)
      .first()
  );

  // Download Management
  const onToggleDownload = () => {
    if (track.audio_local) {
      onRemoveLocal();
    } else {
      onDownload();
    }
  };

  const onDownload = async () => {
    try {
      const ruta = await downloadAudio(
        baseURL + track.audio,
        "audio_" + track.id,
        async (p: any) => {
          /// setPercent(p);
        }
      );

      if (!ruta) {
        throw new Error("No se pudo descargar el audio");
      }

      console.log("Ruta es ", ruta);
      // setPercent(0);

      await db.clips.update(track.id, {
        imagen_local: track.imagen,
        audio_local: ruta,
        downloaded: 1,
      });
    } catch (error) {
      console.log(" error ondownload", error);
    }
  };

  const onRemoveLocal = async () => {
    await deleteAudio(track.audio_local);

    await db.crecimientos.update(track.id, {
      imagen_local: "",
      audio_local: "",
      downloaded: 0,
    });
  };

  // Likes Management
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

  // Playlist Management
  const handleTogglePlaylist = async () => {
    const playlistToggled = await onTogglePlaylist(track, inMyPlaylist);
    if (playlistToggled) {
      dispatch(setGlobalAudio({ ...track, inMyPlaylist: playlistToggled }));
    } else {
      dispatch(setGlobalAudio({ ...track, inMyPlaylist: null }));
    }
  };

  // Playback Management
  const onTooglePlay = async () => {
    if (isPlaying) {
      dispatch(setIsGlobalPlaying(false));
    } else {
      if (track.audio_local) {
        const audioBlob = await getDownloadedAudio(track.audio_local);
        dispatch(setAudioSrc(audioBlob));
      } else {
        dispatch(setAudioSrc(baseURL + track.audio));
      }

      dispatch(setGlobalPos(idx));
      dispatch(
        setGlobalAudio({
          ...track,
          inMyPlaylist,
        })
      );
      dispatch(setIsGlobalPlaying(true));
    }
  };

  return (
    <Card
      className={cn(
        "overflow-hidden border-border/50 transition-all",
        globalAudio?.id == track.id && "border-primary/50 bg-primary/5"
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-center gap-3 p-3">
          {/* Cover & Play */}
          <div className="relative shrink-0" onClick={onTooglePlay}>
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted">
              <img
                src={status ? baseURL + track.imagen : AudioNoWifi}
                alt={track.titulo}
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              size="icon"
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
          <div className="flex-1 min-w-0" onClick={onTooglePlay}>
            <div className="flex gap-1 items-end">
              {globalAudio?.id == track.id && (
                <MusicBar paused={!isGlobalPlaying} />
              )}{" "}
              <h6 className="!m-0 font-semibold text-foreground truncate">
                {track.titulo}
              </h6>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {track.categoria?.categoria}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">{duration}</span>
              {track.audio_local && <Check className="w-3 h-3 text-success" />}
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
                <DropdownMenuItem onClick={handleTogglePlaylist}>
                  {inMyPlaylist ? (
                    <>
                      <Star className="w-4 h-4 mr-2 fill-yellow-500 text-yellow-500" />
                      Quitar de favoritos
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4 mr-2" />
                      Agregar a favoritos
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShareLink(track.id)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onToggleDownload}>
                  {track.audio_local ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-success" />
                      Eliminar Descarga
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
          src={track?.audio_local ? track.audio_local : baseURL + track?.audio}
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
          onProgress={onUpdateBuffer}
          // onEnded={() => onSaveNext(activeIndex)}
        />
      </CardContent>
    </Card>
  );
};
