import { getYoutubeVideoId, goToYoutube } from "@/helpers/Video";
import { cn } from "@/lib/utils";
import { Browser } from "@capacitor/browser";
import { ExternalLink, Play, X } from "lucide-react";
import React, { useState } from "react";

interface Props {
  /** URL o ID del video de YouTube. */
  video?: string | null;
  /** Imagen a mostrar si no se puede resolver el ID. */
  fallback?: string;
  className?: string;
}

/**
 * Video de YouTube inline con patrón "facade": primero se ve la miniatura
 * con un botón de play; al tocarlo se monta el <iframe> con autoplay.
 *
 * Se usa youtube-nocookie.com + playsinline=1: dentro del WebView de
 * Capacitor el embed normal de youtube.com puede fallar con "Error 153"
 * (el origin capacitor://localhost no es válido y la validación es más
 * estricta en algunas regiones, p. ej. EE.UU.). El dominio nocookie y
 * montar el iframe recién con el gesto del usuario lo evita en la mayoría
 * de casos.
 */
export const YoutubePreview: React.FC<Props> = ({
  video,
  fallback,
  className,
}) => {
  const [playing, setPlaying] = useState(false);
  const id = getYoutubeVideoId(video ?? "");
  const thumb = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : fallback;

  const openExternal = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!video) return;
    const url = goToYoutube(video);
    try {
      await Browser.open({ url, presentationStyle: "popover" });
    } catch {
      window.open(url, "_blank");
    }
  };

  if (playing && id) {
    return (
      // z-20: por encima del badge/logo de la card, para que TODA el área del
      // video reciba los toques (controles de YouTube).
      // isolation + translateZ: fuerza una capa propia y evita el bug de iOS
      // WKWebView donde un <iframe> recortado por overflow:hidden + border-radius
      // deja de recibir eventos táctiles.
      <div
        className={cn("absolute inset-0 z-20 w-full h-full bg-black", className)}
        style={{ isolation: "isolate" }}
      >
        <iframe
          className="w-full h-full"
          style={{ transform: "translateZ(0)", willChange: "transform" }}
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`}
          title="Video de YouTube"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          frameBorder="0"
        />

        {/* Cerrar: desmonta el iframe => detiene la reproducción y vuelve a la miniatura */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPlaying(false);
          }}
          aria-label="Cerrar video"
          className="absolute top-1.5 left-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white active:scale-95"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Salida al reproductor nativo por si el embed falla */}
        <button
          type="button"
          onClick={openExternal}
          className="absolute bottom-1.5 right-1.5 z-10 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[10px] font-semibold text-white"
        >
          <ExternalLink className="w-3 h-3" />
          YouTube
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => (id ? setPlaying(true) : openExternal())}
      className={cn(
        "group absolute inset-0 block w-full h-full bg-black",
        className
      )}
    >
      {thumb && (
        <img
          src={thumb}
          alt="Video de YouTube"
          className="w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/25 group-active:bg-black/35 transition-colors flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-[#FF0000] flex items-center justify-center shadow-lg">
          <Play className="w-6 h-6 text-white fill-white ml-1" />
        </div>
      </div>
    </button>
  );
};
