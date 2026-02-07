import Logo from "@/assets/images/logo.png";

import { AppLayout } from "@/components/layout";
import { CategorySlider } from "@/components/Musicaterapia/CategorySlider";
import { FavoritesList } from "@/components/Musicaterapia/FavoritesList";
import { MiniPlayer } from "@/components/Musicaterapia/MiniPlayer";
import { TrackList } from "@/components/Musicaterapia/TrackList";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Clips from "@/database/clips";
import { useBackButton } from "@/hooks/useBackButton";
import { db } from "@/hooks/useDexie";
import { IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/react";
import { useLiveQuery } from "dexie-react-hooks";
import { Heart, Music, Search } from "lucide-react";
import { useState } from "react";

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
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined
  );
  const [currentTrack, setCurrentTrack] = useState<Clips | undefined>(
    undefined
  );
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);

  const categories = useLiveQuery(() =>
    db.categorias.orderBy("categoria").toArray()
  );

  const clips = useLiveQuery(async () => {
    const resultados = await db.clips
      .orderBy("titulo")
      .toArray()
      .then((resultados) =>
        resultados.filter((c) =>
          c.titulo.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
      .then((resultados) => {
        if (selectedCategory != undefined) {
          return resultados.filter(
            (r: any) => r.categoria?.id == Number(selectedCategory)
          );
        }
        return resultados;
      });

    const limit = page * 10;
    const paginados = resultados.slice(0, limit);

    setHasMore(paginados.length < resultados.length);

    // dispatch(setListAudios([...paginados]));

    return paginados;
  }, [selectedCategory, page, searchQuery]);

  const handlePage = (evt: any, page: any) => {
    if (hasMore) setPage(page);
    else evt.target.complete();
  };

  const handleCategory = (id: number | undefined) => {
    // dispatch(clearListAudios());
    setHasMore(true);
    setSelectedCategory(id);
    // -- setSearchQuery("");
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    // dispatch(clearListAudios());
    setHasMore(true);
    setSearchQuery(value);

    if (value !== "") {
      setPage(1);
    }
  };

  const handleToggleLike = (trackId: number | undefined) => {
    /*
    setTracks(prev => prev.map(t => 
      t.id === trackId ? { ...t, isLiked: !t.isLiked } : t
    ));
    */
  };

  const handleTogglePlaylist = (trackId: number | undefined) => {
    /*
    setTracks(prev => prev.map(t => 
      t.id === trackId ? { ...t, inMyPlaylist: !t.inMyPlaylist } : t
    ));
    */
  };

  const handleDownload = (trackId: number | undefined) => {
    /*
    setTracks(prev => prev.map(t => 
      t.id === trackId ? { ...t, isDownloaded: !t.isDownloaded } : t
    ));
    */
  };

  useBackButton(`/home`);

  return (
    <AppLayout>
      <div className="min-h-full pb-24">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={Logo}
              alt="Mente 360"
              className="w-10 rounded-xl object-cover"
            />
            <div>
              <h1 className="text-xl font-heading font-bold text-foreground">
                Musicoterapia
              </h1>
              <p className="text-sm text-muted-foreground">
                Sonidos para tu bienestar
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar canciones o artistas..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
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
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategory}
              />

              {/* Track List */}
              <TrackList
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                page={page}
                setHasMore={setHasMore}
                onPlay={setCurrentTrack}
                onToggleLike={handleToggleLike}
                onTogglePlaylist={handleTogglePlaylist}
                onDownload={handleDownload}
                currentTrackId={currentTrack?.id}
              />
            </TabsContent>

            <TabsContent value="favorites" className="mt-0">
              <FavoritesList
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                page={page}
                setHasMore={setHasMore}
                onPlay={setCurrentTrack}
                onToggleLike={handleToggleLike}
                onTogglePlaylist={handleTogglePlaylist}
                onDownload={handleDownload}
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

      <IonInfiniteScroll
        onIonInfinite={(ev) => {
          handlePage(ev, page + 1);
          setTimeout(() => ev.target.complete(), 1000);
        }}
      >
        <IonInfiniteScrollContent
          loadingText="Cargando..."
          loadingSpinner="bubbles"
        ></IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </AppLayout>
  );
};

export default Musicaterapia;
