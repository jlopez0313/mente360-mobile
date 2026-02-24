import { useChat } from "@/hooks/useChat";
import React from "react";
import { useSelector } from "react-redux";
import { Interacciones } from "../../Interacciones";
import { Item } from "./Item";

export const Interno: React.FC<any> = ({ roomID, setReplyTo }) => {
  const { user } = useSelector((state: any) => state.user);

  const {
    chatListRef,
    topSentinelRef,
    messages,
    selectedMessage,
    setSelectedMessage,
    popoverEvent,
    setPopoverEvent,
    onScrollToMessage,
    setPendingScrollId,
  } = useChat({ basePath: roomID ? `rooms/${roomID}` : "" });

  return (
    <div
      ref={chatListRef}
      className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
    >
      <div ref={topSentinelRef} className="h-2" />

      {messages.map((message: any) => (
        <Item
          key={message.id}
          message={message}
          user={user}
          setReplyTo={setReplyTo}
          setPopoverEvent={setPopoverEvent}
          onScrollToMessage={onScrollToMessage}
          setPendingScrollId={setPendingScrollId}
          setSelectedMessage={setSelectedMessage}
        />
      ))}

      <Interacciones
        route={`rooms/${roomID}/messages/${selectedMessage?.id}/reactions/${user.id}`}
        selectedMessage={selectedMessage}
        setSelectedMessage={setSelectedMessage}
        popoverEvent={popoverEvent}
      />
    </div>
  );
};
