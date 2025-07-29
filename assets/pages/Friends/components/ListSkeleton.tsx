import {Card, CardContent} from "@/components/ui/card.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";

interface FriendsListSkeletonProps {
    count?: number;
}

export function FriendsListSkeleton({ count = 5 }: FriendsListSkeletonProps) {
    return (
        <div className="grid gap-4">
            {Array.from({ length: count }, (_, i) => (
                <FriendCardSkeleton key={i} />
            ))}
        </div>
    );
}

function FriendCardSkeleton() {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Avatar skeleton */}
                        <div className="relative">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            {/* Online status indicator skeleton */}
                            <Skeleton className="absolute bottom-0 right-0 w-3 h-3 rounded-full" />
                        </div>

                        {/* User info skeleton */}
                        <div className="space-y-2">
                            {/* Name skeleton */}
                            <Skeleton className="h-4 w-32" />
                            {/* Username skeleton */}
                            <Skeleton className="h-3 w-24" />
                            {/* Status and mutual friends skeleton */}
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                    </div>

                    {/* Action buttons skeleton */}
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-9 w-9 rounded-md" />
                        <Skeleton className="h-9 w-9 rounded-md" />
                        <Skeleton className="h-9 w-9 rounded-md" />
                        <Skeleton className="h-9 w-9 rounded-md" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function FriendRequestSkeleton({ count = 3 }: FriendsListSkeletonProps) {
    return (
        <div className="grid gap-4">
            {Array.from({ length: count }, (_, i) => (
                <FriendRequestCardSkeleton key={i} />
            ))}
        </div>
    );
}

function FriendRequestCardSkeleton() {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Avatar skeleton */}
                        <Skeleton className="h-12 w-12 rounded-full" />

                        {/* User info skeleton */}
                        <div className="space-y-2">
                            {/* Name skeleton */}
                            <Skeleton className="h-4 w-32" />
                            {/* Username skeleton */}
                            <Skeleton className="h-3 w-24" />
                            {/* Mutual friends and time skeleton */}
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                    </div>

                    {/* Action buttons skeleton for friend requests */}
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-9 w-16 rounded-md" />
                        <Skeleton className="h-9 w-16 rounded-md" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


