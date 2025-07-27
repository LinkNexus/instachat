import {apiFetch} from "@/lib/fetch.ts";
import {useAppStore} from "@/lib/store.ts";
import type {Message} from "@/types.ts";
import * as React from "react";
import {useEffect, useState} from "react";
import {ChatHeader} from "./components/ChatHeader.tsx";
import {ConversationNotFound, DiscussionSkeleton} from "./components/ChatSkeleton.tsx";
import {MessageInput} from "./components/MessageInput.tsx";
import {MessageList} from "./components/MessageList.tsx";
import {useChatActions} from "./hooks/useChatActions.ts";
import {useChatData} from "./hooks/useChatData.ts";
import {useSendMessage} from "./hooks/useSendMessage.ts";

export function Discussion({ params }: { params: { id: string } }) {
  const { user } = useAppStore(state => state);
  const { switchMessagesLoaded } = useAppStore.getState().conversationsActions;
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  // Custom hooks
  const {
    conversation,
    messages,
    fetchConversation,
    fetchMessages,
    isLoadingConversation,
    isLoadingMessages,
  } = useChatData({
    partnerId: Number(params.id),
  });

  const {
    handleEditMessage,
    handleDeleteMessage,
    handleCopyMessage,
  } = useChatActions();

  const { sendMessage, isSending } = useSendMessage({
    partnerId: Number(params.id),
    repliedMessage: replyToMessage
  });

  // Utility functions
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  const handleReplyToMessage = (message: Message) => {
    setReplyToMessage(message);
    // Focus on input field
    const textarea = document.querySelector('textarea[placeholder*="message"]') as HTMLTextAreaElement;
    textarea?.focus();
  };

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (conversation && target.scrollTop <= 10 && messages.length < conversation?.count) {
      await fetchMessages();
    }
  };

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  const handleScrollToMessage = (messageId: number) => {
    // Find the message element and scroll to it
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement && scrollAreaRef.current) {
      messageElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      // Add a highlight effect
      messageElement.classList.add('bg-yellow-100', 'dark:bg-yellow-900/20');
      setTimeout(() => {
        messageElement.classList.remove('bg-yellow-100', 'dark:bg-yellow-900/20');
      }, 2000);
    }
  };

  const handleMessageCreated = async (event: Event) => {
    const message = (event as CustomEvent).detail.message as Message;
    if (Number(params.id) === message.sender.id) {
      await apiFetch(`/api/messages/read?partnerId=${message.sender.id}`)
    }
  }

  // Effects
  useEffect(() => {
    if (!conversation) {
      fetchConversation().then(scrollToBottom);
    } else if (!conversation.loaded) {
      fetchMessages()
        .then(async () => {
          if (conversation.unreadCount !== 0)
            await apiFetch(`/api/messages/read?partnerId=${conversation.user.id}`)
          switchMessagesLoaded(conversation.user.id);
          scrollToBottom();
        });
    } else {
      scrollToBottom();
    }

    document.addEventListener("new.message", handleMessageCreated);

    return () => {
      document.removeEventListener("new.message", handleMessageCreated);
    }
  }, [params.id]);

  // Render loading state
  if (isLoadingConversation) {
    return <DiscussionSkeleton />;
  }

  // Render not found state
  if (!conversation) {
    return <ConversationNotFound />;
  }

  // Render main chat interface
  return (
    <>
      <ChatHeader conversation={conversation} />

      <MessageList
        messages={messages}
        user={user!}
        isLoadingMessages={isLoadingMessages}
        onScroll={handleScroll}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
        onReplyToMessage={handleReplyToMessage}
        onCopyMessage={handleCopyMessage}
        onScrollToMessage={handleScrollToMessage}
        scrollAreaRef={scrollAreaRef}
      />

      <MessageInput
        onSendMessage={handleSendMessage}
        isSending={isSending}
        replyToMessage={replyToMessage}
        onClearReply={() => setReplyToMessage(null)}
      />
    </>
  );
}
