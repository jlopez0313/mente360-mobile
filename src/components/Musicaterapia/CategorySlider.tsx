import { Button } from "@/components/ui/button";
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
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        <Button
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
              key={category.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                "shrink-0 !rounded-full gap-1.5",
                isSelected && "bg-primary text-primary-foreground"
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
