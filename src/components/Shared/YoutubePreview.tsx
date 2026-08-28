import { getYoutubeVideoId, goToYoutube } from "@/helpers/Video";
import { cn } from "@/lib/utils";
import { Browser } from "@capacitor/browser";
import { Play } from "lucide-react";
import React from "react";

interface Props {
  /** URL o ID del video de YouTube. */
  video?: string | null;
  /** Imagen a mostrar si no se puede resolver el ID. */
  fallback?: string;
  className?: string;
}

/**
 * Miniatura de un video de YouTube con botón de play. Al tocar abre el video
 * en el navegador del sistema / app de YouTube.
 *
 * Reemplaza al <iframe> embebido: dentro del WebView de Capacitor el player
 * embebido falla con "Error 153 / Video player configuration error" (el origin
 * capacitor://localhost no es válido para YouTube, y la validación es más
 * estricta en algunas regiones como EE.UU.).
 */
export const YoutubePreview: React.FC<Props> = ({
  video,
  fallback,
  className,
}) => {
  const id = getYoutubeVideoId(video ?? "");
  const thumb = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : fallback;

  const open = async () => {
    if (!video) return;
    const url = goToYoutube(video);
    try {
      await Browser.open({ url, presentationStyle: "popover" });
    } catch {
      window.open(url, "_blank");
    }
  };

  return (
    <button
      type="button"
      onClick={open}
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
