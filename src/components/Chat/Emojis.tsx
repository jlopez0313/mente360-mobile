import { IonModal } from "@ionic/react";
import EmojiPicker, { SkinTonePickerLocation } from "emoji-picker-react";
import { useState } from "react";

interface Props {
  showEmojiModal: boolean;
  setShowEmojiModal: (show: boolean) => void;
  selectedMessage: any | null;
  setSelectedMessage: (msg: any | null) => void;
  reactToMessage: (message: any, emoji: string) => void;
}

export const Emojis = ({
  showEmojiModal,
  setShowEmojiModal,
  selectedMessage,
  setSelectedMessage,
  reactToMessage,
}: Props) => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState(0.75);

  return (
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
  );
};
