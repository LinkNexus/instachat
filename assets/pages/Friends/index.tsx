import {Index} from "@/pages/Friends/components/AddFriendModal";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useApiFetch} from "@/lib/fetch.ts";
import {useAppStore} from "@/lib/store.ts";
import type {FriendRequest, FriendRequestCategory, FriendRequestMap} from "@/types.ts";
import {Search, Settings, UserPlus} from "lucide-react";
import {useEffect, useMemo} from "react";
import {SentRequestsTab} from "@/pages/Friends/components/Tabs/SentRequestsTab";
import {toast} from "sonner";
import {useSearchParams} from "wouter";
import {FriendsTabs} from "@/pages/Friends/components/Tabs/FriendsTabs";
import {PendingRequestsTab} from "@/pages/Friends/components/Tabs/PendingRequestsTab";

export interface TabsProps extends Omit<FriendRequestMap, "loaded"> {
  isFetching: boolean
}

export function Friends() {
  const friendships = useAppStore(state => state.friendships);
  const {addRequest, setRequestsCount, switchRequestsLoaded} = useAppStore.getState().friendsActions;
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = useMemo(() => {
    return searchParams.get("tab") as FriendRequestCategory || "accepted"
  }, [searchParams.get("tab")]);

  const {
    loading: isFetchingRequests,
    callback: fetchRequests
  } = useApiFetch("/api/friend-requests", {
    method: "GET",
    onSuccess(requests: FriendRequest[]) {
      requests.forEach(request => {
        addRequest(currentCategory, request);
      })
      switchRequestsLoaded(currentCategory);
    },
    onError(err) {
      console.error("Failed to fetch friend requests:", err);
      toast.error("Failed to load friend requests. Please try again later.");
    }
  }, [currentCategory]);

  const {
    callback: fetchRequestsCount,
    loading: isFetchingCount,
  } = useApiFetch("/api/friend-requests/count", {
    method: "GET",
    onSuccess(res: Record<FriendRequestCategory, number>) {
      Object.entries(res).forEach(([category, count]) => {
        setRequestsCount(category as FriendRequestCategory, count);
      });
    },
    onError(err) {
      console.error("Failed to fetch friend requests count:", err);
    }
  });

  useEffect(() => {
    if (
      Object.values(friendships)
        .some(m => m.count === undefined)
    ) {
      fetchRequestsCount();
    }
  }, []);

  useEffect(() => {
    if (!friendships[currentCategory].loaded) {
      fetchRequests({
        searchParams: {
          category: currentCategory
        }
      });
    }
  }, [currentCategory]);

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
          <div className="flex flex-row space-x-2 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
              <Input
                placeholder="Search friends..."
                className="pl-10"
              />
            </div>
            <Index>
              <Button className="shrink-0">
                <UserPlus className="h-4 w-4 sm:mr-2"/>
                <span className="hidden sm:inline">Add Friend</span>
              </Button>
            </Index>
          </div>
        </div>

        <Tabs
          value={currentCategory}
          onValueChange={(val) => setSearchParams({
            tab: val as FriendRequestCategory
          })}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="accepted" className="text-xs sm:text-sm">
              All Friends {isFetchingCount ? (
              <span className="animate-pulse">...</span>
            ) : (
              `(${friendships.accepted.count || 0})`
            )}
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm">
              Pending {isFetchingCount ? (
              <span className="animate-pulse">...</span>
            ) : (
              `(${friendships.pending.count || 0})`
            )}
            </TabsTrigger>
            <TabsTrigger value="sent" className="text-xs sm:text-sm">
              Sent {isFetchingCount ? (
              <span className="animate-pulse">...</span>
            ) : (
              `(${friendships.sent.count || 0})`
            )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accepted" className="mt-6">
            <FriendsTabs {...friendships.accepted} isFetching={isFetchingRequests}/>
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <PendingRequestsTab {...friendships.pending} isFetching={isFetchingRequests}/>
          </TabsContent>

          <TabsContent value="sent" className="mt-6">
            <SentRequestsTab {...friendships.sent} isFetching={isFetchingRequests}/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
