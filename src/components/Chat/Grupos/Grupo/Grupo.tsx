import {
  childAdded,
  childChanged,
  getQuery,
  queryTo,
  readData,
  snapshotToArray,
} from "@/services/realtime-db";
import { onValue } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Interacciones } from "../../Interacciones";
import { Item } from "./Item";

const PAGINATION_LIMIT = 20;

export const Grupo: React.FC<any> = ({ grupoID, setReplyTo }) => {
  const { user } = useSelector((state: any) => state.user);

  const chatListRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);

  const loadingMore = useRef(false);
  const hasMore = useRef(true);
  const firstLoad = useRef(true);

  const [messages, setMessages] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);

  const [popoverEvent, setPopoverEvent] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const onScrollToMessage = async (msg: any) => {
    const replyId = msg.reply.id;

    if (!messages.find((m: any) => m.id === replyId)) {
      const baseQuery = await queryTo("rooms/" + grupoID + "/messages", {
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

  /* =====================================================
     SCROLL HELPERS
  ====================================================== */

  const scrollToBottom = () => {
    const container = chatListRef.current;
    if (!container) return;
    
    container.scrollTop = container.scrollHeight;
  };

  /* =====================================================
     CARGA INICIAL
  ====================================================== */

  useEffect(() => {
    if (!grupoID) return;

    const loadInitial = async () => {
      const baseQuery = await queryTo(`grupos/${grupoID}/messages`, {
        orderBy: "date",
        limit: PAGINATION_LIMIT,
        direction: "last",
      });

      const snapshot = await getQuery(baseQuery);
      const initialMessages = snapshotToArray(snapshot.val());

      setMessages(initialMessages);

      requestAnimationFrame(() => {
        scrollToBottom();
      });

      firstLoad.current = false;
    };

    loadInitial();
  }, [grupoID]);

  /* =====================================================
     REALTIME
  ====================================================== */

  useEffect(() => {
    if (!grupoID) return;

    const unsubUsuarios = onValue(readData("users"), (snapshot) => {
      setUsuarios(snapshotToArray(snapshot.val()));
    });

    const unsubChanged = childChanged(
      `grupos/${grupoID}/messages`,
      (snap: any) => {
        const updated = snap.val();
        setMessages((prev) =>
          prev.map((m) =>
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

        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });

        const container = chatListRef.current;
        if (!container) return;

        const isAtBottom =
          container.scrollHeight -
            container.scrollTop -
            container.clientHeight <
          50;

        if (isAtBottom) {
          requestAnimationFrame(() => {
            scrollToBottom();
          });
        }
      }
    );

    return () => {
      unsubChanged();
      unsubAdded();
      unsubUsuarios();
    };
  }, [grupoID]);

  /* =====================================================
     CARGAR MENSAJES ANTERIORES
  ====================================================== */

  const loadOlderMessages = async () => {
    if (loadingMore.current) return;
    if (!messages.length) return;
    if (!hasMore.current) return;

    loadingMore.current = true;

    const container = chatListRef.current;
    if (!container) return;

    const previousHeight = container.scrollHeight;
    const oldestMessage = messages[0];

    const baseQuery = await queryTo(`grupos/${grupoID}/messages`, {
      orderBy: "date",
      endAt: oldestMessage.date,
      limit: PAGINATION_LIMIT + 1,
      direction: "last",
    });

    const snapshot = await getQuery(baseQuery);
    let olderMessages = snapshotToArray(snapshot.val());

    olderMessages = olderMessages.filter((m: any) => m.id !== oldestMessage.id);

    if (!olderMessages.length) {
      hasMore.current = false;
      loadingMore.current = false;
      return;
    }

    setMessages((prev) => [...olderMessages, ...prev]);

    requestAnimationFrame(() => {
      const newHeight = container.scrollHeight;
      container.scrollTop = newHeight - previousHeight;
    });

    loadingMore.current = false;
  };

  /* =====================================================
     INTERSECTION OBSERVER
  ====================================================== */
  useEffect(() => {
    const container = chatListRef.current;
    const sentinel = topSentinelRef.current;

    if (!container || !sentinel) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          await loadOlderMessages();
        }
      },
      {
        root: container,
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [messages]);

  /* =====================================================
     SCROLL A MENSAJE (reply)
  ====================================================== */

  useEffect(() => {
    if (!pendingScrollId) return;

    const el = document.getElementById(`msg-${pendingScrollId}`);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    el.classList.add("bg-yellow-200/60");

    setTimeout(() => {
      el.classList.remove("bg-yellow-200/60");
    }, 800);

    setPendingScrollId(null);
  }, [messages, pendingScrollId]);

  /* =====================================================
     RENDER
  ====================================================== */

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
