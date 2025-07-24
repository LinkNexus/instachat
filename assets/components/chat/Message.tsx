import type {Message} from "@/types.ts";
import {formatMessageTime} from "@/lib/time.ts";

export function MessageComponent({ message, isMyMessage }: { message: Message, isMyMessage: boolean }) {
  return (
    <div
      key={message.id}
      className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${isMyMessage
          ? "bg-primary text-primary-foreground"
          : "bg-muted"
        }`}
      >
        <p className="break-words">{message.content}</p>
        <p className="text-xs opacity-70 mt-1">
          {formatMessageTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
