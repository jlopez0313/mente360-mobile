import { Card, CardContent } from "@/components/ui/card";
import { NetworkContext } from "@/context/NetworkContext";
import Canales from "@/database/canales";
import {
  Brain,
  ChevronRight,
  Dumbbell,
  Handshake,
  Heart,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Users,
  Wind,
} from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";

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
  channel: Canales | undefined;
  communityId: number | undefined;
};

export const ChannelCard = ({ channel }: Props) => {
  const { AudioNoWifi, baseURL, status } = useContext(NetworkContext);

  return (
    <Card className="cursor-pointer border-border/50 hover:border-primary/30 hover:shadow-soft transition-all">
      <Link to={`/canales/${channel?.id}/niveles`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 overflow-hidden shadow-medium">
              <img
                alt={channel?.canal}
                src={status ? baseURL + channel?.imagen : AudioNoWifi}
              />
            </div>
            <span className="flex-1 font-medium text-foreground">
              {channel?.canal}
            </span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};
