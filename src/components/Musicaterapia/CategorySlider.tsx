import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Categorias from "@/database/categorias";
import { cn } from "@/lib/utils";
import { Baby, Brain, Music, Music2, Sparkles, TreePine } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Music,
  Sparkles,
  Baby,
  Piano: Music,
  TreePine,
  Brain,
  Music2,
};

interface CategorySliderProps {
  categories: Categorias[] | undefined;
  selectedCategory: number | undefined;
  onSelectCategory: (categoryId: number | undefined) => void;
}

export const CategorySlider = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategorySliderProps) => {
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // We use a small timeout to ensure the categories have rendered
    // and the layout is ready before scrolling
    const timeoutId = setTimeout(() => {
      if (activeButtonRef.current) {
        activeButtonRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [selectedCategory, categories]);

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        <Button
          ref={selectedCategory === undefined ? activeButtonRef : null}
          variant={selectedCategory === undefined ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectCategory(undefined)}
          className={cn(
            "shrink-0 !rounded-full",
            selectedCategory == undefined && "bg-primary text-primary-foreground"
          )}
        >
          Todos
        </Button>
        {categories?.map((category) => {
          const isSelected = selectedCategory === category.id;

          return (
            <Button
              ref={isSelected ? activeButtonRef : null}
              key={category.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                "shrink-0 !rounded-full gap-1.5",
                isSelected ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              {category.categoria}
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
};
