import { AppLayout } from "@/components/layout";
import { FeedbackManana } from "@/database/diario";
import { useBackButton } from "@/hooks/useBackButton";
import { useDiario } from "@/hooks/useDiario";
import { ArrowLeft, Headphones, Smile, Sparkles, Sunrise } from "lucide-react";
import React from "react";
import { useHistory, useParams } from "react-router-dom";

const FEEDBACK_LABEL: Record<FeedbackManana, string> = {
  igual: "Igual — me costó descansar",
  algo_mejor: "Algo mejor",
  mucho_mejor: "Mucho mejor",
};

function formatFechaLarga(fecha: string) {
  const d = new Date(`${fecha}T00:00:00`);
  return d.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const Row: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}> = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 p-4">
      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
};

const DiarioDetailPage: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  useBackButton("/diario");

  const { entries } = useDiario();
  const entry = entries.find((e) => String(e.id) === String(id));

  return (
    <AppLayout>
      <div className="min-h-full flex flex-col bg-background">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3.5 safe-top">
          <div className="flex items-center gap-2">
            <button
              onClick={() => history.replace("/diario")}
              className="w-9 h-9 -ml-1.5 shrink-0 rounded-full flex items-center justify-center text-foreground hover:bg-muted active:scale-95 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-display font-semibold text-lg text-foreground">
              Entrada del diario
            </h1>
          </div>
        </header>

        <div className="flex-1 w-full max-w-md mx-auto px-4 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+3rem)] safe-bottom">
          {!entry ? (
            <p className="text-sm text-muted-foreground text-center py-16">
              No se encontró la entrada.
            </p>
          ) : (
            <>
              <p className="text-xs font-bold text-primary uppercase tracking-wide mb-4">
                {formatFechaLarga(entry.fecha)}
              </p>

              <div className="bg-card rounded-2xl border border-border/60 shadow-card p-4 mb-4">
                {entry.texto_cierre_dia ? (
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {entry.texto_cierre_dia}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No escribiste nada ese día.
                  </p>
                )}
              </div>

              <div className="bg-card rounded-2xl border border-border/60 shadow-card divide-y divide-border">
                <Row
                  icon={<Smile className="w-5 h-5" />}
                  label="Estado emocional"
                  value={entry.estado_emocional}
                />
                <Row
                  icon={<Sparkles className="w-5 h-5" />}
                  label="Audio recomendado"
                  value={entry.audio_recomendado?.titulo}
                />
                <Row
                  icon={<Headphones className="w-5 h-5" />}
                  label="Audio escuchado"
                  value={entry.audio_escuchado?.titulo}
                />
                <Row
                  icon={<Sunrise className="w-5 h-5" />}
                  label="Al día siguiente"
                  value={
                    entry.feedback_manana
                      ? FEEDBACK_LABEL[entry.feedback_manana]
                      : null
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default DiarioDetailPage;
