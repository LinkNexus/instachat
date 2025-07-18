import type {User} from "@/types.ts";

declare global {
  interface Window {
    user: User | undefined
  }
}
