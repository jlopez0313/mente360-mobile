

import { useHistory, useParams } from "react-router-dom";

import { AppLayout } from "@/components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockChats } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { ArrowLeft, MoreVertical, Paperclip, Phone, Send, Smile, Video } from "lucide-react";
import { useEffect, useState } from "react";

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
}

const mockMessages: Message[] = [
  { id: "1", text: "¡Hola! ¿Cómo estás hoy?", sender: "other", time: "10:30" },
  { id: "2", text: "¡Hola! Muy bien, gracias. ¿Y tú?", sender: "me", time: "10:31" },
  { id: "3", text: "También bien. ¿Pudiste hacer los ejercicios de respiración?", sender: "other", time: "10:32" },
  { id: "4", text: "Sí, me ayudaron mucho. Me siento más tranquilo.", sender: "me", time: "10:33" },
  { id: "5", text: "¡Qué bueno! Recuerda practicarlos todos los días.", sender: "other", time: "10:34" },
  { id: "6", text: "Lo haré. Gracias por el apoyo 🙏", sender: "me", time: "10:35" },
];

const Interno: React.FC = () => {
  const history = useHistory();
  const { room: chatId } = useParams<any>();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");

  const chat = mockChats.find(c => c.id === chatId);

  if (!chat) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chat no encontrado</p>
      </div>
    );
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
    };
    
    setMessages(prev => [...prev, message]);
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

  return (
    <AppLayout>
      <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 safe-top">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarImage src={chat.participant.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {chat.participant.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {chat.participant.isOnline && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-card" />
            )}
          </div>
          
          <div className="flex-1">
            <h2 className="font-semibold text-foreground">{chat.participant.name}</h2>
            <p className="text-xs text-muted-foreground">
              {chat.participant.isOnline ? "En línea" : "Desconectado"}
            </p>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === "me" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] px-4 py-2.5 rounded-2xl",
                message.sender === "me"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border rounded-bl-md"
              )}
            >
              <p className="text-sm">{message.text}</p>
              <p className={cn(
                "text-[10px] mt-1",
                message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
              )}>
                {message.time}
              </p>
            </div>
          </div>
        ))}
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

export default Interno;
