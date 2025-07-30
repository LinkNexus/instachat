import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {UserPlus} from "lucide-react";
import type {TabsProps} from "@/pages/Friends";
import {SentRequestsSkeleton} from "@/pages/Friends/components/Tabs/SentRequestsTab/Skeleton.tsx";
import {SentRequestCard} from "@/pages/Friends/components/Tabs/SentRequestsTab/Card.tsx";

export function SentRequestsTab({requests, count, isFetching}: TabsProps) {
  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="grid gap-3 sm:gap-4">
        {requests.map((request: any) => (
          <SentRequestCard key={request.id} request={request} />
        ))}
        {!isFetching && count === 0 && (
          <div className="text-center py-8 sm:py-12 px-4">
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-muted rounded-full flex items-center justify-center">
              <UserPlus className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground"/>
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-foreground">No sent requests</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Friend requests you send will appear here.
            </p>
          </div>
        )}
        {isFetching && (
          <SentRequestsSkeleton/>
        )}
      </div>
    </ScrollArea>
  )
}

