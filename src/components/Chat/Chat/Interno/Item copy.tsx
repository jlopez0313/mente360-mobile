import { getData, removeData, writeData } from "@/services/realtime-db";
import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonModal,
  IonPopover,
  IonText,
} from "@ionic/react";
import EmojiPicker, { SkinTonePickerLocation } from "emoji-picker-react";
import { returnUpBack } from "ionicons/icons";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Interno.module.scss";

export const Item: React.FC<any> = ({
  idx,
  roomID,
  setReplyTo,
  msg,
  usuario,
  closeFromParent,
}) => {
  const { user } = useSelector((state: any) => state.user);

  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState(0.75);

  const [popoverEvent, setPopoverEvent] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );

  const onScrollToMessage = (msg: any) => {
    const original = document.getElementById(`msg-${msg.reply.index}`);
    if (original) {
      original.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      original.classList.add(styles["highlight"]);
      setTimeout(() => {
        original.classList.remove(styles["highlight"]);
      }, 1000);
    }
  };

  const handleTouchStart = (e: any, msgId: string) => {
    const touchY = e.touches[0].clientY;
    setTouchStartY(touchY);

    const target = e.currentTarget.getBoundingClientRect();
    setPopoverEvent({
      top: target.top,
      left: target.left,
    });

    const timer = setTimeout(() => {
      setSelectedMessageId(msgId);
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

  const reactToMessage = async (messageId: string | null, emoji: string) => {
    const reactionPath = `rooms/${roomID}/messages/${messageId}/reactions/${user.id}`;

    const snapshot = await getData(reactionPath);
    const currentReaction = snapshot.exists() ? snapshot.val() : null;

    if (currentReaction === emoji) {
      await removeData(reactionPath);
    } else {
      await writeData(reactionPath, emoji);
    }
  };

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

  return (
    <IonItemSliding
      key={idx}
      onIonDrag={(e) => {
        const detail = (e as CustomEvent).detail;
        if (detail.ratio < -1.75) {
          (e.target as HTMLIonItemSlidingElement).close();
          setReplyTo({ ...msg, reply: { from: msg.user }, index: idx });
        }
      }}
      onClick={closeFromParent}
    >
      <IonItem
        id={`msg-${idx}`}
        button={true}
        className={`${styles["message"]} ${
          msg.user === user.id ? styles["sender"] : styles["receiver"]
        } `}
        onTouchStart={(e) => handleTouchStart(e, msg.id)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div>
          {msg.reply && (
            <div
              className={styles["reply-preview"]}
              onClick={() => onScrollToMessage(msg)}
            >
              <IonText color="medium" className={styles["reply-name"]}>
                {msg.reply.from == user.id ? "Tu" : usuario.name}
              </IonText>
              <IonText color="medium" className={styles["reply-text"]}>
                {msg.reply.mensaje}
              </IonText>
            </div>
          )}
          <div>
            <IonText className={styles["message"]}> {msg.mensaje} </IonText>
            <span className={styles["time"]}> {msg.hora} </span>
          </div>
        </div>
      </IonItem>

      <IonPopover
        showBackdrop={false}
        isOpen={selectedMessageId ? true : false}
        className={styles["popover"]}
        style={{
          position: "fixed",
          top: (popoverEvent?.top ?? 0) - 390,
          transform: "none",
          zIndex: 9999,
        }}
        onDidDismiss={() => setSelectedMessageId(null)}
      >
        <div className={styles["quick-reactions"]}>
          {["👍", "❤️", "😂", "😮", "😢", "🙏"].map((emoji) => (
            <span
              key={emoji}
              className={styles["reaction-button"]}
              onClick={() => {
                reactToMessage(selectedMessageId, emoji);
                setSelectedMessageId(null);
              }}
            >
              {emoji}
            </span>
          ))}
          <span
            className={styles["add-reaction-button"]}
            onClick={() => {
              setShowEmojiModal(true);
            }}
          >
            +
          </span>
        </div>
      </IonPopover>

      <IonModal
        handleBehavior="cycle"
        canDismiss={true}
        isOpen={showEmojiModal}
        className={styles["emoji-modal"]}
        initialBreakpoint={0.75}
        onDidDismiss={() => {
          setSelectedMessageId(null);
          setShowEmojiModal(false);
        }}
        onIonBreakpointDidChange={(e) => {
          const newBp = (e as CustomEvent).detail.breakpoint;
          setCurrentBreakpoint(newBp);
        }}
      >
        <div
          className={styles["emoji-content"]}
          style={{ height: "100%", padding: 16, touchAction: "none" }}
        >
          <EmojiPicker
            width={"100%"}
            height={window.innerHeight * currentBreakpoint - 30 + "px"}
            skinTonePickerLocation={SkinTonePickerLocation.PREVIEW}
            previewConfig={{ showPreview: false }}
            onEmojiClick={(emoji) => {
              reactToMessage(selectedMessageId!, emoji.emoji);
              setSelectedMessageId(null);
              setShowEmojiModal(false);
            }}
            onReactionClick={(emoji) => {
              reactToMessage(selectedMessageId!, emoji.emoji);
              setSelectedMessageId(null);
              setShowEmojiModal(false);
            }}
          />
        </div>
      </IonModal>

      {msg.reactions && (
        <div
          className={`${styles["reactions"]} ${
            msg.user === user.id ? styles["sender"] : styles["receiver"]
          }`}
        >
          {Object.entries(groupReactions(msg.reactions || {})).map(
            ([emoji, count]) => (
              <div key={emoji}>
                <span className={styles["emoji"]}>{emoji}</span>
                {count > 1 && (
                  <span className={styles["count"]}>{`x${count}`}</span>
                )}
              </div>
            )
          )}
        </div>
      )}

      <IonItemOptions side="start">
        <IonItemOption color="light">
          <IonIcon slot="icon-only" icon={returnUpBack} />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};
