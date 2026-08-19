import { Browser } from "@capacitor/browser";
import { ChevronRight, Link2 } from "lucide-react";

interface CadenaDelBienCardProps {
  titulo?: string;
  descripcion?: string;
  link?: string;
}

export function CadenaDelBienCard({ titulo, descripcion, link }: CadenaDelBienCardProps) {
  if (!titulo) {
    return null;
  }

  const handleClick = async () => {
    if (!link) return;
    await Browser.open({ url: link });
  };

  return (
    <div className="px-4 pb-4">
      <button
        onClick={handleClick}
        disabled={!link}
        className="w-full text-left !bg-card shadow-card !rounded-2xl active:scale-[0.98] transition-transform disabled:opacity-60 disabled:pointer-events-none"
      >
        <div className="p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full flex items-center justify-center gradient-primary flex-shrink-0">
            <Link2 className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground leading-tight">{titulo}</p>
            {descripcion && (
              <p className="text-sm text-muted-foreground line-clamp-2">{descripcion}</p>
            )}
          </div>

          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </div>
      </button>
    </div>
  );
}
