import { MessageComponent } from "@/components/chat/Message.tsx";
import type { Message, User } from "@/types.ts";
import * as React from "react";
import { MessageSkeleton } from "./ChatSkeleton.tsx";

interface MessageListProps {
    messages: Message[];
    user: User;
    isLoadingMessages: boolean;
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
    onEditMessage: (messageId: number, newContent: string) => void;
    onDeleteMessage: (messageId: number) => void;
    onReplyToMessage: (message: Message) => void;
    onCopyMessage: (content: string) => void;
    scrollAreaRef: React.RefObject<HTMLDivElement | null>;
}

export function MessageList({
    messages,
    user,
    isLoadingMessages,
    onScroll,
    onEditMessage,
    onDeleteMessage,
    onReplyToMessage,
    onCopyMessage,
    scrollAreaRef,
}: MessageListProps) {
    const isMyMessage = (message: Message) => message.sender.id === user.id;

    return (
        <div
            ref={scrollAreaRef}
            className="p-4 overflow-y-auto flex-1"
            onScroll={onScroll}
        >
            <div className="space-y-4">
                {isLoadingMessages && (
                    Array.from({ length: 8 }).map((_, index) => (
                        <MessageSkeleton isMyMessage={index % 3 === 0} key={index} />
                    ))
                )}
                {messages.map((message) => (
                    <MessageComponent
                        message={message}
                        isMyMessage={isMyMessage(message)}
                        key={message.id}
                        onEdit={onEditMessage}
                        onDelete={onDeleteMessage}
                        onReply={onReplyToMessage}
                        onCopy={onCopyMessage}
                        showReadStatus={true}
                    />
                ))}
            </div>
        </div>
    );
}
