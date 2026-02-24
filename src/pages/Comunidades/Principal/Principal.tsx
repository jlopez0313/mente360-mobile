import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { NetworkContext } from "@/context/NetworkContext";
import { useBackButton } from "@/hooks/useBackButton";
import { db } from "@/hooks/useDexie";
import { cn } from "@/lib/utils";
import { setCurrentDay } from "@/store/slices/homeSlice";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, Check, Crown } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { toast } from "sonner";

export default function SelectCommunityPage() {
  const { baseURL, status, AudioNoWifi } = useContext(NetworkContext);

  const dispatch = useDispatch();
  const history = useHistory();
  const { user } = useSelector((state: any) => state.user);
  const { currentDay } = useSelector((state: any) => state.home);

  // Filter only subscribed communities
  const misComunidades = useLiveQuery(
    () =>
      db.comunidades
        .where("id")
        .anyOf(user.suscripciones.map((s: any) => s.id))
        .toArray(),
    [user]
  );

  const [selectedCommunity, setSelectedCommunity] = useState<number>(0);

  const handleSave = () => {
    localStorage.setItem("principal", selectedCommunity.toString());
    toast.success(`Recuerda que tu próxima tarea será asignada en ${currentDay} días`);
    // history.go(-1);
  };

  useEffect(() => {

    const getSelected = () => {
      if (!misComunidades?.length) return;
      const saved = localStorage.getItem("principal");

      if (saved && misComunidades?.find(c => c.id == Number(saved))) {
        setSelectedCommunity(Number(saved));
      } else {
        setSelectedCommunity(0);
      }
    }

    getSelected();

  }, [misComunidades])

  useEffect(() => {
    const daysLeft = 7 - new Date().getDay();
    dispatch(setCurrentDay(daysLeft));
  }, []);

  useBackButton('/home')

  return (
    <AppLayout hideNav>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => history.go(-1)} className="p-2 -ml-2 hover:bg-muted rounded-full">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-display font-semibold text-lg text-foreground">Comunidad Principal</h1>
            <div className="w-9" />
          </div>
        </header>

        <div className="px-4 py-6">
          <p className="text-muted-foreground mb-6">
            Selecciona la comunidad que deseas ver como principal. Las tareas y contenido del home se basarán en esta comunidad.
          </p>

          <div className="space-y-3">
            {misComunidades?.map((community) => (
              <button
                key={community.id}
                onClick={() => setSelectedCommunity(community.id)}
                className={cn(
                  "w-full flex items-center gap-4 !p-4 !rounded-2xl !border-2 transition-all",
                  selectedCommunity === community.id
                    ? "!border-primary !bg-primary/10"
                    : "!border-border !bg-card hover:border-primary/50"
                )}
              >
                <img
                  src={status ? baseURL + community.imagen : AudioNoWifi}
                  alt={community.comunidad}
                  className="w-14 h-14 rounded-xl object-cover"
                />

                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{community.comunidad}</h3>
                    <Crown className="w-4 h-4 text-premium" />
                  </div>
                  <p className="text-sm text-muted-foreground">{community?.lider?.name}</p>
                  <p className="text-xs text-muted-foreground">{community?.suscritos.length} miembros</p>
                </div>

                {selectedCommunity === community.id && (
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                    <Check className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {misComunidades?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tienes comunidades suscritas</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => history.replace("/comunidades")}
              >
                Explorar comunidades
              </Button>
            </div>
          )}

          {misComunidades?.length > 0 && (
            <Button
              onClick={handleSave}
              className="w-full mt-8 gradient-primary text-primary-foreground !rounded-xl"
            >
              Guardar selección
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
