import { AppLayout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { useBackButton } from "@/hooks/useBackButton";
import { db } from "@/hooks/useDexie";
import { cn } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
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

const HIPNOSIS_CATEGORY_KEY = "hipnosis";

interface NightOption {
  key: string;
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
  cardClass: string;
  iconWrapClass: string;
  titleClass: string;
  descClass: string;
  chevronClass: string;
}

const NightMenuPage: React.FC = () => {
  const history = useHistory();

  useBackButton("/home");

  // Categoría "hipnosis sanadoras" de Musicoterapia (si no existe, no mostramos la card)
  const hipnosisCategory = useLiveQuery(async () => {
    const cats = await db.categorias.toArray();
    return (
      cats.find((c) =>
        (c.categoria || "").toLowerCase().includes(HIPNOSIS_CATEGORY_KEY)
      ) ?? null
    );
  });

  const goToHipnosis = () => {
    if (!hipnosisCategory?.id) return;
    sessionStorage.setItem(
      "musicaterapia_category",
      String(hipnosisCategory.id)
    );
    sessionStorage.setItem("musicaterapia_tab", "clips");
    sessionStorage.removeItem("musicaterapia_search");
    history.push("/musicaterapia");
  };

  const options: NightOption[] = [
    {
      key: "secuencia",
      title: "Mi secuencia nocturna",
      description:
        "Continúa tu serie de audios de noche. Cada día un paso más en tu camino.",
      icon: ListOrdered,
      onClick: () => history.push("/mi-noche/secuencia"),
      cardClass: "bg-[#0B1536] border-white/10",
      iconWrapClass: "bg-white text-[#0B1536]",
      titleClass: "text-white",
      descClass: "text-white/65",
      chevronClass: "text-white/45",
    },
    {
      key: "guiada",
      title: "Mi noche guiada",
      description:
        "Cierra tu día, cuéntanos cómo te sientes y recibe un audio recomendado para esta noche.",
      icon: Sparkles,
      onClick: () => history.push("/mi-noche/guiada"),
      cardClass: "bg-[#5B4394] border-white/10",
      iconWrapClass: "bg-white text-[#5B4394]",
      titleClass: "text-white",
      descClass: "text-white/65",
      chevronClass: "text-white/45",
    },
    ...(hipnosisCategory
      ? [
          {
            key: "explorar",
            title: "Explorar hipnosis sanadoras",
            description: "Ver todos los audios disponibles en Musicoterapia",
            icon: Music,
            onClick: goToHipnosis,
            cardClass: "bg-card border-border/60",
            iconWrapClass: "bg-primary/10 text-primary",
            titleClass: "text-foreground",
            descClass: "text-muted-foreground",
            chevronClass: "text-muted-foreground/70",
          } as NightOption,
        ]
      : []),
  ];

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
            {options.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.key}
                  onClick={opt.onClick}
                  className="w-full text-left rounded-3xl active:scale-[0.98] transition-transform"
                >
                  <Card
                    className={cn(
                      "rounded-3xl p-4 shadow-card flex items-center gap-3.5",
                      opt.cardClass
                    )}
                  >
                    <div
                      className={cn(
                        "w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0",
                        opt.iconWrapClass
                      )}
                    >
                      <Icon className="w-[22px] h-[22px]" />
                    </div>
                    <div className="flex-1 min-w-0 pr-1">
                      <h2
                        className={cn(
                          "text-[15px] font-bold font-display leading-tight mb-1",
                          opt.titleClass
                        )}
                      >
                        {opt.title}
                      </h2>
                      <p className={cn("text-xs leading-snug", opt.descClass)}>
                        {opt.description}
                      </p>
                    </div>
                    <ChevronRight
                      className={cn("w-4 h-4 flex-shrink-0", opt.chevronClass)}
                    />
                  </Card>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default NightMenuPage;
