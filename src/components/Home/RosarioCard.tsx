import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export function RosaryIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M12 11v8" />
      <path d="M9 15h6" />
      <circle cx="12" cy="3" r="1" fill="currentColor" />
    </svg>
  );
}

interface RosarioCardProps {
  rezandoCount?: number;
}

export function RosarioCard({ rezandoCount = 38 }: RosarioCardProps) {
  return (
    <div className="px-4 pb-4">
      <Link
        to="/rosario"
        className="flex items-center justify-between !p-4 !rounded-2xl bg-card shadow-card hover:shadow-elevated transition-all active:scale-[0.99] border border-border/50"
      >
        <div className="flex items-center gap-3">
          {/* Icon Container */}
          <div className="w-11 h-11 rounded-full flex items-center justify-center gradient-primary flex-shrink-0">
            <RosaryIcon className="w-6 h-6 text-white" />
          </div>

          <div className="flex flex-col">
            <p className="font-heading font-bold text-base text-foreground">
              Rosario en comunidad
            </p>
            <p className="text-xs text-muted-foreground line-clamp-1">
              Únete a personas que están rezando ahora
            </p>
            <div className="inline-flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-primary">
                {rezandoCount} rezando ahora
              </span>
            </div>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
      </Link>
    </div>
  );
}
