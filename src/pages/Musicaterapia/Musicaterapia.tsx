import Logo from "@/assets/images/logo.png";



import { AppLayout } from "@/components/layout";
import { CategorySlider } from "@/components/Musicaterapia/CategorySlider";
import { FavoritesList } from "@/components/Musicaterapia/FavoritesList";
import { MiniPlayer } from "@/components/Musicaterapia/MiniPlayer";
import { TrackList } from "@/components/Musicaterapia/TrackList";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockMusicTracks, musicCategories } from "@/lib/mockData";
import { Heart, Music, Search } from "lucide-react";
import { useEffect, useState } from "react";

export interface Track {
  id: string;
  title: string;
  artist: string;
  category: string;
  duration: number;
  coverImage: string;
  audioUrl: string;
  isDownloaded: boolean;
  isLiked?: boolean;
  inMyPlaylist?: boolean;
}

const Musicaterapia: React.FC = () => {

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [tracks, setTracks] = useState<Track[]>(
    mockMusicTracks.map(t => ({ ...t, isLiked: false, inMyPlaylist: false }))
  );

  const filteredTracks = tracks.filter((track) => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || track.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleLike = (trackId: string) => {
    setTracks(prev => prev.map(t => 
      t.id === trackId ? { ...t, isLiked: !t.isLiked } : t
    ));
  };

  const handleTogglePlaylist = (trackId: string) => {
    setTracks(prev => prev.map(t => 
      t.id === trackId ? { ...t, inMyPlaylist: !t.inMyPlaylist } : t
    ));
  };

  const handleDownload = (trackId: string) => {
    setTracks(prev => prev.map(t => 
      t.id === trackId ? { ...t, isDownloaded: !t.isDownloaded } : t
    ));
  };

  useEffect(() => {
    const handleBackButton = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
      // history.replace("/home");
    };

    document.addEventListener("ionBackButton", handleBackButton);

    return () => {
      document.removeEventListener("ionBackButton", handleBackButton);
    };
  }, [history]);

  return (
    <AppLayout>
      <div className="min-h-full pb-24">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Mente 360" className="w-10 h-10 rounded-xl object-cover" />
            <div>
              <h1 className="text-xl font-heading font-bold text-foreground">Musicoterapia</h1>
              <p className="text-sm text-muted-foreground">Sonidos para tu bienestar</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar canciones o artistas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 !bg-muted/50 !border-border/50"
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6">
          <Tabs defaultValue="clips" className="space-y-6">
            <TabsList className="w-full grid grid-cols-2 bg-muted/50">
              <TabsTrigger value="clips" className="gap-2">
                <Music className="w-4 h-4" />
                Clips
              </TabsTrigger>
              <TabsTrigger value="favorites" className="gap-2">
                <Heart className="w-4 h-4" />
                Favoritos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clips" className="space-y-6 mt-0">
              {/* Categories */}
              <CategorySlider
                categories={musicCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              {/* Track List */}
              <TrackList
                tracks={filteredTracks}
                onPlay={setCurrentTrack}
                onToggleLike={handleToggleLike}
                onTogglePlaylist={handleTogglePlaylist}
                onDownload={handleDownload}
                currentTrackId={currentTrack?.id}
              />
            </TabsContent>

            <TabsContent value="favorites" className="mt-0">
              <FavoritesList
                tracks={tracks}
                onPlay={setCurrentTrack}
                onToggleLike={handleToggleLike}
                currentTrackId={currentTrack?.id}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Mini Player */}
        {currentTrack && (
          <MiniPlayer
            track={currentTrack}
            onClose={() => setCurrentTrack(null)}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default Musicaterapia;
