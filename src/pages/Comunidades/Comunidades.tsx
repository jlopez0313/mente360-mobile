import Logo from "@/assets/images/logo.png";
import { db } from "@/hooks/useDexie";
import { useLiveQuery } from "dexie-react-hooks";

import { AppLayout } from "@/components/layout";

import { CommunityCard } from "@/components/Comunidades/CommunityCard";

const Comunidades = () => {
  const comunidades = useLiveQuery(() => db.comunidades.toArray());

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
              Comunidades
            </h1>
            <p className="text-sm text-muted-foreground">
              Encuentra tu espacio de crecimiento
            </p>
          </div>
        </div>
        </div>

        {/* Communities List */}
        <div className="space-y-4 px-4 py-6">
          {comunidades?.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Comunidades;
