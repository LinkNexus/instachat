import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useApiFetch} from "@/lib/fetch.ts";
import {useAppStore} from "@/lib/store.ts";
import type {FriendRequest, User} from "@/types.ts";
import {Check, Clock, Loader2, UserPlus, X} from "lucide-react";
import type {UserSearchResult} from "@/pages/Friends/components/AddFriendModal/index.tsx";
import {useState} from "react";

export function SearchResultCard({result}: { result: UserSearchResult; }) {
  const {user, friendRequest: request} = result;

  return (
    <div
      className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group">
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <Avatar className="h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 ring-2 ring-background">
          <AvatarImage src={user.profileImage} className="object-cover"/>
          <AvatarFallback className="text-xs sm:text-sm font-medium bg-primary/10 text-primary">
            {user.name.split(' ').map((n: string) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-sm sm:text-base text-foreground truncate leading-tight">{user.name}</h4>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">@{user.username}</p>
        </div>
      </div>
      <Actions user={user} request={request}/>
    </div>
  );
}

function Actions({request, user}: { request: FriendRequest | null, user: User }) {
  const {addRequest, deleteRequest} = useAppStore.getState().friendsActions;
  const [currentRequest, setCurrentRequest] = useState(request);

  const {loading: isSending, callback: sendFriendRequest} = useApiFetch("/api/friend-requests", {
    method: "POST",
    onSuccess(request: FriendRequest) {
      addRequest("sent", request);
      setCurrentRequest(request);
    }
  });

  const {loading: isCancelling, callback: cancelFriendRequest} = useApiFetch(`/api/friend-requests/${currentRequest?.id || 0}`, {
    method: "DELETE",
    onSuccess: () => {
      deleteRequest(request?.id || 0);
      setCurrentRequest(null);
    }
  }, [currentRequest?.id]);

  const {loading: isAccepting, callback: acceptFriendRequest} = useApiFetch(`/api/friend-requests/${currentRequest?.id || 0}/accept`, {
    method: "PUT",
    onSuccess: (request: FriendRequest) => {
      addRequest("accepted", request);
      setCurrentRequest(request);
    }
  }, [currentRequest?.id]);

  // No existing request - show Add Friend button
  if (!currentRequest) {
    return (
      <Button
        size="sm"
        onClick={async () => {
          await sendFriendRequest({
            searchParams: {
              targetUserId: user.id
            }
          })
        }}
        disabled={isSending}
        className="px-2 sm:px-3 h-8 text-xs font-medium shrink-0 shadow-sm hover:shadow-md transition-all"
      >
        {isSending ? (
          <Loader2 className="animate-spin h-3 w-3 sm:h-4 sm:w-4"/>
        ) : (
          <UserPlus className="h-3 w-3 sm:h-4 sm:w-4"/>
        )}
        <span className="hidden sm:inline ml-1.5">Add</span>
      </Button>
    );
  }

  // Current user sent the request
  if (currentRequest.requester.id === user.id) {
    return null; // This user is in the search results but they sent us a request
  }

  // Current user received the request or sent the request
  switch (currentRequest.status) {
    case "pending":
      // If we sent the request
      if (currentRequest.targetUser.id === user.id) {
        return (
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Badge variant="outline" className="px-2 py-1 text-xs">
              <Clock className="h-3 w-3 mr-1"/>
              <span className="hidden sm:inline">Pending</span>
              <span className="sm:hidden">Sent</span>
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                await cancelFriendRequest({
                  data: {requestId: currentRequest.id}
                })
              }}
              disabled={isCancelling}
              className="px-2 h-8 text-xs shrink-0"
            >
              {isCancelling ? (
                <Loader2 className="animate-spin h-3 w-3"/>
              ) : (
                <X className="h-3 w-3"/>
              )}
              <span className="hidden sm:inline ml-1">Cancel</span>
            </Button>
          </div>
        );
      }
      // If they sent us the request
      else {
        return (
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              size="sm"
              onClick={async () => {
                await acceptFriendRequest({
                  data: {requestId: currentRequest.id}
                })
              }}
              disabled={isAccepting}
              className="px-2 sm:px-3 h-8 text-xs font-medium shrink-0"
            >
              {isAccepting ? (
                <Loader2 className="animate-spin h-3 w-3"/>
              ) : (
                <Check className="h-3 w-3"/>
              )}
              <span className="hidden sm:inline ml-1">Accept</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                await cancelFriendRequest({
                  data: {requestId: currentRequest.id}
                })
              }}
              disabled={isCancelling}
              className="px-2 h-8 text-xs shrink-0"
            >
              {isCancelling ? (
                <Loader2 className="animate-spin h-3 w-3"/>
              ) : (
                <X className="h-3 w-3"/>
              )}
              <span className="hidden sm:inline ml-1">Reject</span>
            </Button>
          </div>
        );
      }

    case "accepted":
      return (
        <Badge variant="secondary" className="px-2 sm:px-3 py-1 text-xs">
          <Check className="h-3 w-3 mr-1"/>
          <span>Friends</span>
        </Badge>
      );

    default:
      return null;
  }
}
