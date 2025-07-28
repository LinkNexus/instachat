import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiFetch } from "@/lib/fetch";
import { useThrottle } from "@/lib/time";
import type { FriendRequest, User } from "@/types";
import { Search, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";

interface AddFriendModalProps {
    children: React.ReactNode;
}

export function AddFriendModal({ children }: AddFriendModalProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [searchResultsCount, setSearchResultsCount] = useState(0);

    const { loading: isSearching, callback: searchUsers } = useApiFetch(`/api/users?search=${searchQuery.trim().toLowerCase()}`, {
        method: "GET",
        onSuccess(data: { count: number, results: User[] }) {
            setSearchResults(data.results);
            setSearchResultsCount(data.count);
        }
    }, [searchQuery.trim().toLowerCase()]);

    const throttleSearchUsers = useThrottle(searchUsers, 500);

    useEffect(() => {
        if (searchQuery.trim().length >= 2) {
            throttleSearchUsers();
        }
    }, [searchQuery]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[500px] max-h-[85vh] p-0 gap-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
                    <DialogTitle className="text-lg font-semibold text-foreground">Add Friend</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground mt-1">
                        Search for people by username or name to send them a friend request.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col h-full">
                    {/* Search Input */}
                    <div className="px-6 py-4 border-b border-border bg-muted/30">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by username or name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-10 h-11 bg-background border-border focus:ring-2 focus:ring-primary/20"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSearchResults([]);
                                    }}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Search Results */}
                    <div className="flex-1 px-6 py-4 min-h-[300px]">
                        {isSearching ? (
                            <div className="space-y-3">
                                {Array.from({ length: 4 }, (_, i) => (
                                    <SearchResultSkeleton key={i} />
                                ))}
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-foreground">
                                        {searchResultsCount} {searchResultsCount === 1 ? "person" : "people"} found
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Showing {searchResults.length} of {searchResultsCount}
                                    </p>
                                </div>
                                <ScrollArea className="h-[280px] pr-2">
                                    <div className="space-y-2">
                                        {searchResults.map((user) => (
                                            <SearchResultCard
                                                key={user.id}
                                                user={user}
                                                onSendRequest={console.log}
                                            />
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        ) : searchQuery.trim().length >= 2 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                    <Search className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-base font-semibold mb-2 text-foreground">No people found</h3>
                                <p className="text-sm text-muted-foreground max-w-[280px]">
                                    We couldn't find anyone matching "<span className="font-medium">{searchQuery}</span>". Try a different search term.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <UserPlus className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-base font-semibold mb-2 text-foreground">Find your friends</h3>
                                <p className="text-sm text-muted-foreground max-w-[280px]">
                                    Start typing to search for people by their username or name.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function SearchResultCard({
    user,
    onSendRequest
}: {
    user: User;
    onSendRequest: (user: FriendRequest["requester"]) => void;
}) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
                <Avatar className="h-11 w-11 flex-shrink-0 ring-2 ring-background">
                    <AvatarImage src={user.profileImage} className="object-cover" />
                    <AvatarFallback className="text-sm font-medium bg-primary/10 text-primary">
                        {user.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-sm text-foreground truncate leading-tight">{user.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                </div>
            </div>
            <Button
                size="sm"
                onClick={() => onSendRequest(user)}
                className="px-3 h-8 text-xs font-medium shrink-0 shadow-sm hover:shadow-md transition-all"
            >
                <UserPlus className="h-3 w-3 mr-1.5" />
                <span>Add</span>
            </Button>
        </div>
    );
}

function SearchResultSkeleton() {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div className="flex items-center space-x-3 flex-1">
                <Skeleton className="h-11 w-11 rounded-full flex-shrink-0" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <Skeleton className="h-8 w-14 flex-shrink-0 rounded-md" />
        </div>
    );
}
