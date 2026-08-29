import { ChannelCard, ProgramaCard } from "@/components/Canales";
import { AppLayout } from "@/components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NetworkContext } from "@/context/NetworkContext";
import { YoutubePreview } from "@/components/Shared/YoutubePreview";
import { goToYoutube } from "@/helpers/Video";
import { useBackButton } from "@/hooks/useBackButton";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/hooks/useDexie";
import { ArrowLeft, GraduationCap, Play, Users } from "lucide-react";
import { useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ExpandableText } from "@/components/Shared/ExpandableText";

const Canales: React.FC = () => {
  const { id } = useParams<any>();
  const history = useHistory();

  const { AudioNoWifi, baseURL, status } = useContext(NetworkContext);

  const community = useLiveQuery(
    () => db.comunidades.filter((c) => c.id == id).first(),
    [id]
  );

  const canales = useLiveQuery(
    () => db.canales.filter((c) => c.comunidad?.id == community?.id).toArray(),
    [community]
  );

  const programas = useLiveQuery(
    () => db.programas.filter((c) => c.comunidad_id == community?.id).toArray(),
    [community]
  );

  useBackButton("/comunidades");

  return (
    <AppLayout hideNav>
      <div className="h-full flex flex-col">
        {/* Header Image */}
        <div className="relative h-50 bg-gradient-primary">
          {status ? (
            <YoutubePreview video={community?.video} fallback={AudioNoWifi} />
          ) : (
            <img
              src={AudioNoWifi}
              alt="Sin conexión"
              className="w-full h-full object-cover"
            />
          )}

          {/* Back button */}
          <Button
            onClick={() => history.replace("/comunidades")}
            variant="ghost"
            size="icon"
            className="absolute left-4 top-[calc(var(--ion-safe-area-top,env(safe-area-inset-top,0px))+1rem)] bg-background/80 backdrop-blur-sm hover:bg-background"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>

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
        <div className="px-4 py-4 space-y-2 flex-1 overflow-y-auto">
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

            <a
              href={goToYoutube(community?.video)}
              target="_blank"
              rel="noopener noreferrer"
            >
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
            <ExpandableText
              text={community?.descripcion || ""}
              maxLines={2}
            />
          </div>

          {/* Channels */}
          <div>
            <h2 className="font-heading font-semibold text-foreground mb-3">
              Canales
            </h2>

            <div className="space-y-2">
              {canales?.map((channel, idx) => (
                <ChannelCard
                  communityId={id}
                  key={idx}
                  channel={channel}
                />
              ))}
            </div>
          </div>

          {/* Programs */}
          <div>
            <h2 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Programas de Mentoría
            </h2>

            <div className="space-y-2">
              {programas?.map((programa, idx) => (
                <ProgramaCard
                  communityId={id}
                  key={idx}
                  programa={programa}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Canales;
