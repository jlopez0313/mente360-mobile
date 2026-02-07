import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NetworkContext } from "@/context/NetworkContext";
import { cn } from "@/lib/utils";
import { sendPush } from "@/services/push";
import {
  addData,
  readData,
  snapshotToArray,
  writeData,
} from "@/services/realtime-db";
import { IonItem, IonItemOption, IonItemOptions, IonItemSliding } from "@ionic/react";
import { onValue } from "firebase/database";
import { Undo2 } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export const Grupo: React.FC<any> = ({ grupoID, grupo, removed }) => {
  const { status, baseURL, AvatarLogo } = useContext(NetworkContext);

  const { user } = useSelector((state: any) => state.user);
  const [mensaje, setMensaje] = useState("");
  const [replyTo, setReplyTo] = useState<any>(null);

  const chatListRef = useRef<HTMLIonListElement>(null);

  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const [usuarios, setUsuarios] = useState<any>([]);
  const [otherUser, setOtherUser] = useState<any>({});
  const [sender, setSender] = useState<any>({});

  const onGetSender = (userId: any) => {
    return usuarios.find((u: any) => u.id == userId);
  };

  const onSendMessage = async () => {
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
        mensaje,
        reply: {
          from: replyTo?.user ?? null,
          mensaje: replyTo?.mensaje ?? null,
          index: replyTo?.index ?? null,
        },
      };

      setMensaje("");
      setReplyTo(null);

      const otherUsers = grupo.users.filter((x: any) => x.id != user.id) || [];

      const sendPushPromise =
        otherUsers.length > 0
          ? sendPush({
              users_id: otherUsers.map((u: any) => u.id),
              title: grupo.grupo,
              description:
                (user.name + ": " + message.mensaje).length > 25
                  ? `${user.name}: ${message.mensaje.substring(0, 22)}...`
                  : `${user.name}: ${message.mensaje}`,
              grupo: grupoID,
            })
          : Promise.resolve();

      await Promise.all([
        addData(`grupos/${grupoID}/messages`, message),
        writeData(`grupos/${grupoID}/users/${user.id}/writing`, false),
        sendPushPromise,
      ]);

      requestAnimationFrame(() => scrollToBottom());
    } catch (error) {
      console.error("Error enviando mensaje al grupo:", error);
    }
  };

  const onCheckInput = async (e: any) => {
    setMensaje(e.target.value);

    const writingStatus = e.target.value ? true : false;
    await writeData(
      `grupos/${grupoID}/users/${user.id}/writing`,
      writingStatus
    );
  };

  const onScrollToMessage = (msg: any) => {
    const original = document.getElementById(`msg-${msg.reply.index}`);
    if (original) {
      original.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      original.classList.add(
        "bg-yellow-200/60",
        "!text-primary",
        "transition-colors",
        "duration-700"
      );
      setTimeout(() => {
        original.classList.remove("bg-yellow-200/60", "!text-primary");
      }, 800);
    }
  };

  const scrollToBottom = () => {
    if (chatListRef.current) {
      const scrollContainer = chatListRef.current;
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "auto",
      });
    }
  };

  const handleScroll = (e: any) => {
    const element = e.target;
    const isAtBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight < 50;
    setIsScrolledUp(!isAtBottom);
  };

  useEffect(() => {
    if (!isScrolledUp) {
      setTimeout(() => {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }, 0);
    }
  }, [messages, isScrolledUp]);

  useEffect(() => {
    const onGetOtherUser = () => {
      setOtherUser(
        replyTo?.reply?.from == user.id
          ? { name: "Tu" }
          : usuarios.find((u: any) => u.id == replyTo?.reply?.from) ?? {}
      );
    };

    onGetOtherUser();
  }, [replyTo]);

  useEffect(() => {
    const onGetChat = async () => {
      onValue(readData("users"), (snapshot) => {
        const lista = snapshotToArray(snapshot.val());
        setUsuarios(lista);
      });

      onValue(readData("grupos/" + grupoID + "/messages"), (snapshot) => {
        const messagesList = snapshotToArray(snapshot.val());

        console.log("messagesList", messagesList);
        setMessages(messagesList);
      });
    };

    onGetChat();
  }, []);

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      ref={chatListRef}
      onScroll={handleScroll}
    >
      {messages.map((message, index) => {
        const showSender = message.user != user.id;

        return (
          <IonItemSliding
          key={message.id}
          onIonDrag={(e) => {
            const detail = (e as CustomEvent).detail;
            if (detail.ratio < -1.75) {
              (e.target as HTMLIonItemSlidingElement).close();
              setReplyTo({ ...message, reply: { from: message.user } });
            }
          }}
        >
          <IonItem id={`msg-${message.id}`} className="ion-no-bg" lines="none">
            <div
              slot={message.user == user.id ? "end" : ""}
              className={cn(
                "flex",
                message.user == user.id ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%]",
                  message.user != user.id && "pl-8 relative"
                )}
              >
                {message.user != user.id && showSender && (
                  <Avatar className="w-6 h-6 absolute left-0 bottom-0">
                    <AvatarImage
                      className="object-cover w-full h-full"
                      src={
                        status
                          ? baseURL + onGetSender(message.user)?.photo
                          : AvatarLogo
                      }
                      alt={onGetSender(message.user)?.name}
                    />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {onGetSender(message.user)?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}

                {showSender && message.user != user.id && (
                  <p className="text-xs text-primary font-medium mb-1 ml-1">
                    {onGetSender(message.user)?.name}
                  </p>
                )}

                <div
                  id={`msg-${index}`}
                  className={cn(
                    "px-4 py-2.5 rounded-2xl",
                    message.user == user.id
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card border border-border rounded-bl-md"
                  )}
                >
                  {message.reply && (
                    <div
                      className={cn(
                        "px-1.5 py-1.5 rounded-sm italic",
                        message.user == user.id
                          ? "bg-primary-foreground text-primary"
                          : "bg-primary border border-border"
                      )}
                      onClick={() => onScrollToMessage(message)}
                    >
                      <span
                        className={cn(
                          "text-xs font-bold",
                          message.user == user.id
                            ? "text-muted-foreground"
                            : "text-primary-foreground"
                        )}
                      >
                        {message.reply.from == user.id
                          ? "Tu"
                          : onGetSender(message.reply.from)?.name}
                      </span>
                      <p
                        className={cn(
                          "text-xs line-clamp-2",
                          message.user == user.id
                            ? "text-muted-foreground"
                            : "text-primary-foreground"
                        )}
                      >
                        {message.reply.mensaje}
                      </p>
                    </div>
                  )}

                  <p className="text-sm">{message.mensaje}</p>
                  <p
                    className={cn(
                      "text-[10px] mt-1",
                      message.user == user.id
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    {message.hora}
                  </p>
                </div>
              </div>
            </div>
          </IonItem>
          <IonItemOptions side="start">
            <IonItemOption color="light">
              <Undo2 className="w-4 h-4" />
            </IonItemOption>
          </IonItemOptions>
        </IonItemSliding>
        );
      })}
    </div>
  );
};
