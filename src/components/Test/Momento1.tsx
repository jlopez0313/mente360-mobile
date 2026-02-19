import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { memo, useState } from "react";

const questions = [
  {
    momento: "A",
    texto:
      "Tiendo a ser muy activo, sociable y competitivo. Me gusta ser el centro de atención y me siento cómodo destacando sobre los demás. Me gusta estar rodeado de gente y disfruto con la interacción social. Probablemente muchos dirían que soy un poco arrogante, pues me gusta mostrar mis logros y habilidades. Me gusta sentirme ocupado y no me gusta estar solo.",
  },
  {
    momento: "B",
    texto:
      "Tiendo a estar callado y estoy acostumbrado a estar solo. Normalmente no atraigo mucho la atención en el aspecto social, y por lo general procuro no imponerme por la fuerza. No me siento cómodo destacando sobre los demás ni siendo competitivo. Probablemente muchos dirían que tengo algo de soñador, pues disfruto con mi imaginación. Puedo estar bastante a gusto sin pensar que tengo que ser activo todo el tiempo.",
  },
  {
    momento: "C",
    texto:
      "Tiendo a ser muy responsable y entregado. Me siento fatal si no cumplo mis compromisos o no hago lo que se espera de mí. Deseo que los demás sepan que estoy por ellos y que haré todo lo que crea que es mejor por ellos. Con frecuencia hago grandes sacrificios personales por el bien de otros, lo sepan o no lo sepan. No suelo cuidar bien de mí mismo; hago el trabajo que hay que hacer y me relajo (y hago lo que realmente deseo) si me queda tiempo.",
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
