export interface User {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
  profileImage?: string;
  username: string;
}

export interface Conversation {
  partner: Omit<User, "email" | "isVerified" | "role">;
  messages: Message[];
  unreadCount: number;
  count: number;
  loaded: boolean;
}

export interface Message {
  id: number;
  content: string;
  sender: Omit<User, "email" | "isVerified" | "role">;
  receiver: Omit<User, "email" | "isVerified" | "role">;
  createdAt: string;
  modifiedAt: string;
  readAt?: string;
  editedAt?: string;
}

export type MessageEvent = "message.created"|"message.updated"|"message.deleted";

export interface Contacts {
  friends: Omit<User, "email">[];
  groups: any[];
  loaded: boolean;
}
