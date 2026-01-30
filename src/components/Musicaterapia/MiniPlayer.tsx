import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Track } from "@/pages/Musicaterapia/Musicaterapia";
import { Pause, Play, X } from "lucide-react";
import { useState } from "react";

interface MiniPlayerProps {
  track: Track;
  onClose: () => void;
}

export const MiniPlayer = ({ track, onClose }: MiniPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(30);

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 px-4">
      <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-glow overflow-hidden">
        <Progress value={progress} className="h-1 rounded-none" />
        
        <div className="flex items-center gap-3 p-3">
          {/* Cover */}
          <div 
            className="w-12 h-12 rounded-xl overflow-hidden bg-muted cursor-pointer shrink-0"
            // onClick={() => navigate(`/musicoterapia/player/${track.id}`)}
          >
            <img
              src={track.coverImage}
              alt={track.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div 
            className="flex-1 min-w-0 cursor-pointer"
            // onClick={() => navigate(`/musicoterapia/player/${track.id}`)}
          >
            <h3 className="font-medium text-foreground text-sm truncate">
              {track.title}
            </h3>
            <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-8 h-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};