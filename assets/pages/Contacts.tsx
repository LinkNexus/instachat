import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiFetch } from "@/lib/fetch.ts";
import { useAppStore } from "@/lib/store.ts";
import type { Contacts } from "@/types.ts";
import { ArrowLeft, Globe, Lock, MessageSquare, Search, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";
import { navigate } from "wouter/use-browser-location";

interface Group {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  memberCount: number;
  isPublic: boolean;
  isJoined: boolean;
}

// Mock data
const mockGroups: Group[] = [
  {
    id: "1",
    name: "Web Development",
    description: "Discussing latest web technologies and frameworks",
    avatar: "https://github.com/shadcn.png",
    memberCount: 156,
    isPublic: true,
    isJoined: false,
  },
  {
    id: "2",
    name: "React Developers",
    description: "Everything React and ecosystem",
    memberCount: 89,
    isPublic: true,
    isJoined: true,
  },
  {
    id: "3",
    name: "Project Team Alpha",
    description: "Private team discussion",
    avatar: "https://github.com/shadcn.png",
    memberCount: 5,
    isPublic: false,
    isJoined: true,
  },
];

export function Contacts() {
  const contacts = useAppStore(state => state.contacts);
  const { addConversation, addContacts } = useAppStore.getState().conversationsActions;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("contacts");

  const filteredContacts = contacts.friends.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = mockGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const {
    loading: isFetching,
    callback: fetchChats
  } = useApiFetch("/api/conversations/contacts", {
    onSuccess: addContacts,
    onError() {
      toast.error("Failed to fetch chats. Please try again later.");
    }
  });

  useEffect(() => {
    if (!contacts.loaded) {
      fetchChats()
    }
  }, []);

  const handleStartChat = async (contact: Contacts["friends"][0]) => {
    addConversation({
      user: contact,
      messages: [],
      messagesLoaded: false,
      unreadCount: 0
    });
    navigate(`/chat/friends/${contact.id}`, {
      replace: false
    });
  };

  const handleJoinGroup = (groupId: string) => {
    // Navigate to group chat
    navigate(`/chat/group/${groupId}`, {
      replace: false
    });
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) {
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Skeleton loader component for contacts
  const ContactSkeleton = () => (
    <Card className="mb-2">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="flex flex-col items-end gap-1">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/chat">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">New Chat</h1>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search contacts or groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Recent Chats */}
      {/*{searchQuery === "" && (*/}
      {/*    <div className="px-4">*/}
      {/*        <h2 className="text-sm font-medium text-muted-foreground mb-3">Recent</h2>*/}
      {/*        <div className="space-y-2 mb-4">*/}
      {/*            {mockRecentChats.map((chat) => (*/}
      {/*                <Card*/}
      {/*                    key={chat.id}*/}
      {/*                    className="cursor-pointer hover:bg-accent transition-colors"*/}
      {/*                    onClick={() => handleStartChat(chat)}*/}
      {/*                >*/}
      {/*                    <CardContent className="p-3">*/}
      {/*                        <div className="flex items-center gap-3">*/}
      {/*                            <Avatar className="h-10 w-10">*/}
      {/*                                <AvatarImage src={chat.avatar} alt={chat.name} />*/}
      {/*                                <AvatarFallback>*/}
      {/*                                    {chat.isGroup ? (*/}
      {/*                                        <Users className="h-4 w-4" />*/}
      {/*                                    ) : (*/}
      {/*                                        chat.name.split(' ').map(n => n[0]).join('')*/}
      {/*                                    )}*/}
      {/*                                </AvatarFallback>*/}
      {/*                            </Avatar>*/}
      {/*                            <div className="flex-1 min-w-0">*/}
      {/*                                <div className="flex items-center justify-between">*/}
      {/*                                    <p className="font-medium truncate">{chat.name}</p>*/}
      {/*                                    <span className="text-xs text-muted-foreground">*/}
      {/*                                        {formatTimestamp(chat.timestamp)}*/}
      {/*                                    </span>*/}
      {/*                                </div>*/}
      {/*                                <p className="text-sm text-muted-foreground truncate">*/}
      {/*                                    {chat.lastMessage}*/}
      {/*                                </p>*/}
      {/*                            </div>*/}
      {/*                        </div>*/}
      {/*                    </CardContent>*/}
      {/*                </Card>*/}
      {/*            ))}*/}
      {/*        </div>*/}
      {/*        <Separator className="mb-4" />*/}
      {/*    </div>*/}
      {/*)}*/}

      {/* Tabs */}
      <div className="flex-1 flex flex-col px-4 min-h-0">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Groups
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="flex-1 mt-4 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="space-y-2 pb-4">
                {isFetching ? (
                  // Show skeleton loaders while fetching
                  Array.from({ length: 6 }, (_, index) => (
                    <ContactSkeleton key={index} />
                  ))
                ) : filteredContacts.length === 0 ? (
                  <div className="text-center py-8">
                    <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {searchQuery ? "No contacts found" : "No contacts yet"}
                    </p>
                    {!searchQuery && (
                      <Button variant="outline" className="mt-4" asChild>
                        <Link href="/friends">
                          Add Friends
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  filteredContacts.map((contact) => (
                    <Card
                      key={contact.id}
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleStartChat(contact)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={"https://github.com/shadcn.png"} alt={contact.name} />
                              <AvatarFallback>
                                {contact.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {true && (
                              <div
                                className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium truncate">{contact.name}</p>
                                <p className="text-sm text-muted-foreground">@{contact.username}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                {true && (
                                  <Badge variant="secondary" className="text-xs">
                                    Friend
                                  </Badge>
                                )}
                                {true ? (
                                  <span className="text-xs text-green-600">Online</span>
                                ) : true ? (
                                  <span className="text-xs text-muted-foreground">
                                    {formatLastSeen(new Date())}
                                  </span>
                                ) : (
                                  <span className="text-xs text-muted-foreground">Offline</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="groups" className="flex-1 mt-4 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="space-y-2 pb-4">
                {filteredGroups.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {searchQuery ? "No groups found" : "No groups available"}
                    </p>
                    {!searchQuery && (
                      <Button variant="outline" className="mt-4">
                        Create Group
                      </Button>
                    )}
                  </div>
                ) : (
                  filteredGroups.map((group) => (
                    <Card
                      key={group.id}
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleJoinGroup(group.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={group.avatar} alt={group.name} />
                            <AvatarFallback>
                              <Users className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium truncate">{group.name}</p>
                                  {group.isPublic ? (
                                    <Globe className="h-3 w-3 text-muted-foreground" />
                                  ) : (
                                    <Lock className="h-3 w-3 text-muted-foreground" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                  {group.description}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {group.memberCount} members
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                {group.isJoined ? (
                                  <Badge variant="default" className="text-xs">
                                    Joined
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">
                                    {group.isPublic ? "Join" : "Request"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
