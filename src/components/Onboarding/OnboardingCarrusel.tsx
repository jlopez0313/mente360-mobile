import { Button } from "@/components/ui/button";
import { CARRUSEL_SLIDES } from "@/lib/onboardingContent";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { PhoneMock } from "./PhoneMock";

interface Props {
  /** Se llama al pasar del último slide. */
  onNext: () => void;
}

/**
 * Pantalla 4 · Carrusel de herramientas (4.1 – 4.8). Scroll horizontal con
 * snap + botón "Siguiente" + puntos de progreso. La salida ("Saltar") la pone
 * el contenedor arriba, visible en todos los pasos.
 */
export const OnboardingCarrusel: React.FC<Props> = ({ onNext }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const total = CARRUSEL_SLIDES.length;

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(Math.min(Math.max(i, 0), total - 1));
  };

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  const handleNext = () => {
    if (index < total - 1) goTo(index + 1);
    else onNext();
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-6 pt-2">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Descubre tus herramientas
        </h1>
        <p className="text-sm text-muted-foreground">
          Todo lo que necesitas en un solo lugar.
        </p>
      </div>

      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex flex-1 snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {CARRUSEL_SLIDES.map((slide) => (
          <div
            key={slide.key}
            className="flex w-full flex-shrink-0 snap-center flex-col items-center justify-center gap-6 px-8 py-6 text-center"
          >
            <PhoneMock icon={slide.icon} titulo={slide.nombre} chips={slide.mockChips} />
            <div>
              <p className="mb-1 font-display text-lg font-bold text-foreground">
                {slide.nombre}
              </p>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                {slide.mensaje}
              </p>
              {slide.secundario && (
                <p className="mt-2 max-w-xs text-xs italic text-muted-foreground/80">
                  {slide.secundario}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Puntos de progreso — no dependen solo del color: el activo es más ancho */}
      <div className="flex items-center justify-center gap-1.5 py-3">
        {CARRUSEL_SLIDES.map((s, i) => (
          <button
            key={s.key}
            aria-label={`Ir a ${s.nombre}`}
            onClick={() => goTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30"
            )}
          />
        ))}
      </div>

      <div className="px-6 pb-4">
        <Button size="lg" onClick={handleNext} className="w-full gap-2">
          {index < total - 1 ? "Siguiente" : "Continuar"}
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
