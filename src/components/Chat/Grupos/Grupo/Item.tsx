import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NetworkContext } from "@/context/NetworkContext";
import { cn } from "@/lib/utils";
import {
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
} from "@ionic/react";
import { Undo2 } from "lucide-react";
import React, { useContext, useState } from "react";

export const Item: React.FC<any> = ({
  message,
  usuarios,
  setReplyTo,
  user,
  onScrollToMessage,
  setPopoverEvent,
  setSelectedMessage,
}: any) => {
  const showSender = message.user != user.id;
  const { status, baseURL, AvatarLogo } = useContext(NetworkContext);

  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const groupReactions = (reactions: Record<string, string>) => {
    const grouped: Record<string, number> = {};

    Object.values(reactions).forEach((emoji) => {
      if (grouped[emoji]) {
        grouped[emoji] += 1;
      } else {
        grouped[emoji] = 1;
      }
    });

    return grouped;
  };

  const onGetSender = (userId: any) => {
    return usuarios.find((u: any) => u.id == userId);
  };

  const handleTouchStart = (e: any, msg: any) => {
    const touchY = e.touches[0].clientY;
    setTouchStartY(touchY);

    const target = e.currentTarget.getBoundingClientRect();
    setPopoverEvent({
      top: target.top,
      left: target.left,
    });

    const timer = setTimeout(() => {
      setSelectedMessage(msg);
    }, 500);
    setLongPressTimer(timer);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY !== null) {
      const currentY = e.touches[0].clientY;
      const diffY = Math.abs(currentY - touchStartY);

      if (diffY > 10) {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          setLongPressTimer(null);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

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
      <IonItem
        id={`msg-${message.id}`}
        className="ion-no-bg"
        lines="none"
        onTouchStart={(e) => handleTouchStart(e, message)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          slot={message.user == user.id ? "end" : ""}
          className={cn(
            "max-w-[80%]",
            "flex",
            message.user == user.id ? "justify-end" : "justify-start text-muted-foreground"
          )}
        >
          <div
            className={cn(
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
                <AvatarFallback className="bg-primary/10 text-primary uppercase font-bold text-[10px]">
                  {onGetSender(message.user)?.name?.charAt(0) || ""}
                </AvatarFallback>
              </Avatar>
            )}

            {showSender && message.user != user.id && (
              <p className="text-xs text-primary font-medium mb-1 ml-1">
                {onGetSender(message.user)?.name}
              </p>
            )}

            <div
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

      {message.reactions && (
        <div
          className={cn(
            "relative flex w-fit items-center gap-2 -mt-[18px] p-2 z-10",
            message.user == user.id ? "float-right" : ""
          )}
        >
          {Object.entries(groupReactions(message.reactions || {})).map(
            ([emoji, count]) => (
              <div key={emoji}>
                <span>{emoji}</span>
                {count > 1 && <span>{`x${count}`}</span>}
              </div>
            )
          )}
        </div>
      )}

      <IonItemOptions side="start">
        <IonItemOption color="light">
          <Undo2 className="w-4 h-4" />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};
