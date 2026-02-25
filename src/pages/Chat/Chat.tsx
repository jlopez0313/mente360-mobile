import { Lista as ChatComponent } from "@/components/Chat/Chat/Lista";
import { Comunidad as ComunidadComponent } from "@/components/Chat/Comunidad/Comunidad";
import { Lista as GruposComponent } from "@/components/Chat/Grupos/Lista/Lista";
import { AppLayout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { destroy } from "@/helpers/musicControls";
import { useBackButton } from "@/hooks/useBackButton";
import { setShowGlobalAudio } from "@/store/slices/audioSlice";
import { setTab } from "@/store/slices/chatSlice";
import { MessageCircle, Search, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Lista: React.FC = () => {
  const dispatch = useDispatch();

  const { isRoom, isGrupo } = useSelector((state: any) => state.notifications);
  const { activeTab } = useSelector((state: any) => state.chat);

  const [searchQuery, setSearchQuery] = useState("");

  const onSetTab = (tab: string) => {
    dispatch(setTab(tab));
  };

  useEffect(() => {
    dispatch(setShowGlobalAudio(false));
    destroy();
  }, []);

  useBackButton(`/home`);

  return (
    <AppLayout>
      <div className="min-h-full flex flex-col">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-4 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Conexiones</h1>
              <p className="text-sm text-muted-foreground">
                Chats y grupos de apoyo
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 py-6 flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={onSetTab}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="chats" className="relative flex-1 gap-1 text-xs px-2">
                <MessageCircle className="w-4 h-4" />
                Chats
                {isRoom && <div className="absolute top-1.5 right-6.5 w-2.5 h-2.5 bg-success rounded-full" />}
              </TabsTrigger>
              <TabsTrigger value="groups" className="relative flex-1 gap-1 text-xs px-2">
                <Users className="w-4 h-4" />
                Grupos
                {isGrupo && <div className="absolute top-1.5 right-5.5 w-2.5 h-2.5 bg-success rounded-full" />}
              </TabsTrigger>
              <TabsTrigger
                value="community"
                className="flex-1 gap-1 text-xs px-2"
              >
                <UserPlus className="w-4 h-4" />
                Comunidad
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chats" className="space-y-2">
              <ChatComponent />
            </TabsContent>

            <TabsContent value="groups" className="space-y-2">
              <GruposComponent />
            </TabsContent>

            <TabsContent value="community" className="space-y-6">
              <ComunidadComponent searchQuery={searchQuery} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default Lista;
