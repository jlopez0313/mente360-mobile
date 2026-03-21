import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NetworkContext } from "@/context/NetworkContext";
import { formatDate } from "@/helpers/Fechas";
import { useContext } from "react";
import { useHistory } from "react-router-dom";

interface MessageSearchResultProps {
  result: {
    type: "chats" | "groups";
    id: string;
    name: string;
    photo: string;
    messageId: string;
    messageContent: string;
    messageDate: string;
    messageTime: string;
  };
  query: string;
}

export const MessageSearchResult = ({ result, query }: MessageSearchResultProps) => {
  const { baseURL, AvatarLogo } = useContext(NetworkContext);
  const history = useHistory();

  const handleGoToMessage = () => {
    const path = result.type === "chats" ? `/chat/${result.id}` : `/grupo/${result.id}`;
    history.push(`${path}?msgId=${result.messageId}`);
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="bg-primary/20 text-primary font-bold">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div
      onClick={handleGoToMessage}
      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all cursor-pointer"
    >
      <Avatar className="w-10 h-10">
        <AvatarImage
          className="object-cover w-full h-full"
          src={result.photo ? baseURL + result.photo : AvatarLogo}
          alt={result.name}
        />
        <AvatarFallback className="bg-primary/10 text-primary uppercase">
          {result.name?.charAt(0) || ""}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h6 className="!m-0 text-sm font-semibold text-foreground truncate">
            {result.name}
          </h6>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            {formatDate(result.messageDate)} {result.messageTime}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate italic mt-0.5">
          "{highlightText(result.messageContent, query)}"
        </p>
      </div>
    </div>
  );
};
