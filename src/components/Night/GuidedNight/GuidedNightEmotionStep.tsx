import { Button } from "@/components/ui/button";
import CategoriasNoche from "@/database/categorias_noche";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface Props {
  categories?: CategoriasNoche[];
  initialCategoryId?: number | null;
  onContinue: (categoryId: number, categoryName: string) => void;
  onSkip: () => void;
}

export const GuidedNightEmotionStep: React.FC<Props> = ({
  categories,
  initialCategoryId = null,
  onContinue,
  onSkip,
}) => {
  const loading = categories === undefined;
  const list = categories ?? [];

  const [selectedId, setSelectedId] = useState<number | null>(initialCategoryId);

  // Cuando llegan las categorías, si no hay una elegida válida tomar la primera.
  useEffect(() => {
    if (list.length === 0) return;
    const valid = list.some((c) => c.id === selectedId);
    if (!valid) setSelectedId(list[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.length]);

  const selected = list.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="flex-1 flex flex-col justify-between pt-2 pb-4">
      <div>
        <h1 className="text-xl font-bold font-display text-foreground mb-1">
          ¿Cómo te sientes ahora?
        </h1>
        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          Elige la opción que mejor describe lo que estás viviendo.
        </p>

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay categorías de noche disponibles.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {list.map((c) => {
              const isSelected = selectedId === c.id;
              return (
                <Button
                  key={c.id}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => setSelectedId(c.id)}
                  className={cn(
                    "w-full h-12 !rounded-2xl !px-3 font-semibold text-xs whitespace-normal leading-tight active:scale-95",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card text-foreground !border-border/70 hover:!border-primary/40"
                  )}
                >
                  {c.nombre}
                </Button>
              );
            })}
          </div>
        )}
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
          onClick={() =>
            selected && onContinue(selected.id, selected.nombre)
          }
          disabled={!selected}
          className="w-full h-12 !rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-sm shadow-md"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
