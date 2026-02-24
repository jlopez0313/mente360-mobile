import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { memo, useState } from "react";

const questions = [
  {
    momento: "X",
    texto:
      "Soy una persona que normalmente mantiene una actitud positiva y piensa que las cosas se van a resolver para mejor. Suelo entusiasmarme por las cosas y no me cuesta encontrar en qué ocuparme. Me gusta estar con gente y ayudar a otros a ser felices; me agrada compartir con ellos mi bienestar. (No siempre me siento fabulosamente bien, pero trato de que nadie se dé cuenta.) Sin embargo, mantener esta actitud positiva ha significado a veces dejar pasar demasiado tiempo sin ocuparme de mis problemas.",
  },
  {
    momento: "Y",
    texto:
      "Soy una persona que tiene fuertes sentimientos respecto a las cosas, la mayoría de la gente lo nota cuando me siento desgraciado por algo. Sé ser-reservado con los demás, pero soy más sensible de lo que dejo ver. Deseo saber a qué atenerme con los demás y con quiénes y con qué puedo contar; la mayoría de las personas tienen muy claro a qué atenerse conmigo. Cuando estoy alterado por algo deseo que los demás reaccionen y se emocionen tanto como yo. Conozco las reglas, pero no quiero que me digan lo que he de hacer. Quiero decidir por mí mismo.",
  },
  {
    momento: "Z",
    texto:
      "Tiendo a controlarme y a ser lógico, me desagrada hacer frente a los sentimientos. Soy eficiente, incluso perfeccionista, y prefiero trabajar solo. Cuando hay problemas o conflictos personales trato de no meter mis sentimientos por medio. Algunos dicen que soy demasiado frío y objetivo, pero no quiero que mis reacciones emocionales me distraigan de lo que realmente me importa. Por lo general, no muestro mis emociones cuando otras personas «me fastidian».",
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
