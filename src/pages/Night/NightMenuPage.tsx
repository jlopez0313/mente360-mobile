import { AppLayout } from "@/components/layout";
import { useBackButton } from "@/hooks/useBackButton";
import { useIonAlert } from "@ionic/react";
import {
  ArrowLeft,
  ChevronRight,
  ListOrdered,
  Moon,
  Music,
  Sparkles,
} from "lucide-react";
import React from "react";
import { useHistory } from "react-router-dom";

const NightMenuPage: React.FC = () => {
  const history = useHistory();
  const [presentAlert] = useIonAlert();

  useBackButton("/home");

  const handleGuidedNightClick = () => {
    presentAlert({
      header: "Mi noche guiada",
      subHeader: "Próximamente disponible",
      message:
        "Estamos preparando audios exclusivos de hipnosis sanadora personalizados para cada emoción y estado de ánimo.",
      buttons: ["Entendido"],
    });
  };

  return (
    <AppLayout>
      <div className="min-h-full bg-background safe-top safe-bottom overflow-x-hidden">
        <div className="mx-auto w-full max-w-md px-6 pt-4 pb-12">
          {/* Back */}
          <button
            onClick={() => history.replace("/home")}
            className="w-9 h-9 -ml-1.5 rounded-full flex items-center justify-center text-foreground hover:bg-muted active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Hero */}
          <div className="flex flex-col items-center text-center mt-6 mb-12">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-night/5 flex items-center justify-center">
                <Moon className="w-10 h-10 text-night fill-night -rotate-12" />
              </div>
              <Sparkles className="absolute top-0 -right-0.5 w-3.5 h-3.5 text-night/70" />
              <Sparkles className="absolute bottom-1.5 -left-0.5 w-2.5 h-2.5 text-night/45" />
            </div>

            <h1 className="text-2xl font-bold font-display text-foreground tracking-tight mb-2">
              Mi noche
            </h1>
            <p className="text-sm text-muted-foreground max-w-[260px] leading-relaxed">
              Elige cómo quieres vivir tu experiencia esta noche.
            </p>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-4">
            {/* Mi secuencia nocturna */}
            <button
              onClick={() => history.push("/mi-noche/secuencia")}
              className="w-full text-left bg-[#0B1536] !rounded-3xl p-4 shadow-card hover:shadow-elevated active:scale-[0.98] transition-all flex items-center gap-3.5 group"
            >
              <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#0B1536] flex-shrink-0">
                <ListOrdered className="w-[22px] h-[22px]" />
              </div>
              <div className="flex-1 min-w-0 pr-1">
                <h2 className="text-[15px] font-bold font-display text-white leading-tight mb-1">
                  Mi secuencia nocturna
                </h2>
                <p className="text-xs text-white/65 leading-snug">
                  Continúa tu serie de audios de noche. Cada día un paso más en tu
                  camino.
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/45 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Mi noche guiada */}
            <button
              onClick={() => history.push("/mi-noche/guiada")}
              className="w-full text-left bg-[#5B4394] !rounded-3xl p-4 shadow-card hover:shadow-elevated active:scale-[0.98] transition-all flex items-center gap-3.5 group"
            >
              <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#5B4394] flex-shrink-0">
                <Sparkles className="w-[22px] h-[22px]" />
              </div>
              <div className="flex-1 min-w-0 pr-1">
                <h2 className="text-[15px] font-bold font-display text-white leading-tight mb-1">
                  Mi noche guiada
                </h2>
                <p className="text-xs text-white/65 leading-snug">
                  Cierra tu día, cuéntanos cómo te sientes y recibe un audio
                  recomendado para esta noche.
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/45 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Explorar hipnosis sanadoras */}
            <button
              onClick={() => history.push("/musicaterapia")}
              className="w-full text-left bg-card !rounded-3xl p-4 border border-border/60 shadow-card hover:shadow-elevated active:scale-[0.98] transition-all flex items-center gap-3.5 group"
            >
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Music className="w-[22px] h-[22px]" />
              </div>
              <div className="flex-1 min-w-0 pr-1">
                <h2 className="text-[15px] font-bold font-display text-foreground leading-tight mb-1">
                  Explorar hipnosis sanadoras
                </h2>
                <p className="text-xs text-muted-foreground leading-snug">
                  Ver todos los audios disponibles en Musicoterapia
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/70 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default NightMenuPage;
