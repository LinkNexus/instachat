import {env} from "@/lib/env.ts";
import {apiFetch} from "@/lib/fetch.ts";
import type {
  Contacts,
  Conversation,
  FriendRequest,
  FriendRequestCategory,
  FriendRequestMap,
  Message,
  User
} from '@/types';
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
        } as Contacts,
        friendships: {
          "accepted": {
            count: undefined as number | undefined,
            requests: [] as FriendRequest[],
            loaded: false
          },
          "pending": {
            count: undefined as number | undefined,
            requests: [] as FriendRequest[],
            loaded: false
          },
          "sent": {
            count: undefined as number | undefined,
            requests: [] as FriendRequest[],
            loaded: false
          }
        } satisfies Record<FriendRequestCategory, FriendRequestMap>,
      },
      (set, get) => ({
        setUser: (user: User | undefined) => set({user}),
        setTheme: (theme: Theme) => set({theme}),
        logout: () => {
          apiFetch("/api/auth/logout")
            .then(() => set({user: undefined}))
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
              return {contacts: {...state.contacts, ...contacts, loaded: true}};
            });
          },
          addConversation: (conversation: Conversation) => set((state) => {
            if (state.conversations.some(c => c.partner.id === conversation.partner.id)) {
              return state; // Conversation already exists
            }
            return {conversations: [...state.conversations, conversation]};
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
                return {conversations: updatedConversations};
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
                    detail: {message},
                    bubbles: true,
                  }))
                }
                return {conversations: updatedConversations};
              }
              return state;
            });
          },
          deleteMessage(messageId: number) {
            set((state) => {
              const updatedConversations = state.conversations.map(conversation => ({
                ...conversation,
                messages: conversation.messages.filter(m => m.id !== messageId)
              }));
              return {conversations: updatedConversations};
            });
          },
          updateMessage(message: Message) {
            set((state) => {
              const updatedConversations = state.conversations.map(c => {
                const messages = c.messages.map(m => {
                  return m.id === message.id ? {...m, ...message} : m;
                });
                return {...c, messages};
              });
              return {conversations: updatedConversations};
            })
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
                return {conversations: updatedConversations};
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
                return {conversations: updatedConversations};
              }
              return state;
            });
          }
        },
        friendsActions: {
          addRequest(category: FriendRequestCategory, request: FriendRequest) {
            set(state => {
              const currentCategory = state.friendships[category];
              if (currentCategory.requests.some((r) => r.id === request.id)) {
                return state; // Request already exists
              }
              return {
                friendships: {
                  ...state.friendships,
                  [category]: {
                    ...currentCategory,
                    requests: [...currentCategory.requests, request],
                    loaded: true
                  }
                }
              };
            })
          },
          moveRequest(requestId: number, category: FriendRequestCategory) {
            set(state => {
              const updatedFriendships = {...state.friendships};
              Object.keys(updatedFriendships).forEach(cat => {
                updatedFriendships[cat as FriendRequestCategory].requests = updatedFriendships[cat as FriendRequestCategory].requests.filter(r => r.id !== requestId);
              });
              const requestToMove = state.friendships[category].requests.find(r => r.id === requestId);
              if (requestToMove) {
                updatedFriendships[category].requests.push(requestToMove);
              }
              return {friendships: updatedFriendships};
            });
          },
          deleteRequest(requestId: number)  {
            set(state => {
              const updatedFriendships = {...state.friendships};
              Object.keys(updatedFriendships).forEach(category => {
                updatedFriendships[category as FriendRequestCategory].requests = updatedFriendships[category as FriendRequestCategory].requests.filter(r => r.id !== requestId);
              });
              return {friendships: updatedFriendships};
            });
          },
          setRequestsCount(category: FriendRequestCategory, count: number) {
            set(state => {
              const currentCategory = state.friendships[category];
              return {
                friendships: {
                  ...state.friendships,
                  [category]: {
                    ...currentCategory,
                    count: count,
                  }
                }
              };
            });
          },
          alterRequestsCount(category: FriendRequestCategory, count: number) {
            set(state => {
              const currentCategory = state.friendships[category];
              return {
                friendships: {
                  ...state.friendships,
                  [category]: {
                    ...currentCategory,
                    count: (currentCategory.count || 0) + count,
                  }
                }
              };
            });
          },
          switchRequestsLoaded(category: FriendRequestCategory) {
            set(state => {
              const currentCategory = state.friendships[category];
              return {
                friendships: {
                  ...state.friendships,
                  [category]: {
                    ...currentCategory,
                    loaded: true
                  }
                }
              };
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
