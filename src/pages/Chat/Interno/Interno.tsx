import { Interno as InternoComponent } from "@/components/Chat/Chat/Interno/Interno";
import { AppLayout } from "@/components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NetworkContext } from "@/context/NetworkContext";
import { formatDate } from "@/helpers/Fechas";
import { useBackButton } from "@/hooks/useBackButton";
import { cn } from "@/lib/utils";
import { sendPush } from "@/services/push";
import {
  addData,
  doDisconnect,
  readData,
  writeData,
} from "@/services/realtime-db";
import { onValue } from "firebase/database";
import { ArrowLeft, Send, Smile, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const Interno: React.FC = () => {
  const { room } = useParams<any>();
  const { user } = useSelector((state: any) => state.user);
  const { status, baseURL, AvatarLogo } = useContext(NetworkContext);

  const [otherUser, setOtherUser] = useState<any>(null);
  const [dataUserRoom, setDataUserRoom] = useState<any>(null);
  const [isWriting, setIsWriting] = useState<any>(false);
  const [newMessage, setNewMessage] = useState<any>("");
  const [replyTo, setReplyTo] = useState<any>(null);

  const onCheckInput = async (e: any) => {
    setNewMessage(e.target.value);

    const writingStatus = e.target.value ? true : false;
    await writeData(`rooms/${room}/users/${user.id}/writing`, writingStatus);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const fecha = new Date();

      const message = {
        user: user.id,
        fecha: fecha.toLocaleDateString(),
        hora: fecha.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: fecha.toISOString(),
        mensaje: newMessage,
        reply: {
          id: replyTo?.id ?? null,
          from: replyTo?.user ?? null,
          mensaje: replyTo?.mensaje ?? null,
        },
      };

      setNewMessage("");
      setReplyTo(null);

      const sendPushPromise = sendPush({
        users_id: [otherUser.id],
        title: user.name,
        description:
          message.mensaje.length > 25
            ? message.mensaje.substring(0, 22) + "..."
            : message.mensaje,
        room,
      });

      await Promise.all([
        await addData(`rooms/${room}/messages`, message),
        await writeData(`rooms/${room}/users/${user.id}/writing`, false),
        sendPushPromise,
      ]);

      // requestAnimationFrame(() => scrollToBottom());
    } catch (error) {
      console.error("Error enviando mensaje:", error);
    }
  };

  useEffect(() => {
    let unsubRoom: any;
    let unsubTyping: any;
    let unsubUsers: any;

    const onGetRoom = async () => {
      const otherUser = room.split("_").find((id: any) => id != user.id) ?? 0;

      unsubRoom = onValue(
        readData(`rooms/${room}/users/${otherUser}`),
        async (snapshot) => {
          setDataUserRoom(snapshot.val());
        }
      );

      unsubTyping = onValue(
        readData(`rooms/${room}/users/${otherUser}/writing`),
        (snap) => {
          return setIsWriting(!!snap.val());
        }
      );

      unsubUsers = onValue(readData(`users/${otherUser}`), async (snapshot) => {
        setOtherUser({ ...snapshot.val() });
      });
    };

    onGetRoom();

    return () => {
      unsubRoom();
      unsubUsers();
      unsubTyping();
    };
  }, [room]);

  // Al entrar al chat
  useEffect(() => {
    const onEnter = async () => {
      if (!room || !user) return;

      await writeData(`rooms/${room}/users/${user.id}/exit_time`, null);
      await writeData(`rooms/${room}/users/${user.id}/unreads`, 0);
    };
    onEnter();

    const onDisconnect = () => {
      try {
        doDisconnect(`rooms/${room}/users/${user.id}`, {
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
        await writeData(`rooms/${room}/users/${user.id}/writing`, false);
        await writeData(
          `rooms/${room}/users/${user.id}/exit_time`,
          new Date().toISOString()
        );
      };

      onExit();
    };
  }, [user, room]);

  useBackButton("/chat");

  return (
    <AppLayout hideNav>
      <div className="h-full bg-background flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 safe-top">
          <div className="flex items-center gap-3">
            <Link to={`/chat`} replace={true}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>

            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  className="object-cover w-full h-full"
                  src={status ? baseURL + otherUser?.photo : AvatarLogo}
                  alt={otherUser?.name}
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {otherUser?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {dataUserRoom?.exit_time ? null : (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-card" />
              )}
            </div>

            <div className="flex-1">
              <h2 className="font-semibold text-foreground !mb-0 line-clamp-1">
                {otherUser?.name}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isWriting ? (
                  <i> Escribiendo... </i>
                ) : dataUserRoom?.exit_time ? (
                  formatDate(dataUserRoom?.exit_time)
                ) : (
                  "En línea"
                )}
              </p>
            </div>

            {/*
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
            */}
          </div>
        </div>

        {/* Messages */}
        <InternoComponent
          roomID={room}
          setReplyTo={setReplyTo}
        />

        {/* Input */}
        <div className="sticky bottom-0 z-10 bg-card border-t border-border px-4 py-3 safe-bottom">
          {replyTo?.id && (
            <div
              className={cn(
                "border-l border-l-4 border-primary",
                "text-xs relative mb-2",
                "px-1.5 py-1.5 rounded-sm italic",
                "bg-primary-foreground text-primary"
              )}
            >
              <div className="flex flex-col">
                <span className="font-bold text-muted-foreground">
                  {replyTo?.reply?.from == user.id ? "Tú" : otherUser?.name}
                </span>
                <span className="text-muted-foreground">
                  {replyTo?.mensaje}
                </span>
              </div>
              <X
                className=" w-4 h-4 absolute top-1 right-1 cursor-pointer"
                onClick={() => setReplyTo(null)}
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* 
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Paperclip className="w-5 h-5" />
              </Button>
            */}
            <div className="flex-1 relative">
              <Input
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={onCheckInput}
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
