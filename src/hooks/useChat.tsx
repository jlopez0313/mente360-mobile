import { childAdded, childChanged, getQuery, queryTo, readData, snapshotToArray } from "@/services/realtime-db";
import { onValue } from "firebase/database";
import { useEffect, useRef, useState } from "react";

interface UseChatProps {
    basePath: string; // "rooms/ROOMID" or "grupos/GRUPOID"
    withUsers?: boolean; // If true, listen to global "users" ref
    initialMessageId?: string | null;
}

const PAGINATION_LIMIT = 20;

export const useChat = ({ basePath, withUsers = false, initialMessageId = null }: UseChatProps) => {
    const chatListRef = useRef<HTMLDivElement | null>(null);
    const topSentinelRef = useRef<HTMLDivElement | null>(null);

    const loadingMore = useRef(false);
    const hasMore = useRef(true);
    const firstLoad = useRef(true);

    const [messages, setMessages] = useState<any[]>([]);
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
    const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);
    const [popoverEvent, setPopoverEvent] = useState<{ top: number; left: number; } | null>(null);

    const scrollToBottom = () => {
        const container = chatListRef.current;
        if (!container) return;
        container.scrollTop = container.scrollHeight;
    };

    const onScrollToMessage = async (msg: any) => {
        const replyId = msg.reply.id;

        if (!messages.find((m: any) => m.id === replyId)) {
            const baseQuery = await queryTo(`${basePath}/messages`, {
                orderBy: "key",
                startAt: replyId,
                endAt: messages[0]?.id,
                direction: "last",
            });

            const snapshot = await getQuery(baseQuery);
            const oldMessages = snapshotToArray(snapshot.val());
            oldMessages.pop();

            setMessages((prev) => [...oldMessages, ...prev]);
        }
        setPendingScrollId(replyId);
    };

    const loadOlderMessages = async () => {
        if (loadingMore.current || !messages.length || !hasMore.current) return;

        loadingMore.current = true;
        const container = chatListRef.current;
        if (!container) return;

        const previousHeight = container.scrollHeight;
        const oldestMessage = messages[0];

        const baseQuery = await queryTo(`${basePath}/messages`, {
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

    // 1. Initial Load & Listeners
    useEffect(() => {
        if (!basePath) return;

        let unsubUsuarios: any = null;
        if (withUsers) {
            unsubUsuarios = onValue(readData("users"), (snapshot) => {
                setUsuarios(snapshotToArray(snapshot.val()));
            });
        }

        const loadInitial = async () => {
            if (initialMessageId) {
                // If we have an initial message, load messages around it or from it
                // To keep it simple, we'll load from the start of that message's room/node 
                // up to the latest or at least a good chunk.
                // For now, let's load the latest 100 messages if initialMessageId is present
                // and then scroll to it.
                const baseQuery = await queryTo(`${basePath}/messages`, {
                    orderBy: "date",
                    limit: 100, // Load a larger chunk to ensure the message is there
                    direction: "last",
                });
                const snapshot = await getQuery(baseQuery);
                const initialMessages = snapshotToArray(snapshot.val());
                setMessages(initialMessages);
                
                // Trigger scroll to the specific message
                setPendingScrollId(initialMessageId);
            } else {
                const baseQuery = await queryTo(`${basePath}/messages`, {
                    orderBy: "date",
                    limit: PAGINATION_LIMIT,
                    direction: "last",
                });
                const snapshot = await getQuery(baseQuery);
                const initialMessages = snapshotToArray(snapshot.val());
                setMessages(initialMessages);
                requestAnimationFrame(scrollToBottom);
            }
            firstLoad.current = false;
        };

        loadInitial();

        const unsubChanged = childChanged(`${basePath}/messages`, (snap: any) => {
            const updated = snap.val();
            setMessages((prev) => prev.map((m) => (m.id === snap.key ? { id: snap.key, ...updated } : m)));
        });

        const unsubAdded = childAdded(`${basePath}/messages`, (snapshot: any) => {
            const newMsg = { id: snapshot.key, ...snapshot.val() };

            setMessages((prev) => {
                if (prev.some((m) => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
            });

            const container = chatListRef.current;
            if (!container) return;

            const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
            if (isAtBottom) {
                requestAnimationFrame(scrollToBottom);
            }
        });

        return () => {
            unsubChanged();
            unsubAdded();
            if (unsubUsuarios) unsubUsuarios();
        };
    }, [basePath, withUsers]);

    // 2. Intersection Observer for Infinite Scroll
    useEffect(() => {
        const container = chatListRef.current;
        const sentinel = topSentinelRef.current;
        if (!container || !sentinel) return;

        const observer = new IntersectionObserver(
            async (entries) => {
                if (entries[0].isIntersecting) {
                    await loadOlderMessages();
                }
            },
            { root: container, threshold: 0.1 }
        );
        observer.observe(sentinel);

        return () => observer.disconnect();
    }, [messages]);

    // 3. Scroll to reply pending logic
    useEffect(() => {
        if (!pendingScrollId) return;
        const el = document.getElementById(`msg-${pendingScrollId}`);
        if (!el) return;

        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("bg-yellow-200/60");
        setTimeout(() => el.classList.remove("bg-yellow-200/60"), 800);
        setPendingScrollId(null);
    }, [messages, pendingScrollId]);

    return {
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
    };
};
