

import { Link, useHistory } from "react-router-dom";

import { AppLayout } from "@/components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/helpers/Fechas";
import { destroy } from "@/helpers/musicControls";
import { useToast } from "@/hooks/use-toast";
import { invitationLink, mockContacts } from "@/lib/mockContacts";
import { mockChats, mockGroups } from "@/lib/mockData";
import { setShowGlobalAudio } from "@/store/slices/audioSlice";
import { Check, Copy, MessageCircle, Search, Share2, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Chat: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chats");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const contactsWithApp = mockContacts.filter(c => c.hasApp);

  const filteredChats = mockChats.filter(chat =>
    chat.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = mockGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      toast({
        title: "Link copiado",
        description: "El link de invitación se copió al portapapeles",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Error",
        description: "No se pudo copiar el link",
        variant: "destructive",
      });
    }
  };

  const handleShareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Únete a Mente 360",
          text: "Te invito a unirte a Mente 360, una app de bienestar mental",
          url: invitationLink,
        });
      } catch {
        // User cancelled sharing
      }
    } else {
      handleCopyLink();
    }
  };

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
            <TabsTrigger value="community" className="flex-1 gap-1 text-xs px-2">
              <UserPlus className="w-4 h-4" />
              Comunidad
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chats" className="space-y-2">
            {filteredChats.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No hay chats</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <Link
                  key={chat.id}
                  to={`/chat/${chat.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={chat.participant.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {chat.participant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {chat.participant.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground truncate">
                        {chat.participant.name}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(chat.lastMessage.date)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage.isFromMe && "Tú: "}{chat.lastMessage.text}
                    </p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <Badge className="bg-primary text-primary-foreground">
                      {chat.unreadCount}
                    </Badge>
                  )}
                </Link>
              ))
            )}
          </TabsContent>

          <TabsContent value="groups" className="space-y-2">
            {filteredGroups.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No hay grupos</p>
              </div>
            ) : (
              filteredGroups.map((group) => (
                <Link
                  key={group.id}
                  to={`/grupo/${group.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={group.avatar} />
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {group.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground truncate">
                        {group.name}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(group.lastMessage.date)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {group.lastMessage.sender}: {group.lastMessage.text}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-muted-foreground">
                      {group.memberCount} miembros
                    </span>
                  </div>
                </Link>
              ))
            )}
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            {/* Invitation Link */}
            <div className="bg-card rounded-2xl border border-border p-4">
              <h3 className="font-semibold text-foreground mb-2">
                Invita a tus amigos
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comparte este link para que tus amigos se unan a Mente 360
              </p>
              
              <div className="flex items-center gap-2 p-3 bg-muted rounded-xl mb-3">
                <span className="flex-1 text-sm text-foreground truncate">
                  {invitationLink}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyLink}
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <Button
                onClick={handleShareLink}
                className="w-full gap-2"
              >
                <Share2 className="w-4 h-4" />
                Compartir en redes
              </Button>
            </div>

            {/* Contacts with App */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">
                Tus contactos en Mente 360
              </h3>
              
              {contactsWithApp.length === 0 ? (
                <div className="text-center py-12">
                  <UserPlus className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Ninguno de tus contactos tiene la app aún
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {contactsWithApp.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {contact.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground truncate">
                          {contact.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {contact.phone}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        En la app
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Chat;
