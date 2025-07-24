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
            if (state.conversations.some(c => c.user.id === conversation.user.id)) {
              return state; // Conversation already exists
            }
            return { conversations: [...state.conversations, conversation] };
          }),
          getConversation: (partnerId: number) => {
            return get().conversations.find(c => c.user.id === partnerId);
          },
          addMessage: (partnerId: number, message: Message) => {
            set((state) => {
              const conversationIndex = state.conversations.findIndex(c => c.user.id === partnerId);
              if (conversationIndex !== -1 && !state.conversations[conversationIndex].messages.some(m => m.id === message.id)) {
                const updatedConversations = [...state.conversations];
                updatedConversations[conversationIndex].messages.push(message);
                return { conversations: updatedConversations };
              }
              return state;
            });
          },
          prependMessages(partnerId: number, messages: Message[]) {
            set((state) => {
              const conversationIndex = state.conversations.findIndex(c => c.user.id === partnerId);
              if (conversationIndex !== -1) {
                const updatedConversations = [...state.conversations];
                messages.forEach(m => {
                  if (!updatedConversations[conversationIndex].messages.some(existingMessage => existingMessage.id === m.id)) {
                    updatedConversations[conversationIndex].messages.unshift(m);
                  }
                })
                return { conversations: updatedConversations };
              }
              return state;
            });
          },
          switchNoMoreMessages(partnerId: number) {
            set((state) => {
              const conversationIndex = state.conversations.findIndex(c => c.user.id === partnerId);
              if (conversationIndex !== -1) {
                const updatedConversations = [...state.conversations];
                updatedConversations[conversationIndex].noMoreMessages = true;
                return { conversations: updatedConversations };
              }
              return state;
            });
          },
          switchMessagesLoaded(partnerId: number) {
            set((state) => {
              const conversationIndex = state.conversations.findIndex(c => c.user.id === partnerId);
              if (conversationIndex !== -1) {
                const updatedConversations = [...state.conversations];
                updatedConversations[conversationIndex].messagesLoaded = true;
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
