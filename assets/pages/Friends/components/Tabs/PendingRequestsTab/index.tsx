import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {UserPlus} from "lucide-react";
import type {TabsProps} from "@/pages/Friends";
import {PendingRequestsSkeleton} from "@/pages/Friends/components/Tabs/PendingRequestsTab/Skeleton.tsx";
import {PendingRequestCard} from "@/pages/Friends/components/Tabs/PendingRequestsTab/Card.tsx";

export function PendingRequestsTab({ requests, count, isFetching }: TabsProps) {
  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="grid gap-4">
        {requests.map((request) => (
          <PendingRequestCard
            key={request.id}
            request={request}
          />
        ))}
        {!isFetching && count === 0 && (
          <div className="text-center py-12">
            <UserPlus className="h-16 w-16 mx-auto text-muted-foreground mb-4"/>
            <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
            <p className="text-muted-foreground">
              You'll see friend requests here when someone wants to connect with you.
            </p>
          </div>
        )}
        {isFetching && (
          <PendingRequestsSkeleton />
        )}
      </div>
    </ScrollArea>
  )
}

