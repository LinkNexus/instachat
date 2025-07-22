export interface User {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
  profileImage?: string;
  username: string;
}

export interface Conversation {
  user: Omit<User, "email"|"isVerified">;
  messages: Message[];
  unreadCount: number;
  messagesLoaded?: boolean;
}

export interface Message {
  id: number;
  content: string;
  sender: Pick<User, "id">;
  receiver: Pick<User, "id">;
  createdAt: string;
  modifiedAt: string;
  readAt?: string;
}
