import {useEffect, useState} from "react";
import {useAppStore} from "@/lib/store.ts";
import type {Message} from "@/types.ts";
import {notify} from "@/lib/notifications.ts";
import {useLocation} from "wouter";

export function useMessages() {
  const user = useAppStore(state => state.user);
  const { getMessagesChannelUrl, conversationsActions } = useAppStore.getState();
  const { addMessage, getConversation , addConversation } = conversationsActions;
  const [location, navigate] = useLocation();
  const [isOnPage, setIsOnPage] = useState(true);
  const changeIsOnPage = () => {
    setIsOnPage(document.visibilityState === "visible");
  }

  useEffect(() => {
    if (user) {
      const eventSource = new EventSource(getMessagesChannelUrl(), {
        withCredentials: true
      });

      document.addEventListener("visibilitychange", changeIsOnPage);

      eventSource.addEventListener("message", (event) => {
        const message = JSON.parse(event.data) as Message;

        if (message.sender.id === user.id) {
          return; // Ignore messages sent by the current user
        }

        const conversation = getConversation(message.sender.id);
        if (conversation) {
          addMessage(conversation.user.id, message);
        } else {
          addConversation({
            user: message.sender,
            messages: [message],
            messagesLoaded: false,
          })
        }

        if (location !== `/chat/friends/${message.sender.username}` || !isOnPage) {
          notify({
            title: `New Message from ${message.sender.name}`,
            body: message.content,
            events: {
              onClick() {
                navigate(`/chat/friends/${message.sender.username}`, {
                  replace: false
                });
                window.focus();
              }
            }
          });
        }
      });

      return () => {
        eventSource.close();
        document.removeEventListener("visibilitychange", changeIsOnPage);
      }
    }
  }, [user, location, isOnPage]);
}
