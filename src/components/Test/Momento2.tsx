import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { memo, useState } from "react";

const questions = [
  {
    momento: "ZETA",
    texto:
      "Intentas mantener una mirada abierta o positiva. Buscas salidas, alternativas, posibilidades o una forma de no quedarte atrapado en lo negativo. Prefieres moverte hacia lo que da aire, alivio o sentido. A veces puedes evitar profundizar en lo doloroso o pasar rápido a otra cosa.",
  },
  {
    momento: "EPSILON",
    texto:
      "Intentas ordenar la situación y resolverla. Analizas, corriges, estructuras o haces lo necesario para que las cosas vuelvan a su lugar. Buscas claridad, control o coherencia. A veces puedes tensarte, volverte rígido o sentir frustración cuando no encuentras solución.",
  },
  {
    momento: "OMEGA",
    texto:
      "Vives el malestar con intensidad. Necesitas expresarlo, confrontarlo o reaccionar frente a lo que sientes. Tiendes a defenderte, marcar límites o mostrar lo que está ocurriendo. A veces puedes reaccionar de forma impulsiva o quedarte enganchado en la emoción.",
  },
];

interface Props {
  momentos: any;
  onSend: () => void;
  onClearMomentos: () => void;
  onSetMomento: (momento: any, valor: any) => void;
}

const Momento2 = memo(
  ({ momentos, onSend, onSetMomento, onClearMomentos }: Props) => {
    const [respuesta, setRespuesta] = useState("");

    const handleRespuesta = (respuesta: string) => {
      setRespuesta(respuesta);
      onSetMomento("dos", respuesta);
    };

    return (
      <div className="space-y-3">
        {questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleRespuesta(q.momento)}
            className={cn(
              "w-full text-left !p-4 !rounded-xl !border-2 transition-all",
              momentos["dos"] === q.momento
                ? "!border-primary !bg-primary/10"
                : "!border-border !bg-card hover:border-primary/50"
            )}
          >
            <span className="text-foreground leading-relaxed">{q.texto}</span>
          </button>
        ))}

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClearMomentos}
            className="flex-1 text-foreground"
          >
            Anterior
          </Button>

          <Button
            onClick={() => onSend()}
            className={cn(
              "flex-1 gradient-primary text-primary-foreground",
              "w-full"
            )}
          >
            Ver Resultado
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }
);

export default Momento2;
