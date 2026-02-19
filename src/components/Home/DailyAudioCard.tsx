import { dailyAudio } from "@/lib/mockData";
import { Headphones } from "lucide-react";

export function DailyAudioCard() {
  // Get the first podcast as the "continue listening" podcast
  const audio = dailyAudio.morning;

  return (
    <div className="px-4 pb-4">
      <h3 className="font-display font-semibold text-lg mb-3">
        Audio del día
      </h3>
      
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
        {/* Current Audio */}
        <div className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              <img 
                src={audio.coverImage} 
                alt={audio.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center gradient-morning`}>
                  <Headphones className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">
                Audio del día
              </p>
              <h3 className="font-semibold text-foreground truncate">
                {audio.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {audio.duration}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
