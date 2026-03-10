import Programas from "@/database/programas";
import { Browser } from "@capacitor/browser";
import {
  Brain,
  Dumbbell,
  ExternalLink,
  GraduationCap,
  Handshake,
  Heart,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Users,
  Wind
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  TrendingUp,
  Wind,
  Users,
  MessageSquare,
  Brain,
  Dumbbell,
  Handshake,
  Heart,
};

type Props = {
  programa: Programas | undefined;
  communityId: number | undefined;
};

export const ProgramaCard = ({ programa }: Props) => {
  return (
    <div
      onClick={async (e) => {
        e.preventDefault();
        await Browser.open({ url: programa?.link || "" });
      }}
      className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-sm transition-all group"
    >
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <GraduationCap className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
          {programa?.programa}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {programa?.descripcion}
        </p>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
    </div>
  );
};
