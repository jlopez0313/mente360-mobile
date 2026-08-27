import { Button } from "@/components/ui/button";
import { db } from "@/hooks/useDexie";
import { cn } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, Music } from "lucide-react";
import React, { useEffect, useState } from "react";

const MAX_GENRES = 3;

interface MusicPreferencesModalProps {
  initialPreferences?: (number | string)[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (genres: (number | string)[]) => void;
}

export const MusicPreferencesModal: React.FC<MusicPreferencesModalProps> = ({
  initialPreferences = [],
  isOpen,
  onClose,
  onSave,
}) => {
  const [selected, setSelected] = useState<(number | string)[]>(initialPreferences);

  // Re-sincroniza la selección con las preferencias actuales cada vez que se abre
  // (permite editar desde Perfil/Configuración, no solo el primer alta).
  useEffect(() => {
    if (isOpen) setSelected(initialPreferences);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Mismas categorías que Musicoterapia (db.categorias).
  const categories = useLiveQuery(() =>
    db.categorias.orderBy("categoria").toArray()
  );

  if (!isOpen) return null;

  const toggleGenre = (genreId: number | string) => {
    if (selected.includes(genreId)) {
      setSelected(selected.filter((g) => g !== genreId));
    } else if (selected.length < MAX_GENRES) {
      setSelected([...selected, genreId]);
    } else {
      // Mantener máximo 3: descarta la más antigua.
      setSelected([...selected.slice(1), genreId]);
    }
  };

  const handleSave = () => {
    if (selected.length === 0) return;
    onSave(selected);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col safe-top safe-bottom">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-border/40">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center text-foreground hover:bg-muted"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-semibold text-foreground">Preferencias de música</h2>
        <div className="w-9" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-6 pb-4 overflow-y-auto flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground text-center mb-2">
            ¿Qué música disfrutas escuchar?
          </h1>

          <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm mb-8">
            <Music className="w-4 h-4" />
            <span>Elige hasta {MAX_GENRES} géneros</span>
          </div>

          {/* Genres Grid */}
          {!categories ? (
            <div className="grid grid-cols-2 gap-3 mb-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded-2xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mb-8">
              {categories.map((category) => {
                if (category.id === undefined) return null;
                const name = category.categoria;
                const catId = category.id ?? name;
                const isSelected = selected.includes(catId) || selected.includes(name);
                return (
                  <Button
                    key={category.id}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => toggleGenre(catId)}
                    className={cn(
                      "w-full h-12 !rounded-2xl !px-3 text-sm font-semibold whitespace-normal leading-tight active:scale-95",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-transparent text-foreground !border-border/70 hover:!border-primary/50"
                    )}
                  >
                    {name}
                  </Button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 flex flex-col items-center">
          <p className="text-xs text-muted-foreground text-center mb-4">
            Podrás cambiar esto cuando quieras desde tu perfil.
          </p>

          <Button
            onClick={handleSave}
            disabled={selected.length === 0}
            className="w-full h-12 !rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-sm shadow-md"
          >
            Guardar preferencias
          </Button>
        </div>
      </div>
    </div>
  );
};
