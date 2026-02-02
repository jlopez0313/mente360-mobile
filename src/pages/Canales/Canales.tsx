import { ChannelCard } from "@/components/Canales/ChannelCard";
import { AppLayout } from "@/components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NetworkContext } from "@/context/NetworkContext";
import { getYoutubeLink, goToYoutube } from "@/helpers/Video";
import { db } from "@/hooks/useDexie";
import { cn } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, Play, Users } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

const Canales: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<any>();

  const { AudioNoWifi, baseURL, status } = useContext(NetworkContext);

  const [expandido, setExpandido] = useState(false);

  const community = useLiveQuery(() =>
    db.comunidades.filter((c) => c.id == id).first()
  );

  const canales = useLiveQuery(
    () => db.canales.filter((c) => c.comunidad?.id == community?.id).toArray(),
    [community]
  );

  useEffect(() => {
    const handleBackButton = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
      history.replace("/comunidades");
    };

    document.addEventListener("ionBackButton", handleBackButton);

    return () => {
      document.removeEventListener("ionBackButton", handleBackButton);
    };
  }, [history]);

  return (
    <AppLayout>
      <div className="min-h-full">
        {/* Header Image */}
        <div className="relative h-50 bg-gradient-primary">
          <iframe
            className="w-full h-full object-cover"
            src={getYoutubeLink(community?.video)}
            title="YouTube video player"
            allowFullScreen
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          ></iframe>

          {/* Back button */}
          <Link to='/comunidades' replace={true}>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm hover:bg-background"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>

          {/* Community Info Overlay */}
          <div className="absolute -bottom-7 left-4 right-4">
            <div className="flex items-end gap-3">
              <div className="w-16 h-16 rounded-2xl border-2 bg-card overflow-hidden shadow-medium">
                <img
                  src={status ? baseURL + community?.imagen : AudioNoWifi}
                  alt={community?.comunidad}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-4 space-y-2">
          <div className="flex-1">
            <h1 className="text-xl font-heading font-bold text-foreground">
              {community?.comunidad}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Avatar className="w-5 h-5">
                <AvatarImage
                  className="object-cover w-full h-full"
                  src={baseURL + community?.lider?.photo}
                  alt={community?.lider?.name}
                />
                <AvatarFallback>{community?.lider?.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {community?.lider?.name}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="gap-1">
              <Users className="w-3 h-3" />
              {community?.suscritos?.length.toLocaleString()} miembros
            </Badge>
            
            <a href={goToYoutube(community?.video)} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1">
                <Play className="w-3 h-3" />
                Ver presentación
              </Button>
            </a>
            
          </div>

          {/* Description */}
          <div>
            <h2 className="font-heading font-semibold text-foreground mb-2">
              Sobre esta comunidad
            </h2>
            <p
              className={cn(
                "text-sm text-muted-foreground leading-relaxed mb-0",
                expandido ? "line-clamp-none" : "line-clamp-2"
              )}
            >
              {community?.descripcion}
            </p>

            <button
              className="text-sm text-primary underline hover:opacity-80 transition"
              onClick={() => setExpandido(!expandido)}
            >
              {expandido ? "Leer menos" : "Leer más"}
            </button>
          </div>

          {/* Channels */}
          <div>
            <h2 className="font-heading font-semibold text-foreground mb-3">
              Canales
            </h2>

            <div className="space-y-2">
              {canales?.map((channel, idx) => (
                  <ChannelCard
                    key={idx}
                    channel={channel}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Canales;
