import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {MessageSquare, MoreVertical, Phone, Search, Settings, UserPlus, UserX, Video} from "lucide-react";
import {useState} from "react";

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
  mutualFriends: number;
}

interface FriendRequest {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  mutualFriends: number;
  sentAt: Date;
  type: 'sent' | 'received';
}

const mockFriends: Friend[] = [
  {
    id: "1",
    name: "Alice Johnson",
    username: "alice_j",
    avatar: "https://github.com/shadcn.png",
    isOnline: true,
    mutualFriends: 12,
  },
  {
    id: "2",
    name: "Bob Smith",
    username: "bob_smith",
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000),
    mutualFriends: 8,
  },
  {
    id: "3",
    name: "Carol White",
    username: "carol_w",
    isOnline: true,
    mutualFriends: 15,
  },
  {
    id: "4",
    name: "David Brown",
    username: "david_b",
    isOnline: false,
    lastSeen: new Date(Date.now() - 86400000),
    mutualFriends: 5,
  },
];

const mockPendingRequests: FriendRequest[] = [
  {
    id: "1",
    name: "Emma Wilson",
    username: "emma_w",
    avatar: "https://github.com/shadcn.png",
    mutualFriends: 3,
    sentAt: new Date(Date.now() - 3600000),
    type: 'received',
  },
  {
    id: "2",
    name: "James Miller",
    username: "james_m",
    mutualFriends: 7,
    sentAt: new Date(Date.now() - 7200000),
    type: 'sent',
  },
  {
    id: "3",
    name: "Sarah Davis",
    username: "sarah_d",
    mutualFriends: 2,
    sentAt: new Date(Date.now() - 86400000),
    type: 'received',
  },
];

export function Friends() {
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>(mockPendingRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [newFriendUsername, setNewFriendUsername] = useState("");

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const receivedRequests = pendingRequests.filter(req => req.type === 'received');
  const sentRequests = pendingRequests.filter(req => req.type === 'sent');

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    } else if (diff < 86400000) { // Less than 24 hours
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    } else if (diff < 604800000) { // Less than 7 days
      const days = Math.floor(diff / 86400000);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleAcceptRequest = (requestId: string) => {
    const request = pendingRequests.find(req => req.id === requestId);
    if (request) {
      const newFriend: Friend = {
        id: request.id,
        name: request.name,
        username: request.username,
        avatar: request.avatar,
        isOnline: false,
        mutualFriends: request.mutualFriends,
      };
      setFriends([...friends, newFriend]);
      setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
    }
  };

  const handleDeclineRequest = (requestId: string) => {
    setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
  };

  const handleRemoveFriend = (friendId: string) => {
    setFriends(friends.filter(friend => friend.id !== friendId));
  };

  const handleSendFriendRequest = () => {
    if (!newFriendUsername.trim()) return;

    // Simulate sending a friend request
    const newRequest: FriendRequest = {
      id: Date.now().toString(),
      name: newFriendUsername,
      username: newFriendUsername.toLowerCase().replace(/\s+/g, '_'),
      mutualFriends: Math.floor(Math.random() * 10),
      sentAt: new Date(),
      type: 'sent',
    };

    setPendingRequests([...pendingRequests, newRequest]);
    setNewFriendUsername("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Friends</h1>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2"/>
              Settings
            </Button>
          </div>

          {/* Search and Add Friend */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Add friend by username..."
                value={newFriendUsername}
                onChange={(e) => setNewFriendUsername(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendFriendRequest();
                  }
                }}
                className="w-full sm:w-64"
              />
              <Button onClick={handleSendFriendRequest} className="shrink-0">
                <UserPlus className="h-4 w-4 sm:mr-2"/>
                <span className="hidden sm:inline">Add</span>
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all-friends" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all-friends" className="text-xs sm:text-sm">
              All Friends ({friends.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm">
              Pending ({receivedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="sent" className="text-xs sm:text-sm">
              Sent ({sentRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-friends" className="mt-6">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="grid gap-4">
                {filteredFriends.map((friend) => (
                  <Card key={friend.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={friend.avatar}/>
                              <AvatarFallback>
                                {friend.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {friend.isOnline && (
                              <div
                                className="absolute bottom-0 right-0 w-3 h-3 bg-chart-1 rounded-full border-2 border-background"/>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{friend.name}</h3>
                            <p className="text-sm text-muted-foreground">@{friend.username}</p>
                            <div className="flex items-center space-x-4 mt-1">
                                                            <span className="text-xs text-muted-foreground">
                                                                {friend.isOnline ? (
                                                                  <Badge variant="secondary"
                                                                         className="text-xs">Online</Badge>
                                                                ) : (
                                                                  `Last seen ${formatLastSeen(friend.lastSeen!)}`
                                                                )}
                                                            </span>
                              <span className="text-xs text-muted-foreground">
                                                                {friend.mutualFriends} mutual friends
                                                            </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="icon">
                            <MessageSquare className="h-4 w-4"/>
                          </Button>
                          <Button variant="outline" size="icon">
                            <Phone className="h-4 w-4"/>
                          </Button>
                          <Button variant="outline" size="icon">
                            <Video className="h-4 w-4"/>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon">
                                <MoreVertical className="h-4 w-4"/>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Block</DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <UserX className="h-4 w-4 mr-2"/>
                                    Remove Friend
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remove Friend</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to remove {friend.name} from your friends list?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleRemoveFriend(friend.id)}>
                                      Remove
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredFriends.length === 0 && (
                  <div className="text-center py-12">
                    <UserPlus className="h-16 w-16 mx-auto text-muted-foreground mb-4"/>
                    <h3 className="text-lg font-semibold mb-2">No friends found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? "Try adjusting your search" : "Start by adding some friends!"}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="grid gap-4">
                {receivedRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={request.avatar}/>
                            <AvatarFallback>
                              {request.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{request.name}</h3>
                            <p className="text-sm text-muted-foreground">@{request.username}</p>
                            <div className="flex items-center space-x-4 mt-1">
                                                            <span className="text-xs text-muted-foreground">
                                                                {request.mutualFriends} mutual friends
                                                            </span>
                              <span className="text-xs text-muted-foreground">
                                                                {formatLastSeen(request.sentAt)}
                                                            </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => handleDeclineRequest(request.id)}
                          >
                            Decline
                          </Button>
                          <Button onClick={() => handleAcceptRequest(request.id)}>
                            Accept
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {receivedRequests.length === 0 && (
                  <div className="text-center py-12">
                    <UserPlus className="h-16 w-16 mx-auto text-muted-foreground mb-4"/>
                    <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                    <p className="text-muted-foreground">
                      You'll see friend requests here when someone wants to connect with you.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="sent" className="mt-6">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="grid gap-4">
                {sentRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={request.avatar}/>
                            <AvatarFallback>
                              {request.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{request.name}</h3>
                            <p className="text-sm text-muted-foreground">@{request.username}</p>
                            <div className="flex items-center space-x-4 mt-1">
                                                            <span className="text-xs text-muted-foreground">
                                                                {request.mutualFriends} mutual friends
                                                            </span>
                              <span className="text-xs text-muted-foreground">
                                                                Sent {formatLastSeen(request.sentAt)}
                                                            </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">Pending</Badge>
                          <Button
                            variant="outline"
                            onClick={() => handleDeclineRequest(request.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {sentRequests.length === 0 && (
                  <div className="text-center py-12">
                    <UserPlus className="h-16 w-16 mx-auto text-muted-foreground mb-4"/>
                    <h3 className="text-lg font-semibold mb-2">No sent requests</h3>
                    <p className="text-muted-foreground">
                      Friend requests you send will appear here.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
