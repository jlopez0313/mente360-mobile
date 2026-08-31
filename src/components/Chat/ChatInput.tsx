import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Send, Smile, X } from "lucide-react";
import { useLayoutEffect, useRef } from "react";

// Alto de una línea (igual que el <Input> anterior) y tope antes de hacer
// scroll interno (~5 líneas).
const MIN_TEXTAREA_HEIGHT = 40;
const MAX_TEXTAREA_HEIGHT = 120;

interface ChatInputProps {
    replyTo: any;
    setReplyTo: (reply: any) => void;
    user: any;
    otherUserName: string | undefined;
    newMessage: string;
    onCheckInput: (e: any) => void;
    handleKeyPress: (e: React.KeyboardEvent) => void;
    sendMessage: () => void;
    setShowEmojiModal: (show: boolean) => void;
    disabled?: boolean;
}

export const ChatInput = ({
    replyTo,
    setReplyTo,
    user,
    otherUserName,
    newMessage,
    onCheckInput,
    handleKeyPress,
    sendMessage,
    setShowEmojiModal,
    disabled = false,
}: ChatInputProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-crecer con el contenido: desde una línea (MIN) hasta MAX; a partir
    // de ahí, scroll interno (estilo WhatsApp). useLayoutEffect para que no se
    // vea el salto de alto en el primer render.
    useLayoutEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        const next = Math.min(
            Math.max(ta.scrollHeight, MIN_TEXTAREA_HEIGHT),
            MAX_TEXTAREA_HEIGHT
        );
        ta.style.height = `${next}px`;
        ta.style.overflowY = ta.scrollHeight > MAX_TEXTAREA_HEIGHT ? "auto" : "hidden";
    }, [newMessage]);

    return (
        <div className="sticky bottom-0 z-10 bg-card border-t border-border w-full px-4 pt-3 pb-[max(0.75rem,var(--ion-safe-area-bottom,env(safe-area-inset-bottom,0px)))]">
            {disabled ? (
                <div className="flex justify-center items-center gap-2">
                    <i> No puedes enviar mensajes </i>
                </div>
            ) : (
                <>
                    {replyTo?.id && (
                        <div
                            className={cn(
                                "border-l border-l-4 border-primary",
                                "text-xs relative mb-2",
                                "px-1.5 py-1.5 rounded-sm italic",
                                "bg-primary-foreground text-primary"
                            )}
                        >
                            <div className="flex flex-col">
                                <span className="font-bold text-muted-foreground">
                                    {replyTo?.reply?.from == user?.id ? "Tú" : otherUserName}
                                </span>
                                <span className="text-muted-foreground">
                                    {replyTo?.mensaje}
                                </span>
                            </div>
                            <X
                                className="w-4 h-4 absolute top-1 right-1 cursor-pointer"
                                onClick={() => setReplyTo(null)}
                            />
                        </div>
                    )}

                    <div className="flex items-end gap-2">
                        <div className="flex-1 relative">
                            <textarea
                                ref={textareaRef}
                                rows={1}
                                placeholder="Escribe un mensaje..."
                                value={newMessage}
                                onChange={onCheckInput}
                                onKeyPress={handleKeyPress}
                                className={cn(
                                    "block w-full resize-none bg-background !border border-input !rounded-md",
                                    "px-3 py-2.5 pr-10 text-base !text-foreground leading-5",
                                    "min-h-[40px] max-h-[120px] ring-offset-background placeholder:text-muted-foreground",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                    "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                )}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 bottom-1 h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowEmojiModal(true)}
                            >
                                <Smile className="w-4 h-4" />
                            </Button>
                        </div>
                        <Button
                            size="icon"
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                            className="flex-shrink-0"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};
