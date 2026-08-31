import { childAdded, childChanged, getQuery, queryTo, readData, snapshotToArray } from "@/services/realtime-db";
import { onValue } from "firebase/database";
import { useEffect, useRef, useState } from "react";

interface UseChatProps {
    basePath: string; // "rooms/ROOMID" or "grupos/GRUPOID"
    withUsers?: boolean; // If true, listen to global "users" ref
    initialMessageId?: string | null;
    userId?: string | number | null; // id del usuario actual (para el auto-scroll)
}

const PAGINATION_LIMIT = 20;
// A cuántos px del fondo seguimos considerando que el usuario "está al final".
const NEAR_BOTTOM_PX = 140;

export const useChat = ({ basePath, withUsers = false, initialMessageId = null, userId = null }: UseChatProps) => {
    const userIdRef = useRef(userId);
    userIdRef.current = userId;

    const chatListRef = useRef<HTMLDivElement | null>(null);
    const topSentinelRef = useRef<HTMLDivElement | null>(null);

    const loadingMore = useRef(false);
    const hasMore = useRef(true);
    const firstLoad = useRef(true);
    // Hasta este instante, los child_added son del lote inicial (Firebase los
    // reemite al enganchar el listener): no dispares auto-scroll con ellos.
    const readyAt = useRef(0);
    // Mientras esté true, la vista se mantiene pegada al último mensaje (entra
    // a la sala, envía/recibe, crece la caja de texto o se abre el teclado).
    // Pasa a false si el usuario sube a leer historial.
    const stickToBottom = useRef(true);

    const [messages, setMessages] = useState<any[]>([]);
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
    const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);
    const [popoverEvent, setPopoverEvent] = useState<{ top: number; left: number; } | null>(null);

    const isNearBottom = () => {
        const c = chatListRef.current;
        if (!c) return true;
        return c.scrollHeight - c.scrollTop - c.clientHeight < NEAR_BOTTOM_PX;
    };

    const scrollToBottom = () => {
        const container = chatListRef.current;
        if (!container) return;
        container.scrollTop = container.scrollHeight;
    };

    // El alto del contenido cambia DESPUÉS de pintar (avatares, previews de
    // respuesta, imágenes, reacciones), así que reintentamos unas cuantas veces
    // para terminar de verdad en el fondo.
    const pinToBottom = () => {
        scrollToBottom();
        requestAnimationFrame(scrollToBottom);
        setTimeout(scrollToBottom, 60);
        setTimeout(scrollToBottom, 200);
        setTimeout(scrollToBottom, 450);
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

        firstLoad.current = true;
        hasMore.current = true;
        readyAt.current = Date.now() + 1200;
        stickToBottom.current = !initialMessageId;

        let unsubUsuarios: any = null;
        if (withUsers) {
            unsubUsuarios = onValue(readData("users"), (snapshot) => {
                setUsuarios(snapshotToArray(snapshot.val()));
            });
        }

        const loadInitial = async () => {
            if (initialMessageId) {
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
                // Al entrar a la sala: al último mensaje.
                pinToBottom();
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

            // Durante/justo después de la carga inicial lo maneja loadInitial().
            if (firstLoad.current || Date.now() < readyAt.current) return;

            // Mensaje propio -> siempre al final. Recibido -> solo si el usuario
            // ya estaba al final (si subió a leer historial, no lo arrastramos).
            const isMine =
                userIdRef.current != null &&
                String(newMsg.user) === String(userIdRef.current);

            if (isMine || isNearBottom()) {
                stickToBottom.current = true;
                pinToBottom();
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

    // 4. Mantener el "pegado al fondo" según dónde esté el usuario, y volver a
    //    pegarlo cuando el contenedor cambie de alto (caja de texto que crece,
    //    teclado que se abre/cierra).
    useEffect(() => {
        const container = chatListRef.current;
        if (!container) return;

        const onScroll = () => {
            if (loadingMore.current) return;
            stickToBottom.current = isNearBottom();
        };
        container.addEventListener("scroll", onScroll, { passive: true });

        let ro: ResizeObserver | null = null;
        if (typeof ResizeObserver !== "undefined") {
            ro = new ResizeObserver(() => {
                if (loadingMore.current) return;
                if (stickToBottom.current) scrollToBottom();
            });
            ro.observe(container);
        }

        return () => {
            container.removeEventListener("scroll", onScroll);
            ro?.disconnect();
        };
    }, []);

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
