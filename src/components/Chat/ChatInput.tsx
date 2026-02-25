import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Send, Smile, X } from "lucide-react";

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
    return (
        <div className="sticky bottom-0 z-10 bg-card border-t border-border px-4 py-3 safe-bottom w-full">
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

                    <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                            <Input
                                placeholder="Escribe un mensaje..."
                                value={newMessage}
                                onChange={onCheckInput}
                                onKeyPress={handleKeyPress}
                                className="pr-10 bg-background border-border"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
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
