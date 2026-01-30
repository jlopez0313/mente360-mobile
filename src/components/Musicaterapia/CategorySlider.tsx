import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategorySliderProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
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
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectCategory(null)}
          className={cn(
            "shrink-0 rounded-full",
            selectedCategory === null && "bg-primary text-primary-foreground"
          )}
        >
          Todos
        </Button>
        {categories.map((category) => {
          const IconComponent = iconMap[category.icon] || Music;
          const isSelected = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                "shrink-0 rounded-full gap-1.5",
                isSelected && "bg-primary text-primary-foreground"
              )}
            >
              <IconComponent className="w-3.5 h-3.5" />
              {category.name}
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
};
