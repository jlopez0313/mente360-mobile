import Logo from "@/assets/images/logo.png";
import { db } from "@/hooks/useDexie";
import { useLiveQuery } from "dexie-react-hooks";

import { AppLayout } from "@/components/layout";

import { CommunityCard } from "@/components/Comunidades/CommunityCard";

const Comunidades = () => {
  const comunidades = useLiveQuery(() => db.comunidades.toArray());

  return (
    <AppLayout>
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <img
            src={Logo}
            alt="Mente 360"
            className="w-10 h-10 rounded-xl object-cover"
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

        {/* Communities List */}
        <div className="space-y-4">
          {comunidades?.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Comunidades;
