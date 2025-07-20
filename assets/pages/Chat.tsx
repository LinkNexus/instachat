import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Settings,
  Smile,
  Users,
  Video
} from "lucide-react";
import {useEffect, useRef, useState} from "react";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isOwn: boolean;
}

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
  isGroup: boolean;
}

const mockChats: Chat[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "https://github.com/shadcn.png",
    lastMessage: "Hey! How are you doing?",
    timestamp: new Date(),
    unreadCount: 2,
    isOnline: true,
    isGroup: false,
  },
  {
    id: "2",
    name: "Work Team",
    lastMessage: "Meeting at 3 PM tomorrow",
    timestamp: new Date(Date.now() - 3600000),
    unreadCount: 0,
    isOnline: false,
    isGroup: true,
  },
  {
    id: "3",
    name: "Bob Smith",
    lastMessage: "Thanks for your help!",
    timestamp: new Date(Date.now() - 7200000),
    unreadCount: 1,
    isOnline: false,
    isGroup: false,
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Hey! How are you doing?",
    senderId: "alice",
    senderName: "Alice Johnson",
    timestamp: new Date(Date.now() - 3600000),
    isOwn: false,
  },
  {
    id: "2",
    content: "I'm doing great! Just finished working on a new project.",
    senderId: "me",
    senderName: "You",
    timestamp: new Date(Date.now() - 3000000),
    isOwn: true,
  },
  {
    id: "3",
    content: "That sounds exciting! What kind of project?",
    senderId: "alice",
    senderName: "Alice Johnson",
    timestamp: new Date(Date.now() - 2400000),
    isOwn: false,
  },
  {
    id: "4",
    content: "It's a messaging app with React and TypeScript. Really enjoying working with the new tech stack!",
    senderId: "me",
    senderName: "You",
    timestamp: new Date(Date.now() - 1800000),
    isOwn: true,
  },
];

export function Chat() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [showChatList, setShowChatList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: "me",
      senderName: "You",
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastMessageTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 86400000) { // Less than 24 hours
      return formatTime(date);
    } else if (diff < 604800000) { // Less than 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex flex-1 bg-background">
      {/* Mobile: Chat List or Chat View */}
      <div className={`${showChatList ? 'flex' : 'hidden'} md:flex w-full md:w-80 border-r bg-card flex-col`}>
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Messages</h1>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Users className="h-4 w-4 mr-2" />
                    Friends
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {mockChats.map((chat) => (
              <Card
                key={chat.id}
                className={`mb-2 cursor-pointer transition-colors hover:bg-accent ${selectedChat?.id === chat.id ? "bg-accent" : ""
                }`}
                onClick={() => {
                  setSelectedChat(chat);
                  // On mobile, hide chat list when selecting a chat
                  if (window.innerWidth < 768) {
                    setShowChatList(false);
                  }
                }}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={chat.avatar} />
                        <AvatarFallback>
                          {chat.isGroup ? (
                            <Users className="h-4 w-4" />
                          ) : (
                            chat.name.split(' ').map(n => n[0]).join('')
                          )}
                        </AvatarFallback>
                      </Avatar>
                      {chat.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-chart-1 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{chat.name}</p>
                        <span className="text-xs text-muted-foreground">
                                                    {formatLastMessageTime(chat.timestamp)}
                                                </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage}
                        </p>
                        {chat.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className={`${!showChatList ? 'flex' : 'hidden'} md:flex flex-1 flex-col`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Mobile back button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setShowChatList(true)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={selectedChat.avatar} />
                      <AvatarFallback>
                        {selectedChat.isGroup ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          selectedChat.name.split(' ').map(n => n[0]).join('')
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {selectedChat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-chart-1 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold">{selectedChat.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedChat.isOnline ? "Online" : "Last seen recently"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="hidden sm:flex">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hidden sm:flex">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hidden sm:flex">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${message.isOwn
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                        }`}
                      >
                        <p className="text-sm break-words">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-card">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                    className="pr-12"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/20">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No chat selected</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
