import { getData, snapshotToArray } from "@/services/realtime-db";
import { useEffect, useState } from "react";

interface useChatSearchProps {
  userId: string;
  query: string;
  type: "chats" | "groups";
}

export const useChatSearch = ({ userId, query, type }: useChatSearchProps) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      try {
        const resultsArray: any[] = [];
        const basePath = type === "chats" ? `users/${userId}/rooms` : `users/${userId}/grupos`;
        
        const snapshot = await getData(basePath);
        const rooms = snapshotToArray(snapshot.val());

        const searchPromises = rooms.map(async (room: any) => {
          const id = room.id;
          let name = "";
          let photo = "";
          let dataNode = "";

          if (type === "chats") {
            const otherUserId = id.split("_").find((uid: any) => uid != userId);
            const userSnap = await getData(`users/${otherUserId}`);
            const userData = userSnap.val();
            name = userData?.name || "Usuario";
            photo = userData?.photo || "";
            dataNode = `rooms/${id}`;
          } else {
            const groupSnap = await getData(`grupos/${id}`);
            const groupData = groupSnap.val();
            name = groupData?.grupo || "Grupo";
            photo = groupData?.photo || "";
            dataNode = `grupos/${id}`;
          }

          // Search in Name
          if (name.toLowerCase().includes(query.toLowerCase())) {
            resultsArray.push({
              type,
              id,
              name,
              photo,
              matchType: "name",
            });
          }

          // Search in Messages
          const messagesSnap = await getData(`${dataNode}/messages`);
          const messages = snapshotToArray(messagesSnap.val());
          
          messages.forEach((msg: any) => {
            if (msg.mensaje && msg.mensaje.toLowerCase().includes(query.toLowerCase())) {
              resultsArray.push({
                type,
                id,
                name,
                photo,
                matchType: "message",
                messageId: msg.id,
                messageContent: msg.mensaje,
                messageDate: msg.date,
                messageTime: msg.hora
              });
            }
          });
        });

        await Promise.all(searchPromises);
        
        // Sort results: Names first, then most recent messages
        resultsArray.sort((a, b) => {
          if (a.matchType === "name" && b.matchType === "message") return -1;
          if (a.matchType === "message" && b.matchType === "name") return 1;
          if (a.matchType === "message" && b.matchType === "message") {
            return new Date(b.messageDate).getTime() - new Date(a.messageDate).getTime();
          }
          return 0;
        });

        setResults(resultsArray);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 500);
    return () => clearTimeout(timeoutId);
  }, [query, type, userId]);

  return { results, loading };
};
