import {Skeleton} from "@/components/ui/skeleton";

export function SearchResultSkeleton() {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
      <div className="flex items-center space-x-3 flex-1">
        <Skeleton className="h-11 w-11 rounded-full flex-shrink-0"/>
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3.5 w-32"/>
          <Skeleton className="h-3 w-24"/>
        </div>
      </div>
      <Skeleton className="h-8 w-14 flex-shrink-0 rounded-md"/>
    </div>
  );
}
