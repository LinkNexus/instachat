import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";

export function PendingRequestsSkeleton() {
  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <div className="flex items-center space-x-4 mt-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
