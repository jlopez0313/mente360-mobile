import { Browser } from "@capacitor/browser";
import { ChevronRight, ExternalLink, FileText, Image as ImageIcon, Play } from "lucide-react";

interface FeaturedContentCardProps {
  titulo?: string;
  descripcion?: string;
  tipo?: "imagen" | "video" | "texto" | "link";
  contenido_url?: string;
  link?: string;
}

const iconByTipo = {
  imagen: ImageIcon,
  video: Play,
  texto: FileText,
  link: ExternalLink,
};

export function FeaturedContentCard({
  titulo,
  descripcion,
  tipo,
  contenido_url,
  link,
}: FeaturedContentCardProps) {
  if (!titulo || !tipo) {
    return null;
  }

  const handleClick = async () => {
    if (!link) return;
    await Browser.open({ url: link });
  };

  const showThumbnail = (tipo === "imagen" || tipo === "video") && contenido_url;
  const Icon = iconByTipo[tipo];

  return (
    <div className="px-4 pb-4">
      <button
        onClick={handleClick}
        disabled={!link}
        className="w-full text-left bg-card !rounded-2xl border border-border overflow-hidden shadow-card active:scale-[0.98] transition-transform disabled:opacity-60 disabled:pointer-events-none"
      >
        <div className="p-4 flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
            {showThumbnail ? (
              <img src={contenido_url} alt={titulo} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <Icon className="w-7 h-7 text-primary/60" />
              </div>
            )}
            {tipo === "video" && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center gradient-morning">
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground leading-tight line-clamp-2">{titulo}</p>
            {descripcion && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{descripcion}</p>
            )}
          </div>

          {link && <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
        </div>
      </button>
    </div>
  );
}
