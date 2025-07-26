import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {Input} from "@/components/ui/input.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {useIsMobile} from "@/hooks/use-mobile.ts";
import {useApiFetch} from "@/lib/fetch.ts";
import {useAppStore} from "@/lib/store.ts";
import {limitString} from "@/lib/strings";
import type {Conversation} from "@/types.ts";
import {MoreVertical, Plus, Search, Settings, Users} from "lucide-react";
import {useEffect} from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Link, useRoute} from "wouter";
import {navigate} from "wouter/use-browser-location";

export function ChatLayout({ children }: { children?: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [match, params] = useRoute("/friends/:id");

  const { conversations } = useAppStore(state => state);
  const { addConversation } = useAppStore.getState().conversationsActions;

  const chats = conversations.filter(c => c.messages.length > 0)
    .map(c => ({
      user: c.partner,
      lastMessage: c.messages[c.messages.length - 1],
      unreadCount: c.unreadCount
    }))
    .sort(
      (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );

  const {
    callback: fetchChats,
    loading: loadingChats,
  } = useApiFetch("/api/conversations", {
    onSuccess(res: Omit<Conversation, "loaded">[]) {
      res.forEach((c) => {
        addConversation({
          ...c,
          loaded: true
        })
      })
    }
  });

  useEffect(() => {
    if (chats.length === 0) fetchChats();
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastMessageTime = (dateString: string) => {
    const date = new Date(dateString);
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

  // Chat Skeleton Component
  const ChatSkeleton = () => (
    <Card className="mb-2">
      <CardContent className="p-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="flex items-center justify-between mt-1">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-1 bg-background max-h-[calc(100vh-4rem)]">
      {/* Mobile: Index List or Index View */}
      <div className={`${isMobile && match ? 'hidden' : 'flex'} md:flex w-full md:w-80 border-r bg-card flex-col`}>
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
                  <DropdownMenuItem asChild>
                    <Link to="~/contacts">
                      <Plus className="h-4 w-4 mr-2" />
                      New Chat
                    </Link>
                  </DropdownMenuItem>
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

        {/* Index List */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-2 flex flex-col space-y-2">
            {loadingChats ? (
              // Show skeleton loaders while loading
              Array.from({ length: 6 }, (_, index) => (
                <ChatSkeleton key={index} />
              ))
            ) : chats.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Start a new conversation to see your chats here
                </p>
                <Button asChild>
                  <Link to="~/contacts">
                    <Plus className="h-4 w-4 mr-2" />
                    New Chat
                  </Link>
                </Button>
              </div>
            ) : (
              chats.map((chat) => (
                <Card
                  key={chat.user.id}
                  className={`cursor-pointer transition-colors hover:bg-accent overflow-hidden ${match && Number(params?.id) === chat.user.id ? "bg-accent" : ""
                    }`}
                  onClick={() => {
                    navigate("/chat/friends/" + chat.user.id, {
                      replace: false
                    });
                  }}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="relative flex-shrink-0">
                        <Avatar>
                          <AvatarImage src={""} />
                          <AvatarFallback>
                            {chat.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {true && (
                          <div
                            className="absolute bottom-0 right-0 w-3 h-3 bg-chart-1 rounded-full border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="font-medium truncate flex-1 min-w-0">{chat.user.name}</p>
                          <span className="text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">
                            {formatLastMessageTime(chat.lastMessage.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="text-sm text-muted-foreground truncate flex-1 min-w-0 prose dark:prose-invert">
                            <Markdown remarkPlugins={[remarkGfm]}>
                              {limitString(chat.lastMessage.content, 30)}
                            </Markdown>
                          </div>
                          {chat.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs flex-shrink-0">
                              {chat.unreadCount >= 100 ? '99+' : chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Index Area */}
      <div className={`${isMobile && match ? 'flex' : 'hidden'} md:flex flex-1 flex-col`}>
        {children}
      </div>
    </div>
  );
}
