import {UserPlus} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {useAppStore} from "@/lib/store.ts";
import type {TabsProps} from "@/pages/Friends";
import {FriendCard} from "@/pages/Friends/components/Tabs/FriendsTabs/Card.tsx";
import {FriendsSkeleton} from "@/pages/Friends/components/Tabs/FriendsTabs/Skeleton.tsx";

export function FriendsTabs({requests, isFetching, count}: TabsProps) {
  const user = useAppStore(state => state.user);
  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="grid gap-4">
        {requests.map((request) => (
          <FriendCard key={request.id} request={request} user={user!}/>
        ))}
        {count === 0 && (
          <div className="text-center py-12">
            <UserPlus className="h-16 w-16 mx-auto text-muted-foreground mb-4"/>
            <h3 className="text-lg font-semibold mb-2">No friends found</h3>
            <p className="text-muted-foreground">
              {null ? "Try adjusting your search" : "Start by adding some friends!"}
            </p>
          </div>
        )}
        {isFetching && (
          <FriendsSkeleton />
        )}
      </div>
    </ScrollArea>
  )
}

