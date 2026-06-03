import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { memo, useState } from "react";

const questions = [
  {
    momento: "ALFA",
    texto:
      "Tiendes a ir hacia adelante con decisión. Te activas, tomas iniciativa y buscas generar movimiento. Prefieres intervenir antes que quedarte esperando. Sueles confiar en que las cosas se resuelven haciendo, proponiendo o empujando la realidad. A veces puedes parecer intenso, dominante, entusiasta o muy enfocado en avanzar.",
  },
  {
    momento: "BETA",
    texto:
      "Tiendes a evaluar lo correcto, lo adecuado o lo esperado antes de actuar. Te importa hacer las cosas bien, responder de forma responsable y cuidar el impacto en los demás. Sueles considerar normas, valores o expectativas antes de moverte. A veces puedes exigirte demasiado o cargar con responsabilidades que otros no asumen.",
  },
  {
    momento: "GAMA",
    texto:
      "Tiendes a tomar distancia antes de actuar. Observas, analizas o procesas internamente lo que está pasando. Prefieres entender bien la situación antes de intervenir. Sueles ser prudente, reflexivo o reservado. A veces puedes postergar decisiones o parecer desconectado.",
  },
];

interface Props {
  onSetMomento: (momento: any, valor: any) => void;
}

const Momento1 = memo(({ onSetMomento }: Props) => {
  const [momento, setMomento] = useState("");

  return (
    <div className="space-y-3">
      {questions.map((q, idx) => (
        <button
          key={idx}
          onClick={() => setMomento(q.momento)}
          className={cn(
            "w-full text-left !p-4 !rounded-xl !border-2 transition-all",
            momento === q.momento
              ? "!border-primary !bg-primary/10"
              : "!border-border !bg-card hover:border-primary/50"
          )}
        >
          <span className="text-foreground leading-relaxed">{q.texto}</span>
        </button>
      ))}

      <div className="flex gap-3">
        <Button
          onClick={() => onSetMomento("uno", momento)}
          className={cn(
            "flex-1 gradient-primary text-primary-foreground",
            "w-full"
          )}
        >
          Siguiente
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
});

export default Momento1;
