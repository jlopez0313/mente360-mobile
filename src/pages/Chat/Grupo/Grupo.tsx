import { useHistory, useParams } from "react-router-dom";

import { useContext, useEffect, useState } from "react";

import { AppLayout } from "@/components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NetworkContext } from "@/context/NetworkContext";
import { cn } from "@/lib/utils";
import { readData, snapshotToArray } from "@/services/realtime-db";
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

interface GroupMessage {
  id: string;
  text: string;
  senderName: string;
  senderAvatar?: string;
  isMe: boolean;
  time: string;
}

const mockGroupMessages: GroupMessage[] = [
  {
    id: "1",
    text: "¡Buenos días a todos! 🌅",
    senderName: "María",
    isMe: false,
    time: "09:00",
  },
  {
    id: "2",
    text: "Buenos días María, ¿cómo amaneciste?",
    senderName: "Carlos",
    isMe: false,
    time: "09:02",
  },
  {
    id: "3",
    text: "Muy bien, gracias. ¿Listos para el ejercicio de hoy?",
    senderName: "María",
    isMe: false,
    time: "09:03",
  },
  {
    id: "4",
    text: "¡Sí! Estoy motivado",
    senderName: "Tú",
    isMe: true,
    time: "09:05",
  },
  {
    id: "5",
    text: "Recuerden que hoy tenemos meditación guiada a las 7pm",
    senderName: "Dr. García",
    isMe: false,
    time: "09:10",
  },
  {
    id: "6",
    text: "¡Ahí estaré! Gracias por el recordatorio 🙏",
    senderName: "Tú",
    isMe: true,
    time: "09:12",
  },
];

const Grupo: React.FC = () => {
  const history = useHistory();
  const { baseURL, AvatarLogo} = useContext(NetworkContext);
  const { user } = useSelector( (state: any) => state.user);
  
  const { id: groupId } = useParams<any>();

  const [messages, setMessages] = useState<GroupMessage[]>(mockGroupMessages);
  const [newMessage, setNewMessage] = useState("");

  const [grupo, setGrupo] = useState({ grupo: "", photo: "", users: [], messages: [] });

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

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    const handleBackButton = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
      history.replace("/chat");
    };

    document.addEventListener("ionBackButton", handleBackButton);

    return () => {
      document.removeEventListener("ionBackButton", handleBackButton);
    };
  }, [history]);

  useEffect(() => {
    const onGetGrupo = async (id: number) => {
      onValue(readData(`grupos/${id}`), async (snapshot: any) => {
        const data = snapshot.val();
  
        setGrupo({
          ...data,
          users: snapshotToArray(data.users),
          messages: snapshotToArray(data.messages)
        });
  
        const users: any = data ? snapshotToArray(data.users) : [];
  
        const isWriting = users.find(
          (usario: any) => usario.writing && usario.id != user.id
        );
        // setIsWriting(isWriting ?? null);
  
      });
    };

    onGetGrupo(groupId);
  }, [groupId]);

  return (
    <AppLayout>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 safe-top">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <Avatar className="w-10 h-10">
              <AvatarImage
                className="object-cover w-full h-full"
                src={grupo.photo ? baseURL + grupo.photo : AvatarLogo}
                alt={grupo.grupo}
              />
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {grupo.grupo.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h2 className="font-semibold text-foreground">{grupo.grupo}</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3" />
                {grupo.users.length} miembros
              </p>
            </div>

            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((message, index) => {
            const showSender =
              !message.isMe &&
              (index === 0 ||
                messages[index - 1].senderName !== message.senderName);

            return (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.isMe ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%]",
                    !message.isMe && "pl-8 relative"
                  )}
                >
                  {!message.isMe && showSender && (
                    <Avatar className="w-6 h-6 absolute left-0 bottom-0">
                      <AvatarImage
                        className="object-cover w-full h-full"
                        src={message.senderAvatar}
                        alt={grupo.grupo}
                      />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {message.senderName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  {showSender && !message.isMe && (
                    <p className="text-xs text-primary font-medium mb-1 ml-1">
                      {message.senderName}
                    </p>
                  )}

                  <div
                    className={cn(
                      "px-4 py-2.5 rounded-2xl",
                      message.isMe
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card border border-border rounded-bl-md"
                    )}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={cn(
                        "text-[10px] mt-1",
                        message.isMe
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      )}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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
