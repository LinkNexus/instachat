import {useApiFetch} from "@/lib/fetch.ts";
import type {FormErrors} from "@/lib/forms.ts";
import {useAppStore} from "@/lib/store.ts";
import type {Message} from "@/types.ts";
import {toast} from "sonner";

export function useSendMessage({partnerId, repliedMessage}: { partnerId?: number, repliedMessage: Message|null }) {
  const {addMessage} = useAppStore.getState().conversationsActions;

  const {
    loading: isSending,
    callback: sendMessageCallback
  } = useApiFetch<Message, FormErrors>(`/api/messages`, {
      method: "POST",
      onSuccess(message) {
        if (partnerId) {
          addMessage(partnerId, message);
        }
      },
      onError() {
        toast.error("Failed to send message. Please try again.");
      }
    }
  );

  const sendMessage = async (content: string,) => {
    return sendMessageCallback({
      data: { content },
      searchParams: {
        partnerId: partnerId || 0,
        repliedMessageId: repliedMessage?.id || 0,
      }
    });
  };

  return {
    sendMessage,
    isSending,
  };
}
