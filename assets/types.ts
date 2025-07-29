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
  repliedMessage?: Message | null;
}

export interface Contacts {
  friends: Omit<User, "email">[];
  groups: any[];
  loaded: boolean;
}

export interface MessageEvent {
  event: "message.created" | "message.deleted" | "message.updated";
  message: Message;
}

export interface FriendRequest {
  id: number;
  requester: Omit<User, "email"|"isVerified"|"role">;
  targetUser: FriendRequest["requester"];
  status: "accepted" | "pending";
  createdAt: string;
}

export type FriendRequestCategory = "accepted" | "pending" | "sent";
