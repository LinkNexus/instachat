import {MessageComponent} from "@/components/chat/Message.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {useApiFetch} from "@/lib/fetch.ts";
import type {FormErrors} from "@/lib/forms.ts";
import {useAppStore} from "@/lib/store.ts";
import type {Conversation, Message} from "@/types.ts";
import {ArrowLeft, Loader, MoreVertical, Paperclip, Phone, Search, Send, Smile, Video} from "lucide-react";
import * as React from "react";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {navigate} from "wouter/use-browser-location";

export function Discussion({params}: { params: { id: string } }) {
  const {user, conversations} = useAppStore(state => state);
  const {
    addMessage,
    addConversation,
    prependMessages,
    switchNoMoreMessages,
    switchMessagesLoaded
  } = useAppStore.getState().conversationsActions;

  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const conversation = conversations.find(c => c.user.id === Number(params.id));
  const messages = conversation?.messages || [];

  const {
    callback: fetchConversation,
    loading: isLoadingConversation,
  } = useApiFetch(`/api/conversations/${params.id}`, {
    onSuccess(c: Conversation) {
      addConversation(c);
      scrollToBottom();
      switchMessagesLoaded(Number(params.id))
    }
  }, [params.id]);

  const {
    callback: fetchMessages,
    loading: isLoadingMessages
  } = useApiFetch(`/api/conversations/messages/${params.id}?offset=${messages.length}`, {
    onSuccess(res: Message[]) {
      if (res.length > 10) {
        switchNoMoreMessages(Number(params.id));
      }
      prependMessages(Number(params.id), res);
    }
  }, [params.id, messages.length]);

  const [currentMessage, setCurrentMessage] = useState("");

  const isMyMessage = (message: Message) => message.sender.id === user!.id;
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;

    console.log(target.scrollHeight, target.scrollTop, target.clientHeight);

    // Check if scrolled to top (for loading more messages)
    if (target.scrollTop <= 10) {
      // await fetchMessages();
    }
  };

  useEffect(() => {
    if (!conversation) {
      fetchConversation();
    } else if (!conversation.messagesLoaded) {
      fetchMessages()
        .then(() => {
          switchMessagesLoaded(Number(params.id));
          scrollToBottom();
        })
    }
  }, [params.id]);

  const {
    loading: isSending,
    callback: sendMessage
  } = useApiFetch<Message, FormErrors>(
    `/api/conversations/send-message/${params.id}`,
    {
      method: "POST",
      data: {
        content: currentMessage,
      },
      onSuccess: (message) => {
        addMessage(Number(params.id), message);
        setCurrentMessage("");
      },
      onError() {
        toast.error("Failed to send message. Please try again.");
      }
    },
    [currentMessage, params.id]
  );

  // MessageComponent Skeleton Component
  const MessageSkeleton = ({isMyMessage}: { isMyMessage: boolean }) => (
    <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg space-y-2 ${isMyMessage ? "bg-primary/20" : "bg-muted"
      }`}>
        <Skeleton className="h-4 w-32"/>
        <Skeleton className="h-3 w-16"/>
      </div>
    </div>
  );

  if (isLoadingConversation) {
    return (
      <>
        <div className="p-4 border-b bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="md:hidden">
                <ArrowLeft className="h-4 w-4"/>
              </Button>
              <div className="relative">
                <Skeleton className="h-10 w-10 rounded-full"/>
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-24"/>
                <Skeleton className="h-3 w-20"/>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-md"/>
              <Skeleton className="h-8 w-8 rounded-md"/>
              <Skeleton className="h-8 w-8 rounded-md"/>
              <Skeleton className="h-8 w-8 rounded-md"/>
            </div>
          </div>
        </div>
        <ScrollArea className="p-4 overflow-y-auto flex-1">
          <div className="space-y-4">
            {Array.from({length: 8}, (_, index) => (
              <MessageSkeleton key={index} isMyMessage={index % 3 === 0}/>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-md"/>
            <Skeleton className="h-10 flex-1 rounded-md"/>
            <Skeleton className="h-8 w-8 rounded-md"/>
          </div>
        </div>
      </>
    );
  } else if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-muted-foreground">?</AvatarFallback>
          </Avatar>
        </div>
        <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
        <p className="text-muted-foreground mb-4 max-w-md">
          This conversation does not exist or the user could not be found.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/chat", {replace: false})}>
            <ArrowLeft className="h-4 w-4 mr-2"/>
            Back to Chats
          </Button>
          <Button onClick={() => navigate("/friends", {replace: false})}>
            Find Friends
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <>
        {/* Chat Header */}
        <div className="p-4 border-b bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Mobile back button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => navigate("/chat", {replace: false})}
              >
                <ArrowLeft className="h-4 w-4"/>
              </Button>
              <div className="relative">
                <Avatar>
                  <AvatarImage src=""/>
                  <AvatarFallback>
                    {(conversation?.user?.name?.split(' ').map(n => n[0]).join('')) || ""}
                  </AvatarFallback>
                </Avatar>
                <div
                  className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"/>
              </div>
              <div>
                <h2 className="font-semibold">{conversation?.user?.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {false ? "Online" : "Last seen recently"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Phone className="h-4 w-4"/>
              </Button>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Video className="h-4 w-4"/>
              </Button>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Search className="h-4 w-4"/>
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4"/>
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollAreaRef}
          className="p-4 overflow-y-auto flex-1"
          onScroll={handleScroll}
        >
          <div className="space-y-4">
            {isLoadingMessages && (
              Array.from({length: 8}).map((_, index) => (
                <MessageSkeleton isMyMessage={index % 3 === 0} key={index}/>
              ))
            )}
            {messages.map((message) => (
              <MessageComponent message={message} isMyMessage={isMyMessage(message)} key={message.id}/>
            ))}
          </div>
        </div>

        {/* MessageComponent Input */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="shrink-0">
              <Paperclip className="h-4 w-4"/>
            </Button>
            <div className="flex-1 relative">
              <Textarea
                placeholder="Type a message..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (currentMessage.trim() === "") return;
                    await sendMessage();
                  }
                }}
                className="max-h-32 pr-10 field-sizing-content"
              />
              <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                <Smile className="h-4 w-4"/>
              </Button>
            </div>
            <Button
              disabled={currentMessage.trim() === "" || isSending}
              size="icon"
              onClick={async () => {
                if (currentMessage.trim() === "") return;
                await sendMessage();
              }}
            >
              {isSending ? (
                <Loader className="h-4 w-4 animate-spin"/>
              ) : (
                <Send className="h-4 w-4"/>
              )}
            </Button>
          </div>
        </div>
      </>
    );
  }
}
