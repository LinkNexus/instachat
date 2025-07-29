import {Index} from "@/pages/Friends/components/AddFriendModal";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useApiFetch} from "@/lib/fetch.ts";
import {useAppStore} from "@/lib/store.ts";
import {FriendsListSkeleton} from "@/pages/Friends/components/ListSkeleton.tsx";
import type {FriendRequest, FriendRequestCategory} from "@/types.ts";
import {Search, Settings, UserPlus} from "lucide-react";
import {useEffect, useState} from "react";
import {FriendsTabs} from "@/pages/Friends/components/Tabs/FriendsTabs.tsx";

export function Friends() {
  const {accepted} = useAppStore(state => state.friendships);
  const { addRequest, alterRequestsCount, switchRequestsLoaded } = useAppStore.getState().friendsActions;
  const [currentCategory, setCurrentCategory] = useState<FriendRequestCategory>("accepted");

  const { callback: fetchRequests } = useApiFetch("/api/friend-requests", {
    method: "GET",
    onSuccess(res: {
      requests: FriendRequest[];
      count: number
    }) {
      res.requests.forEach(request => {
        addRequest(currentCategory, request);
        alterRequestsCount(currentCategory, res.count);
        switchRequestsLoaded(currentCategory);
      })
    }
  }, [currentCategory]);

  useEffect(() => {
    switch (currentCategory) {
      case "accepted":
        if (!accepted.loaded) {
          fetchRequests({
            searchParams: { category: "accepted" }
          });
        }
        break;
    }
  }, [currentCategory]);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Friends</h1>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>

          {/* Search and Add Friend */}
          <div className="flex flex-row space-x-2 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search friends..."
                className="pl-10"
              />
            </div>
            <Index>
              <Button className="shrink-0">
                <UserPlus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Add Friend</span>
              </Button>
            </Index>
          </div>
        </div>

        <Tabs
          value={currentCategory}
          onValueChange={(val) => setCurrentCategory(val as FriendRequestCategory)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="accepted" className="text-xs sm:text-sm">
              All Friends (0)
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm">
              Pending
            </TabsTrigger>
            <TabsTrigger value="sent" className="text-xs sm:text-sm">
              Sent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accepted" className="mt-6">
            {accepted.count > 0 ? (
              <FriendsTabs {...accepted} />
            ) : (
              <FriendsListSkeleton />
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="grid gap-4">
                {[].map((request) => (
                  <Card key={0}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={""} />
                            <AvatarFallback>
                              AB
                              {/*{request.name.split(' ').map(n => n[0]).join('')}*/}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">2</h3>
                            <p className="text-sm text-muted-foreground">@1</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-muted-foreground">
                                0 mutual friends
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatLastSeen(new Date())}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                          >
                            Decline
                          </Button>
                          <Button>
                            Accept
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {/*{receivedRequests.length === 0 && (*/}
                {/*  <div className="text-center py-12">*/}
                {/*    <UserPlus className="h-16 w-16 mx-auto text-muted-foreground mb-4"/>*/}
                {/*    <h3 className="text-lg font-semibold mb-2">No pending requests</h3>*/}
                {/*    <p className="text-muted-foreground">*/}
                {/*      You'll see friend requests here when someone wants to connect with you.*/}
                {/*    </p>*/}
                {/*  </div>*/}
                {/*)}*/}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="sent" className="mt-6">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="grid gap-4">
                {/*{sentRequests.map((request) => (*/}
                {/*  <Card key={request.id}>*/}
                {/*    <CardContent className="p-4">*/}
                {/*      <div className="flex items-center justify-between">*/}
                {/*        <div className="flex items-center space-x-4">*/}
                {/*          <Avatar className="h-12 w-12">*/}
                {/*            <AvatarImage src={request.avatar}/>*/}
                {/*            <AvatarFallback>*/}
                {/*              {request.name.split(' ').map(n => n[0]).join('')}*/}
                {/*            </AvatarFallback>*/}
                {/*          </Avatar>*/}
                {/*          <div>*/}
                {/*            <h3 className="font-semibold">{request.name}</h3>*/}
                {/*            <p className="text-sm text-muted-foreground">@{request.username}</p>*/}
                {/*            <div className="flex items-center space-x-4 mt-1">*/}
                {/*                                          <span className="text-xs text-muted-foreground">*/}
                {/*                                              {request.mutualFriends} mutual friends*/}
                {/*                                          </span>*/}
                {/*              <span className="text-xs text-muted-foreground">*/}
                {/*                                              Sent {formatLastSeen(request.sentAt)}*/}
                {/*                                          </span>*/}
                {/*            </div>*/}
                {/*          </div>*/}
                {/*        </div>*/}
                {/*        <div className="flex items-center space-x-2">*/}
                {/*          <Badge variant="secondary">Pending</Badge>*/}
                {/*          <Button*/}
                {/*            variant="outline"*/}
                {/*            onClick={() => handleDeclineRequest(request.id)}*/}
                {/*          >*/}
                {/*            Cancel*/}
                {/*          </Button>*/}
                {/*        </div>*/}
                {/*      </div>*/}
                {/*    </CardContent>*/}
                {/*  </Card>*/}
                {/*))}*/}
                {/*{sentRequests.length === 0 && (*/}
                {/*  <div className="text-center py-12">*/}
                {/*    <UserPlus className="h-16 w-16 mx-auto text-muted-foreground mb-4"/>*/}
                {/*    <h3 className="text-lg font-semibold mb-2">No sent requests</h3>*/}
                {/*    <p className="text-muted-foreground">*/}
                {/*      Friend requests you send will appear here.*/}
                {/*    </p>*/}
                {/*  </div>*/}
                {/*)}*/}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
