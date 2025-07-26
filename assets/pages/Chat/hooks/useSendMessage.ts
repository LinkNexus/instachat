import {useApiFetch} from "@/lib/fetch.ts";
import type {FormErrors} from "@/lib/forms.ts";
import {useAppStore} from "@/lib/store.ts";
import type {Message} from "@/types.ts";
import {toast} from "sonner";

export function useSendMessage({partnerId}: { partnerId?: number }) {
  const {addMessage} = useAppStore.getState().conversationsActions;
  const url = new URL("/api/messages", location.origin);

  if (partnerId) {
    url.searchParams.append("partnerId", String(partnerId));
  }

  const {
    loading: isSending,
    callback: sendMessageCallback
  } = useApiFetch<Message, FormErrors>(url, {
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

  const sendMessage = async (content: string) => {
    return sendMessageCallback({content});
  };

  return {
    sendMessage,
    isSending,
  };
}
