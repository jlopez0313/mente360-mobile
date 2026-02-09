import {
  childAdded,
  childChanged,
  getQuery,
  queryTo,
  readData,
  removeData,
  snapshotToArray,
  writeData,
} from "@/services/realtime-db";
import { IonModal, IonPopover } from "@ionic/react";
import EmojiPicker, { SkinTonePickerLocation } from "emoji-picker-react";
import { onValue } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Item } from "./Item";

const PAGINATION_LIMIT = 20;

export const Grupo: React.FC<any> = ({ grupoID, setReplyTo, removed }) => {
  const { user } = useSelector((state: any) => state.user);
  const [mensaje, setMensaje] = useState("");

  const chatListRef = useRef<HTMLIonListElement>(null);

  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const [usuarios, setUsuarios] = useState<any>([]);
  const [otherUser, setOtherUser] = useState<any>({});
  const [sender, setSender] = useState<any>({});

  const [popoverEvent, setPopoverEvent] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState(0.75);
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);

  const reactToMessage = async (message: any | null, emoji: string) => {
    const reactionPath = `grupos/${grupoID}/messages/${message?.id}/reactions/${user.id}`;

    if (!message.reactions?.[user.id]) {
      await writeData(reactionPath, emoji);
    } else {
      if (message.reactions?.[user.id] != emoji) {
        await writeData(reactionPath, emoji);
      } else {
        await removeData(reactionPath);
      }
    }
  };

  const onScrollToMessage = async (msg: any) => {
    const replyId = msg.reply.id;

    if (!messages.find((m: any) => m.id === replyId)) {
      const baseQuery = await queryTo("grupos/" + grupoID + "/messages", {
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

  const scrollToBottom = () => {
    const last = messages.slice(-1)[0];
    if (!last) return;
    const el = document.getElementById(`msg-${last.id}`);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
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
    if (!grupoID) return;

    const onGetChat = async () => {
      const baseQuery = await queryTo("grupos/" + grupoID + "/messages", {
        orderBy: "date",
        limit: PAGINATION_LIMIT,
        direction: "last",
      });

      const snapshot = await getQuery(baseQuery);
      const messages = snapshotToArray(snapshot.val());
      setMessages(messages);
    };

    onGetChat();

    const unsubUsuarios = onValue(readData("users"), (snapshot) => {
      const lista = snapshotToArray(snapshot.val());
      setUsuarios(lista);
    });

    const unsubChanged = childChanged(
      "grupos/" + grupoID + "/messages",
      (snap: any) => {
        const updated = snap.val();

        setMessages((prev: any) =>
          prev.map((m: any) =>
            m.id === snap.key ? { id: snap.key, ...updated } : m
          )
        );
      }
    );

    const unsubAdded = childAdded(
      `grupos/${grupoID}/messages`,
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

    if( removed ) {
      unsubChanged();
      unsubAdded();
      unsubUsuarios();
    }

    return () => {
      unsubChanged();
      unsubAdded();
      unsubUsuarios();
    };
  }, [grupoID, removed]);

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      ref={chatListRef}
      onScroll={handleScroll}
    >
      {messages.map((message, index) => {
        return (
          <Item
            key={index}
            index={index}
            message={message}
            user={user}
            usuarios={usuarios}
            setReplyTo={setReplyTo}
            setPopoverEvent={setPopoverEvent}
            onScrollToMessage={onScrollToMessage}
            setSelectedMessage={setSelectedMessage}
          />
        );
      })}

      <IonPopover
        showBackdrop={false}
        isOpen={selectedMessage ? true : false}
        className="fixed z-10"
        style={{
          "--background": "transparent",
          "--box-shadow": "none",
          top: (popoverEvent?.top ?? 0) - 390,
          transform: "none",
        }}
        onDidDismiss={() => setSelectedMessage(null)}
      >
        <div className="flex border bg-white gap-2 h-full rounded-full p-2">
          {["👍", "❤️", "😂", "😮", "😢", "🙏"].map((emoji) => (
            <span
              className="text-lg"
              key={emoji}
              onClick={() => {
                reactToMessage(selectedMessage, emoji);
                setSelectedMessage(null);
              }}
            >
              {emoji}
            </span>
          ))}
          <span
            className="text-lg border border-muted rounded-full w-7 h-7 flex items-center justify-center"
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
        initialBreakpoint={0.75}
        onDidDismiss={() => {
          setSelectedMessage(null);
          setShowEmojiModal(false);
        }}
        onIonBreakpointDidChange={(e) => {
          const newBp = (e as CustomEvent).detail.breakpoint;
          setCurrentBreakpoint(newBp);
        }}
      >
        <div style={{ height: "100%", padding: 16, touchAction: "none" }}>
          <EmojiPicker
            width={"100%"}
            height={window.innerHeight * currentBreakpoint - 30 + "px"}
            skinTonePickerLocation={SkinTonePickerLocation.PREVIEW}
            previewConfig={{ showPreview: false }}
            onEmojiClick={(emoji) => {
              reactToMessage(selectedMessage!, emoji.emoji);
              setSelectedMessage(null);
              setShowEmojiModal(false);
            }}
            onReactionClick={(emoji) => {
              reactToMessage(selectedMessage!, emoji.emoji);
              setSelectedMessage(null);
              setShowEmojiModal(false);
            }}
          />
        </div>
      </IonModal>
    </div>
  );
};
