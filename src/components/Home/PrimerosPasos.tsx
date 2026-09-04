import { useOnboardingProgress } from "@/hooks/useOnboardingTips";
import { ONBOARDING_TIPS } from "@/lib/onboardingTips";
import { useIonViewWillEnter } from "@ionic/react";
import { Check, ChevronRight } from "lucide-react";
import { useHistory } from "react-router-dom";

/**
 * Checklist "Primeros pasos" en Home: empuja a explorar cada sección grande
 * de la app. Un paso se marca hecho apenas se visita/descarta el tip de esa
 * pantalla (comparte storage con TipCard — no hay una acción extra de
 * "completar"). Se oculta sola cuando ya se visitaron todas.
 */
export const PrimerosPasos: React.FC = () => {
  const history = useHistory();
  const { seen, refresh, doneCount, total } = useOnboardingProgress();

  // Home vive dentro de IonTabs y no se desmonta al cambiar de pestaña; sin
  // esto el checklist quedaría con el progreso de la primera carga.
  useIonViewWillEnter(() => {
    refresh();
  });

  if (doneCount >= total) return null;

  return (
    <div className="px-4 pb-4">
      <div className="bg-card rounded-2xl border border-border/60 shadow-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">Primeros pasos</h2>
          <span className="text-xs font-semibold text-muted-foreground">
            {doneCount}/{total}
          </span>
        </div>

        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-1">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(doneCount / total) * 100}%` }}
          />
        </div>

        <div className="flex flex-col divide-y divide-border/40">
          {ONBOARDING_TIPS.map((tip) => {
            const done = !!seen[tip.key];
            const Icon = tip.icon;

            return (
              <button
                key={tip.key}
                onClick={() => history.push(tip.route)}
                className="flex items-center gap-3 py-2.5 text-left"
              >
                <div
                  className={
                    done
                      ? "w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
                      : "w-6 h-6 rounded-full border-2 border-border flex items-center justify-center flex-shrink-0"
                  }
                >
                  {done ? (
                    <Check className="w-3.5 h-3.5 text-primary-foreground" />
                  ) : (
                    <Icon className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
                <span
                  className={
                    done
                      ? "flex-1 text-sm text-muted-foreground line-through"
                      : "flex-1 text-sm text-foreground font-medium"
                  }
                >
                  {tip.title}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground/60 flex-shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
