import { cn } from "@/lib/utils";
import { Bell, Home, MessageCircle, Music, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Inicio", path: "/" },
  { icon: Users, label: "Comunidades", path: "/comunidades" },
  { icon: Music, label: "Música", path: "/musicoterapia" },
  { icon: Bell, label: "Alertas", path: "/notificaciones" },
  { icon: MessageCircle, label: "Chat", path: "/conexiones" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-nav border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== "/" && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive ? "text-nav-active" : "text-nav-inactive"
              )}
            >
              <item.icon 
                className={cn(
                  "w-5 h-5 transition-all",
                  isActive && "scale-110"
                )} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn(
                "text-[10px] font-medium",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
