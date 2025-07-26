import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import type { Message } from "@/types.ts";
import { Loader, Paperclip, Send, Smile } from "lucide-react";
import { useState } from "react";

interface MessageInputProps {
    onSendMessage: (content: string) => Promise<void>;
    isSending: boolean;
    replyToMessage: Message | null;
    onClearReply: () => void;
}

export function MessageInput({
    onSendMessage,
    isSending,
    replyToMessage,
    onClearReply,
}: MessageInputProps) {
    const [currentMessage, setCurrentMessage] = useState("");

    const handleSend = async () => {
        if (currentMessage.trim() === "") return;
        await onSendMessage(currentMessage.trim());
        setCurrentMessage("");
        onClearReply();
    };

    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            await handleSend();
        }
        if (e.key === "Escape") {
            onClearReply();
        }
    };

    return (
        <div className="p-4 border-t">
            {/* Reply Preview */}
            {replyToMessage && (
                <div className="mb-3 p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Replying to {replyToMessage.sender.name}</p>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearReply}
                            className="h-6 w-6 p-0"
                        >
                            ×
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                        {replyToMessage.content.length > 50
                            ? replyToMessage.content.substring(0, 50) + "..."
                            : replyToMessage.content
                        }
                    </p>
                </div>
            )}

            <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="shrink-0">
                    <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                    <Textarea
                        placeholder={replyToMessage ? "Reply to message..." : "Type a message..."}
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="max-h-32 pr-10 field-sizing-content"
                    />
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                        <Smile className="h-4 w-4" />
                    </Button>
                </div>
                <Button
                    disabled={currentMessage.trim() === "" || isSending}
                    size="icon"
                    onClick={handleSend}
                >
                    {isSending ? (
                        <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </div>
    );
}
