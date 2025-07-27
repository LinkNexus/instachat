import {useEffect, useState} from "react";
import {useAppStore} from "@/lib/store.ts";
import type {Message, MessageEvent as MessageEventType} from "@/types.ts";
import {notify} from "@/lib/notifications.ts";
import {useLocation} from "wouter";

export function useMessages() {
  const user = useAppStore(state => state.user);
  const {getMessagesChannelUrl, conversationsActions} = useAppStore.getState();
  const {
    addMessage,
    getConversation,
    addConversation,
    deleteMessage,
    updateMessage
  } = conversationsActions;
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
        const {event: messageEvent, message} = JSON.parse(event.data) as { event: MessageEventType, message: Message };

        if (message.sender.id === user.id) {
          return; // Ignore messages sent by the current user
        }

        const conversation = getConversation(message.sender.id);

        switch (messageEvent) {
          case "message.created":
            if (conversation) {
              addMessage(conversation.partner.id, message);
            } else {
              addConversation({
                partner: message.sender,
                messages: [message],
                loaded: false,
                unreadCount: 1,
                count: 1
              });
            }

            if (location !== `/chat/friends/${message.sender.id}` || !isOnPage) {
              notify({
                title: `New Message from ${message.sender.name}`,
                body: message.content,
                events: {
                  onClick() {
                    navigate(`/chat/friends/${message.sender.id}`, {
                      replace: false
                    });
                  }
                }
              });
            }
            break;

          case "message.deleted":
            deleteMessage(message.id);
            break;

          case "message.updated":
            updateMessage(message);
            break;
        }
      });

      return () => {
        eventSource.close();
        document.removeEventListener("visibilitychange", changeIsOnPage);
      }
    }
  }, [user, location, isOnPage]);
}
