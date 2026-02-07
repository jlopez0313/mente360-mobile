import { Link, useParams } from "react-router-dom";

import { useContext, useEffect, useState } from "react";

import { Grupo as GrupoComponent } from "@/components/Chat/Grupos/Grupo/Grupo";
import { AppLayout } from "@/components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NetworkContext } from "@/context/NetworkContext";
import { useBackButton } from "@/hooks/useBackButton";
import {
  doDisconnect,
  getData,
  readData,
  snapshotToArray,
  writeData,
} from "@/services/realtime-db";
import { onValue } from "firebase/database";
import {
  ArrowLeft,
  MoreVertical,
  Paperclip,
  Send,
  Smile,
  Users,
} from "lucide-react";
import { useSelector } from "react-redux";

const Grupo: React.FC = () => {
  const { baseURL, AvatarLogo } = useContext(NetworkContext);
  const { user } = useSelector((state: any) => state.user);

  const { id: groupId } = useParams<any>();
  const [newMessage, setNewMessage] = useState("");

  const [grupo, setGrupo] = useState<any>(null);
  const [lastUser, setLastUser] = useState<any>(null);
  const [isWriting, setIsWriting] = useState<any>(null);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: GroupMessage = {
      id: Date.now().toString(),
      text: newMessage,
      senderName: "Tú",
      isMe: true,
      time: new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    let unsubRoom: any;
    let unsubTyping: any;
    let unsubUsers: any;

    const onGetRoom = async () => {
      unsubRoom = onValue(readData(`grupos/${groupId}`), async (snapshot) => {
        setGrupo({
          ...snapshot.val(),
          users: snapshotToArray(snapshot.val().users),
        });
      });

      unsubTyping = onValue(
        readData(`grupos/${groupId}/users`),
        async (snap) => {
          const usuarios = snapshotToArray(snap.val());
          const userWriting = usuarios.find((usuario: any) => usuario.writing);

          if (userWriting) {
            const data = await getData(`users/${userWriting.id}`);
            setLastUser(data.val());
          }

          return setIsWriting(userWriting);
        }
      );
    };

    onGetRoom();

    return () => {
      unsubRoom();
      unsubTyping();
    };
  }, [groupId]);

  // Al entrar al chat
  useEffect(() => {
    const onEnter = async () => {
      if (!groupId || !user) return;

      await writeData(`grupos/${groupId}/users/${user.id}/exit_time`, null);
      await writeData(`grupos/${groupId}/users/${user.id}/unreads`, 0);
    };
    onEnter();

    const onDisconnect = () => {
      try {
        doDisconnect(`grupos/${groupId}/users/${user.id}`, {
          writing: false,
          exit_time: new Date().toISOString(),
          unreads: 0,
        });
      } catch (error) {
        console.error(error);
      }
    };
    onDisconnect();

    return () => {
      const onExit = async () => {
        await writeData(`grupos/${groupId}/users/${user.id}/writing`, false);
        await writeData(
          `grupos/${groupId}/users/${user.id}/exit_time`,
          new Date().toISOString()
        );
      };

      onExit();
    };
  }, [user, groupId]);

  useBackButton("/chat");

  return (
    <AppLayout hideNav>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 safe-top">
          <div className="flex items-center gap-3">
            <Link to={`/chat/`} replace={true}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>

            <Avatar className="w-10 h-10">
              <AvatarImage
                className="object-cover w-full h-full"
                src={grupo?.photo ? baseURL + grupo.photo : AvatarLogo}
                alt={grupo?.grupo}
              />
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {grupo?.grupo.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h2 className="font-semibold text-foreground !mb-0 line-clamp-1">{grupo?.grupo}</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {isWriting && lastUser?.name ? (
                  <>
                    {" "}
                    {lastUser?.name}: <i>Escribiendo...</i>{" "}
                  </>
                ) : (
                  <>
                    <Users className="w-3 h-3" />
                    {grupo?.users?.length} miembros
                  </>
                )}
              </p>
            </div>

            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <GrupoComponent grupoID={groupId} grupo={grupo} />

        {/* Input */}
        <div className="sticky bottom-0 bg-card border-t border-border px-4 py-3 safe-bottom">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Paperclip className="w-5 h-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10 bg-background border-border"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              >
                <Smile className="w-4 h-4" />
              </Button>
            </div>
            <Button
              size="icon"
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Grupo;
