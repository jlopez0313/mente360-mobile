import { useChat } from "@/hooks/useChat";
import { useSelector } from "react-redux";
import { Interacciones } from "../../Interacciones";
import { Item } from "./Item";

export const Grupo = ({ grupoID, setReplyTo, initialMessageId }: any) => {
  const { user } = useSelector((state: any) => state.user);

  const {
    chatListRef,
    topSentinelRef,
    messages,
    usuarios,
    selectedMessage,
    setSelectedMessage,
    popoverEvent,
    setPopoverEvent,
    onScrollToMessage,
    setPendingScrollId,
  } = useChat({
    basePath: grupoID ? `grupos/${grupoID}` : "",
    withUsers: true,
    initialMessageId: initialMessageId,
    userId: user?.id,
  });

  return (
    <div
      ref={chatListRef}
      className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
    >
      <div ref={topSentinelRef} className="h-2" />

      {messages.map((message) => (
        <Item
          key={message.id}
          message={message}
          user={user}
          usuarios={usuarios}
          setReplyTo={setReplyTo}
          setPopoverEvent={setPopoverEvent}
          onScrollToMessage={onScrollToMessage}
          setPendingScrollId={setPendingScrollId}
          setSelectedMessage={setSelectedMessage}
        />
      ))}

      <Interacciones
        route={`grupos/${grupoID}/messages/${selectedMessage?.id}/reactions/${user.id}`}
        selectedMessage={selectedMessage}
        setSelectedMessage={setSelectedMessage}
        popoverEvent={popoverEvent}
      />
    </div>
  );
};
