import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";

export function SentRequestsSkeleton() {
  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="grid gap-3 sm:gap-4">
        {Array.from({length: 4}, (_, i) => (
          <SentRequestCardSkeleton key={i}/>
        ))}
      </div>
    </ScrollArea>
  );
}

function SentRequestCardSkeleton() {
  return (
    <Card className="border border-border">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            {/* Avatar skeleton */}
            <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-full flex-shrink-0"/>

            {/* User info skeleton */}
            <div className="space-y-2 flex-1 min-w-0">
              {/* Name skeleton */}
              <Skeleton className="h-3.5 sm:h-4 w-28 sm:w-32"/>
              {/* Username skeleton */}
              <Skeleton className="h-3 w-20 sm:w-24"/>
              {/* Mutual friends and time skeleton */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 mt-1">
                <Skeleton className="h-3 w-16 sm:w-20"/>
                <Skeleton className="h-3 w-12 sm:w-16"/>
              </div>
            </div>
          </div>

          {/* Action buttons skeleton */}
          <div
            className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 flex-shrink-0">
            <Skeleton className="h-5 w-14 sm:w-16 rounded-full order-2 sm:order-1"/> {/* Badge skeleton */}
            <Skeleton className="h-8 w-16 rounded-md order-1 sm:order-2"/> {/* Cancel button skeleton */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
