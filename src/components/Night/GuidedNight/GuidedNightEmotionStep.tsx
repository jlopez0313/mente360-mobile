import { Button } from "@/components/ui/button";
import CategoriasNoche from "@/database/categorias_noche";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface Props {
  categories?: CategoriasNoche[];
  initialCategoryId?: number | null;
  onContinue: (categoryId: number | null, categoryName: string) => void;
  onSkip: () => void;
}

// Fallback usado solo si aún no se sincronizaron las categorías de noche.
const FALLBACK_EMOTIONS = [
  "Ansiedad",
  "Miedo",
  "Tristeza",
  "Cansancio",
  "Ira / Molestia",
  "Agotamiento",
  "Paz / Tranquilidad",
  "Gratitud",
];

export const GuidedNightEmotionStep: React.FC<Props> = ({
  categories,
  initialCategoryId = null,
  onContinue,
  onSkip,
}) => {
  const hasCategories = !!categories && categories.length > 0;

  const items: { id: number | null; nombre: string }[] = hasCategories
    ? categories!.map((c) => ({ id: c.id, nombre: c.nombre }))
    : FALLBACK_EMOTIONS.map((nombre) => ({ id: null, nombre }));

  const [selected, setSelected] = useState<{ id: number | null; nombre: string }>(
    () =>
      items.find((i) => i.id === initialCategoryId) ?? items[0] ?? {
        id: null,
        nombre: "",
      }
  );

  return (
    <div className="flex-1 flex flex-col justify-between pt-2 pb-4">
      <div>
        <h1 className="text-xl font-bold font-display text-foreground mb-1">
          ¿Cómo te sientes ahora?
        </h1>
        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          Elige la opción que mejor describe lo que estás viviendo.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => {
            const isSelected =
              selected.nombre === item.nombre && selected.id === item.id;
            return (
              <Button
                key={`${item.id ?? "x"}-${item.nombre}`}
                type="button"
                variant={isSelected ? "default" : "outline"}
                onClick={() => setSelected(item)}
                className={cn(
                  "w-full h-12 !rounded-2xl !px-3 font-semibold text-xs whitespace-normal leading-tight active:scale-95",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card text-foreground !border-border/70 hover:!border-primary/40"
                )}
              >
                {item.nombre}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto pt-8 flex flex-col items-center gap-5">
        <button
          onClick={onSkip}
          type="button"
          className="text-xs text-primary font-semibold hover:underline py-1"
        >
          No sé cómo me siento
        </button>

        <Button
          onClick={() => onContinue(selected.id, selected.nombre)}
          disabled={!selected.nombre}
          className="w-full h-12 !rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-sm shadow-md"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
