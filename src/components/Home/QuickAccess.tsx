import { Link } from "react-router-dom";
import { quickAccessItems } from "@/lib/mockData";
import { 
  ClipboardList, 
  MessageCircle, 
  Sun, 
  Moon, 
  Heart 
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  ClipboardList,
  MessageCircle,
  Sun,
  Moon,
  Heart,
};

const colorClasses: Record<string, { bg: string; text: string; icon: string }> = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    icon: "text-primary",
  },
  accent: {
    bg: "bg-accent/20",
    text: "text-accent-foreground",
    icon: "text-accent",
  },
  morning: {
    bg: "bg-morning/20",
    text: "text-morning-foreground",
    icon: "text-morning",
  },
  night: {
    bg: "bg-night/20",
    text: "text-night",
    icon: "text-night",
  },
  sos: {
    bg: "bg-sos/10",
    text: "text-sos",
    icon: "text-sos",
  },
};

export function QuickAccess() {
  return (
    <div className="px-4 pb-6">
      <h2 className="font-display font-semibold text-lg mb-4">
        Acceso rápido
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        {quickAccessItems.map((item) => {
          const Icon = iconMap[item.icon];
          const colors = colorClasses[item.color];
          
          // SOS gets special treatment - full width
          if (item.id === "sos") {
            return (
              <Link
                key={item.id}
                to={item.route}
                className={cn(
                  "col-span-2 flex items-center gap-4 p-4 rounded-2xl transition-all",
                  "bg-gradient-to-r from-sos/10 to-sos/5 border border-sos/20",
                  "hover:shadow-md active:scale-[0.98]"
                )}
              >
                <div className="w-14 h-14 rounded-full gradient-sos flex items-center justify-center animate-pulse-soft">
                  <Icon className="w-7 h-7 text-sos-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-sos">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Ayuda inmediata
                  </p>
                </div>
              </Link>
            );
          }
          
          return (
            <Link
              key={item.id}
              to={item.route}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-2xl bg-card shadow-card",
                "hover:shadow-elevated transition-all active:scale-[0.98]"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                colors.bg
              )}>
                <Icon className={cn("w-6 h-6", colors.icon)} />
              </div>
              <p className="text-sm font-medium text-center text-foreground">
                {item.title}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
