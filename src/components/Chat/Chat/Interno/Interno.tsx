import { cn } from "@/lib/utils";
import {
  childAdded,
  getQuery,
  queryTo,
  snapshotToArray,
  writeData,
} from "@/services/realtime-db";
import {
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
} from "@ionic/react";
import { Undo2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const PAGINATION_LIMIT = 20;
export const Interno: React.FC<any> = ({
  usuario,
  roomID,
  replyTo,
  setReplyTo,
}) => {
  const { user } = useSelector((state: any) => state.user);
  const [mensaje, setMensaje] = useState("");

  const chatListRef = useRef<any>(null);
  const hasScrolledInitially = useRef(false);

  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [messages, setMessages] = useState<any>([]);
  const [otherUser, setOtherUser] = useState<any>({});
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);

  const onScrollToMessage = async (msg: any) => {
    const replyId = msg.reply.id;

    if (!messages.find((m: any) => m.id === replyId)) {
      const baseQuery = await queryTo("rooms/" + roomID + "/messages", {
        orderBy: "key",
        startAt: replyId,
        endAt: messages[0].id,
        direction: "last",
      });

      const snapshot = await getQuery(baseQuery);
      const oldMessages = snapshotToArray(snapshot.val());
      oldMessages.pop();

      setMessages((prev) => [...oldMessages, ...prev]);
    }

    setPendingScrollId(replyId);
  };

  const onCheckInput = async (e: any) => {
    setMensaje(e.target.value);

    const writingStatus = e.target.value ? true : false;
    await writeData(`rooms/${roomID}/users/${user.id}/writing`, writingStatus);
  };

  const scrollToBottom = () => {
    if (chatListRef.current) {
      chatListRef.current.scrollTo({
        top: chatListRef.current.scrollHeight,
        behavior: "smooth",
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
  }, [messages]);

  useEffect(() => {
    if (!pendingScrollId) return;

    const el = document.getElementById(`msg-${pendingScrollId}`);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    el.classList.add(
      "bg-yellow-200/60",
      "!text-primary",
      "transition-colors",
      "duration-400"
    );

    const t = setTimeout(() => {
      el.classList.remove("bg-yellow-200/60", "!text-primary");
    }, 800);

    setPendingScrollId(null);
  }, [messages, pendingScrollId]);

  useEffect(() => {
    if (!roomID) return;

    const onGetChat = async () => {
      const baseQuery = await queryTo("rooms/" + roomID + "/messages", {
        orderBy: "date",
        limit: PAGINATION_LIMIT,
        direction: "last",
      });

      const snapshot = await getQuery(baseQuery);
      const messages = snapshotToArray(snapshot.val());
      setMessages(messages);
    };

    onGetChat();

    const unsubscribe = childAdded(
      `rooms/${roomID}/messages`,
      (snapshot: any) => {
        const newMsg = {
          id: snapshot.key,
          ...snapshot.val(),
        };

        setMessages((prev: any) => {
          if (prev.some((m: any) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      }
    );

    return () => unsubscribe();
  }, [roomID]);

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      ref={chatListRef}
      onScroll={handleScroll}
    >
      {messages.map((message: any, idx: number) => (
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
                "max-w-[80%] px-4 py-2.5 rounded-2xl",
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
                    {message.reply.from == user.id ? "Tu" : usuario?.name}
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
          </IonItem>
          <IonItemOptions side="start">
            <IonItemOption color="light">
              <Undo2 className="w-4 h-4" />
            </IonItemOption>
          </IonItemOptions>
        </IonItemSliding>
      ))}
    </div>
  );
};
