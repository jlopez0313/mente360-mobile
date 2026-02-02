import { useHistory } from "react-router-dom";

import { Chat as ChatComponent } from "@/components/Chat/Chat/Lista/Chat";
import { Comunidad as ComunidadComponent } from "@/components/Chat/Comunidad/Comunidad";
import { Grupos as GruposComponent } from "@/components/Chat/Grupos/Lista/Grupos";
import { AppLayout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { destroy } from "@/helpers/musicControls";
import { setShowGlobalAudio } from "@/store/slices/audioSlice";
import {
  MessageCircle,
  Search,
  UserPlus,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Chat: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chats");

  useEffect(() => {
    const handleBackButton = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
      history.replace("/home");
    };

    document.addEventListener("ionBackButton", handleBackButton);

    return () => {
      document.removeEventListener("ionBackButton", handleBackButton);
    };
  }, [history]);

  useEffect(() => {
    dispatch(setShowGlobalAudio(false));
    destroy();
  }, []);

  return (
    <AppLayout>
      <div className="px-4 py-6 pb-24">
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
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conversaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="chats" className="flex-1 gap-1 text-xs px-2">
              <MessageCircle className="w-4 h-4" />
              Chats
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex-1 gap-1 text-xs px-2">
              <Users className="w-4 h-4" />
              Grupos
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
    </AppLayout>
  );
};

export default Chat;
