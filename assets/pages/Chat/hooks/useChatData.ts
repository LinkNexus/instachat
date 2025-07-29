import {apiFetch, useApiFetch} from "@/lib/fetch.ts";
import {useAppStore} from "@/lib/store.ts";
import type {Conversation, Message} from "@/types.ts";
import {useMemo} from "react";

export function useChatData({partnerId}: { partnerId?: number }) {
  const {conversations} = useAppStore(state => state);
  const {
    addConversation,
    prependMessages,
    switchMessagesLoaded,
    readMessages
  } = useAppStore.getState().conversationsActions;

  const conversation = useMemo(() => {
    return conversations.find(c => c.partner.id === Number(partnerId));
  }, [conversations, partnerId]);

  const messages = useMemo(() => conversation?.messages || [], [conversation?.messages]);

  const {
    callback: fetchConversation,
    loading: isLoadingConversation,
  } = useApiFetch(`/api/conversations/friends/${partnerId}`, {
    async onSuccess(c: Conversation) {
      addConversation({
        ...c,
        loaded: true
      });
      switchMessagesLoaded(c.partner.id);
      if (c!.unreadCount !== 0)
        await apiFetch(`/api/messages/read?partnerId=${c.partner.id}`)
          .then(() => readMessages(c.partner.id));
    }
  }, [partnerId]);

  const {
    callback: fetchMessages,
    loading: isLoadingMessages
  } = useApiFetch(`/api/messages?partnerId=${partnerId}&offset=${messages.length}`, {
    onSuccess(res: Message[]) {
      if (partnerId) {
        prependMessages(Number(partnerId), res);
      }
    }
  }, [partnerId, messages.length]);

  const {
    callback: readMessagesRequest
  } = useApiFetch(`/api/messages/read?partnerId=${partnerId}`, {
    onSuccess() {
      if (conversation) {
        readMessages(conversation.partner.id);
      }
    }
  }, [partnerId]);

  return {
    conversation,
    messages,
    fetchConversation,
    fetchMessages,
    isLoadingConversation,
    isLoadingMessages,
    readMessagesRequest
  };
}
