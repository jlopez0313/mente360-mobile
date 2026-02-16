import { Play, Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import { dailyAudio, mockPodcasts } from "@/lib/mockData";

export function DailyAudioCard() {
  // Get the first podcast as the "continue listening" podcast
  const continuePodcast = mockPodcasts[0];
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 18 || currentHour < 6;
  const audio = isNight ? dailyAudio.night : dailyAudio.morning;

  return (
    <div className="px-4 pb-4">
      <h2 className="font-display font-semibold text-lg mb-3">
        Audio del día
      </h2>
      
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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isNight ? 'gradient-night' : 'gradient-morning'}`}>
                  <Headphones className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">
                {isNight ? "Audio de noche" : "Audio de mañana"}
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

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Continue Podcast */}
        <Link 
          to={`/comunidades/1/podcasts/${continuePodcast.id}`}
          className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
        >
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={continuePodcast.coverImage} 
              alt={continuePodcast.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-xs text-primary font-medium mb-0.5">
              Continúa escuchando
            </p>
            <h4 className="font-medium text-foreground text-sm truncate">
              {continuePodcast.title}
            </h4>
          </div>
          
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
          </div>
        </Link>
      </div>
    </div>
  );
}
