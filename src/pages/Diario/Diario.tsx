import { AppLayout } from "@/components/layout";
import Diario, { FeedbackManana } from "@/database/diario";
import { useBackButton } from "@/hooks/useBackButton";
import { useDiario } from "@/hooks/useDiario";
import { ArrowLeft, BookText } from "lucide-react";
import React from "react";
import { useHistory } from "react-router-dom";

const FEEDBACK_LABEL: Record<FeedbackManana, string> = {
  igual: "Igual",
  algo_mejor: "Algo mejor",
  mucho_mejor: "Mucho mejor",
};

function formatFecha(fecha: string) {
  const d = new Date(`${fecha}T00:00:00`);
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "long" });
}

const DiarioPage: React.FC = () => {
  const history = useHistory();
  useBackButton("/perfil");

  const { entries } = useDiario();

  return (
    <AppLayout>
      <div className="min-h-full flex flex-col bg-background">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3.5 safe-top">
          <div className="flex items-center gap-2">
            <button
              onClick={() => history.replace("/perfil")}
              className="w-9 h-9 -ml-1.5 rounded-full flex items-center justify-center text-foreground hover:bg-muted active:scale-95 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display font-semibold text-lg text-foreground">
              Mi diario
            </h1>
          </div>
        </header>

        <div className="flex-1 flex flex-col w-full max-w-md mx-auto px-4 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+3rem)] safe-bottom">
          <p className="text-sm text-muted-foreground mb-6">
            Tus cierres de día, ordenados por fecha.
          </p>

          {entries.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BookText className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground max-w-[260px] leading-relaxed">
                Todavía no tienes entradas. Cierra tu día en "Mi noche guiada" y
                aparecerá aquí.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {entries.map((e: Diario) => {
                const meta: string[] = [];
                if (e.estado_emocional) meta.push(`Estado: ${e.estado_emocional}`);
                if (e.audio_escuchado?.titulo)
                  meta.push(`Escuchado: "${e.audio_escuchado.titulo}"`);
                else if (e.audio_recomendado?.titulo)
                  meta.push(`Recomendado: "${e.audio_recomendado.titulo}"`);
                if (e.feedback_manana)
                  meta.push(`Mañana: ${FEEDBACK_LABEL[e.feedback_manana]}`);

                return (
                  <div
                    key={e.id}
                    className="bg-card rounded-2xl p-4 border border-border/60 shadow-card"
                  >
                    <p className="text-xs font-bold text-primary uppercase tracking-wide mb-1.5">
                      {formatFecha(e.fecha)}
                    </p>

                    {e.texto_cierre_dia ? (
                      <p className="text-sm text-foreground leading-relaxed mb-2">
                        {e.texto_cierre_dia}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic mb-2">
                        Sin texto ese día.
                      </p>
                    )}

                    {meta.length > 0 && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {meta.join(" · ")}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default DiarioPage;
