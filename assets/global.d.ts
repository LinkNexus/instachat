import type {User} from "@/types.ts";

declare global {
  interface Window {
    user: User | undefined,
    csrfToken: string,
    mercure: {
      messagesChannel: string;
      friendRequestsChannel: string;
    }
  }
}
