import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { ArrowLeft } from "lucide-react";

// MessageComponent Skeleton Component
export const MessageSkeleton = ({ isMyMessage }: { isMyMessage: boolean }) => (
    <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}>
        <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg space-y-2 ${isMyMessage ? "bg-primary/20" : "bg-muted"
            }`}>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-16" />
        </div>
    </div>
);

export const DiscussionSkeleton = () => (
    <>
        <div className="p-4 border-b bg-card">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="relative">
                        <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
            </div>
        </div>
        <ScrollArea className="p-4 overflow-y-auto flex-1">
            <div className="space-y-4">
                {Array.from({ length: 8 }, (_, index) => (
                    <MessageSkeleton key={index} isMyMessage={index % 3 === 0} />
                ))}
            </div>
        </ScrollArea>
        <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-10 flex-1 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
            </div>
        </div>
    </>
);

export const ConversationNotFound = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Avatar className="h-12 w-12">
                <AvatarFallback className="text-muted-foreground">?</AvatarFallback>
            </Avatar>
        </div>
        <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
        <p className="text-muted-foreground mb-4 max-w-md">
            This conversation does not exist or the user could not be found.
        </p>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chats
            </Button>
            <Button onClick={() => window.location.href = "/friends"}>
                Find Friends
            </Button>
        </div>
    </div>
);
