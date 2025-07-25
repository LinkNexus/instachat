import {env} from "@/lib/env.ts";
import {apiFetch} from "@/lib/fetch.ts";
import type {Contacts, Conversation, Message, User} from '@/types';
import {create} from 'zustand';
import {combine, persist} from 'zustand/middleware';

type Theme = "dark" | "light" | "system"

export const useAppStore = create(
  persist(
    combine(
      {
        user: window.user,
        theme: "system" as Theme,
        conversations: [] as Conversation[],
        contacts: {
          friends: [],
          groups: [],
          loaded: false
        } as Contacts
      },
      (set, get) => ({
        setUser: (user: User | undefined) => set({ user }),
        setTheme: (theme: Theme) => set({ theme }),
        logout: () => {
          apiFetch("/api/auth/logout")
            .then(() => set({ user: undefined }))
        },
        getMessagesChannelUrl() {
          if (window.mercure?.messagesChannel) {
            return window.mercure.messagesChannel;
          }
          const url = new URL(env.VITE_SITE_NAME + "/.well-known/mercure");
          url.searchParams.append("topic", `https://example.com/messages/${get().user?.id}`);
          return url;
        },
        conversationsActions: {
          addContacts(contacts: Contacts) {
            set((state) => {
              if (state.contacts.loaded) return state; // Contacts already loaded
              return { contacts: { ...state.contacts, ...contacts, loaded: true } };
            });
          } ,
          addConversation: (conversation: Conversation) => set((state) => {
            if (state.conversations.some(c => c.partner.id === conversation.partner.id)) {
              return state; // Conversation already exists
            }
            return { conversations: [...state.conversations, conversation] };
          }),
          getConversation: (partnerId: number) => {
            return get().conversations.find(c => c.partner.id === partnerId);
          },
          readMessages(partnerId: number) {
            set((state) => {
              const conversationIndex = state.conversations.findIndex(c => c.partner.id === partnerId);
              if (conversationIndex !== -1) {
                const time = new Date().toISOString();
                const updatedConversations = [...state.conversations];
                updatedConversations[conversationIndex].messages.forEach(m => {
                  if (!m.readAt) m.readAt = time;
                });
                updatedConversations[conversationIndex].unreadCount = 0;
                return { conversations: updatedConversations };
              }
              return state;
            });
          },
          addMessage: (partnerId: number, message: Message) => {
            set((state) => {
              const conversationIndex = state.conversations.findIndex(c => c.partner.id === partnerId);
              if (conversationIndex !== -1 && !state.conversations[conversationIndex].messages.some(m => m.id === message.id)) {
                const updatedConversations = [...state.conversations];
                updatedConversations[conversationIndex].messages.push(message);
                updatedConversations[conversationIndex].count += 1;

                if (message.sender.id !== state.user?.id) {
                  updatedConversations[conversationIndex].unreadCount += 1;
                  document.dispatchEvent(new CustomEvent("new.message", {
                    detail: { message },
                    bubbles: true,
                  }))
                }
                return { conversations: updatedConversations };
              }
              return state;
            });
          },
          prependMessages(partnerId: number, messages: Message[]) {
            set((state) => {
              const conversationIndex = state.conversations.findIndex(c => c.partner.id === partnerId);
              if (conversationIndex !== -1) {
                const updatedConversations = [...state.conversations];
                [...messages].reverse().forEach(m => {
                  if (!updatedConversations[conversationIndex].messages.some(existingMessage => existingMessage.id === m.id)) {
                    updatedConversations[conversationIndex].messages.unshift(m);
                  }
                })
                return { conversations: updatedConversations };
              }
              return state;
            });
          },
          switchMessagesLoaded(partnerId: number) {
            set((state) => {
              const conversationIndex = state.conversations.findIndex(c => c.partner.id === partnerId);
              if (conversationIndex !== -1) {
                const updatedConversations = [...state.conversations];
                updatedConversations[conversationIndex].loaded = true;
                return { conversations: updatedConversations };
              }
              return state;
            });
          }
        }
      })
    ),
    {
      name: "app-store",
      partialize: (store) => ({
        theme: store.theme,
      })
    }
  )
);
