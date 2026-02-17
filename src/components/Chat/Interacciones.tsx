import { removeData, writeData } from "@/services/realtime-db";
import { IonPopover } from "@ionic/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Emojis } from "./Emojis";

interface Props {
  route: string;
  selectedMessage: any | null;
  popoverEvent: any | null;
  setSelectedMessage: (msg: any | null) => void;
}

export const Interacciones = ({
  route,
  selectedMessage,
  setSelectedMessage,
  popoverEvent,
}: Props) => {
  const { user } = useSelector((state: any) => state.user);

  const [showEmojiModal, setShowEmojiModal] = useState(false);

  const reactToMessage = async (message: any, emoji: string) => {
    const reactionPath = route;

    if (!message.reactions?.[user.id]) {
      await writeData(reactionPath, emoji);
    } else {
      if (message.reactions[user.id] !== emoji) {
        await writeData(reactionPath, emoji);
      } else {
        await removeData(reactionPath);
      }
    }
  };

  return (
    <>
      <IonPopover
        showBackdrop={false}
        isOpen={!!selectedMessage}
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
              key={emoji}
              className="text-lg"
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

      <Emojis
        reactToMessage={reactToMessage}
        selectedMessage={selectedMessage}
        setSelectedMessage={setSelectedMessage}
        showEmojiModal={showEmojiModal}
        setShowEmojiModal={setShowEmojiModal}
      />
    </>
  );
};
